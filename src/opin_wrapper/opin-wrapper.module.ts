import { Module, Global } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

// MongooseWrapperService to provide custom methods
import { MongooseWrapperService } from './opin-wrapper.service';
import { timestampsPlugin } from 'src/middleware/baseSchema';
import mongoose from 'mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (): Promise<MongooseModuleOptions> => ({
        uri: 'mongodb://localhost/code_execution',
      }),
      inject: [],
    }),
  ],
  providers: [MongooseWrapperService],
  exports: [MongooseWrapperService],
})
export class MongooseWrapperModule {
  constructor() {
    mongoose.plugin(timestampsPlugin);
  }
}
