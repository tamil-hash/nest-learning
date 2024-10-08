import { Schema } from 'mongoose';
import { generateRandomId } from 'src/lib/utils';

export function timestampsPlugin(schema: Schema) {
  // Add created_at, updated_at, and deleted_at fields to the schema
  schema.add({
    created_at: { type: String, default: new Date().toISOString() },
    updated_at: { type: String, default: new Date().toISOString() },
    deleted_at: { type: String, default: 'false' },
    _id: {
      type: String,
      default: () => generateRandomId(8),
    },
  });

  // Pre-save hook to set created_at and updated_at
  schema.pre('save', function (next) {
    const now = new Date().toISOString();
    this.updated_at = now;

    if (!this.created_at) {
      this.created_at = now;
    }

    next();
  });

  // Pre-update hook for `findOneAndUpdate`, `updateOne`, `updateMany` to update `updated_at`
  schema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
    this.set({ updated_at: new Date().toISOString() });
    next();
  });

  // Soft delete method
  schema.methods.softDelete = function () {
    this.deleted_at = new Date().toISOString();
    return this.save();
  };

  // Static method to find not deleted documents
  schema.statics.findNotDeleted = function () {
    return this.find({ deleted_at: { $eq: 'false' } });
  };

  // Static method to restore soft-deleted documents
  schema.statics.restore = function (id: string) {
    return this.findByIdAndUpdate(id, { deleted_at: 'false' });
  };
}
