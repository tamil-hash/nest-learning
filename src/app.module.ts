import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MongooseWrapperModule } from './opin_wrapper/opin-wrapper.module';
import { TodoController } from './modules/todo/todo.controller';
import { TodoModule } from './modules/todo/todo.module';
@Module({
  imports: [MongooseWrapperModule, UsersModule, TodoModule],
  controllers: [AppController, TodoController],
  providers: [AppService],
})
export class AppModule {}
