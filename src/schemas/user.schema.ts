import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['ADMIN', 'USER'] },
});

export interface User extends Document {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}
