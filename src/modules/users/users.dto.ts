import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString({
    message: 'Name must be string',
  })
  @IsNotEmpty({ message: 'Nama is required' })
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['INTERN', 'ADMIN', 'ENGINEER'], {
    message: 'Valid role required',
  })
  role: 'INTERN' | 'ADMIN' | 'ENGINEER';
}

export class UpdateUserDTO {
  name?: string;
  email?: string;
  role?: 'INTERN' | 'ADMIN' | 'ENGINEER';
}
