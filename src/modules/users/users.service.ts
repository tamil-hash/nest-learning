import { Injectable } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { MongooseWrapperService } from 'src/opin_wrapper/opin-wrapper.service';
import { FindAllDto } from 'src/lib/find.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly mongooseWrapperService: MongooseWrapperService,
  ) {}

  findAll(query: FindAllDto) {
    return this.mongooseWrapperService.findAll(this.userModel, query);
  }

  // findOne(id: number) {
  //   const user = this.users.find((user) => user.id === id);

  //   return user;
  // }

  // create(user: CreateUserDTO) {
  //   const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id);
  //   const newUser = {
  //     id: usersByHighestId[0].id + 1,
  //     ...user,
  //   };
  //   this.users.push(newUser);
  //   return newUser;
  // }

  // update(id: number, updatedUser: UpdateUserDTO) {
  //   this.users = this.users.map((user) => {
  //     if (user.id === id) {
  //       return { ...user, ...updatedUser };
  //     }
  //     return user;
  //   });

  //   return this.findOne(id);
  // }

  // delete(id: number) {
  //   const removedUser = this.findOne(id);

  //   this.users = this.users.filter((user) => user.id !== id);

  //   return removedUser;
  // }
}
