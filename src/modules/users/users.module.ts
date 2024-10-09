import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseWrapperService } from 'src/opin_wrapper/opin-wrapper.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, MongooseWrapperService],
})
export class UsersModule {}
