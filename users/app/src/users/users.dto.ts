import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UserDto implements User {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  email: string
}

export class UserFilterManyDto implements UserFilterMany {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string
}

export class UserCreateDto extends UserDto implements UserCreate {}
export class UserUpdateDto implements UserUpdate {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string
}
