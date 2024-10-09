import { Injectable, Logger } from "@nestjs/common";
import { Model, Document } from "mongoose";
import { FindAllDto } from 'src/lib/find.dto';

@Injectable()
export class MongooseWrapperService {
  private readonly logger = new Logger(MongooseWrapperService.name);

  constructor() {}

  // Fetch all documents with pagination, sorting, field selection, etc.
  async findAll<T extends Document>(
    model: Model<T>,
    filter: FindAllDto,
  ): Promise<{ data: T[]; count: number }> {
    this.logger.log('Fetching all documents with optional features');

    const {
      query = {}, // Default to no filtering
      sort = {}, // Default to no sorting
      only = '', // Default to no field selection
      // eslint-disable-next-line prefer-const
      skip = 0, // Default to first page
      // eslint-disable-next-line prefer-const
      limit = 1000, // Default limit to 10 documents per page
      include = null, // Default to no population
    } = filter;

    try {
      const queryFilter = { ...query, deleted_at: 'false' };
      const sortBy = { ...sort, updated_at: -1 };
      // Fetch total count of documents based on the query filter (ignores pagination)
      const count = await model.countDocuments(queryFilter);

      // Mongoose query with filtering, sorting, field selection, pagination, and population
      let mongooseQuery = model
        .find(queryFilter) // Apply the query filter here
        .sort(sortBy) // Apply sorting
        .select(only) // Select specific fields
        .skip(skip) // Skip documents for pagination
        .limit(limit); // Limit documents for pagination

      // Handle population of fields
      if (include && Array.isArray(include)) {
        include.forEach((field) => {
          if (typeof field === 'string') {
            mongooseQuery = mongooseQuery.populate(field); // Simple populate
          } else if (field.path) {
            mongooseQuery = mongooseQuery.populate(field); // Populate with path and select
          }
        });
      }

      const data = await mongooseQuery.exec(); // Execute the query

      return { count, data }; // Return the paginated data and total count
    } catch (error) {
      this.logger.error(`Failed to fetch documents: ${error.message}`);
      throw error;
    }
  }

  // Fetch a single document by ID
  async findOne<T extends Document>(
    model: Model<T>,
    id: string,
  ): Promise<T | null> {
    this.logger.log(`Fetching document with ID: ${id}`);
    try {
      return await model.findById(id).exec();
    } catch (error) {
      this.logger.error(
        `Failed to fetch document with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  // Create a new document
  async create<T extends Document>(
    model: Model<T>,
    createDto: any,
  ): Promise<T> {
    this.logger.log('Creating a new document');
    try {
      const createdModel = new model(createDto);
      return await createdModel.save();
    } catch (error) {
      this.logger.error(`Failed to create document: ${error.message}`);
      throw error;
    }
  }

  // Update an existing document by ID
  async update<T extends Document>(
    model: Model<T>,
    id: string,
    updateDto: any,
  ): Promise<T | null> {
    this.logger.log(`Updating document with ID: ${id}`);
    try {
      return await model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    } catch (error) {
      this.logger.error(
        `Failed to update document with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  // Soft delete a document by ID (sets deleted_at field)
  async delete<T extends Document>(
    model: Model<T>,
    id: string,
  ): Promise<T | null> {
    this.logger.log(`Soft deleting document with ID: ${id}`);
    try {
      return await model
        .findByIdAndUpdate(
          id,
          { deleted_at: new Date().toISOString() },
          { new: true },
        )
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to soft delete document with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  // Restore a soft-deleted document
  async restore<T extends Document>(
    model: Model<T>,
    id: string,
  ): Promise<T | null> {
    this.logger.log(`Restoring soft-deleted document with ID: ${id}`);
    try {
      return await model
        .findByIdAndUpdate(id, { deleted_at: null }, { new: true })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to restore document with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  // Permanently delete a document by ID (if needed for hard delete)
  async hardDelete<T extends Document>(
    model: Model<T>,
    id: string,
  ): Promise<T | null> {
    this.logger.log(`Permanently deleting document with ID: ${id}`);
    try {
      return await model.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error(
        `Failed to permanently delete document with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
