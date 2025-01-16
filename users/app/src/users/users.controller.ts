import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { UsersServise } from './users.service'
import { UserCreateDto, UserDto, UserFilterManyDto, UserUpdateDto } from './users.dto'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersServise) {}

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiParam({ name: 'id' })
  @Get(':id')
  public async getById(@Param('id') id: string) {
    const user = await this.service.get({ id })
    if (!user) throw new BadRequestException({ success: false, message: 'User does not exit' })
    return user
  }

  @ApiOperation({ summary: 'Get filtered users' })
  @ApiQuery({ name: 'offset', example: 0, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  @HttpCode(HttpStatus.OK)
  @Post('list')
  public async getMany(
    @Body() filter: UserFilterManyDto,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.service.getMany(filter, { offset, limit })
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  @Post()
  public async create(@Body() payload: UserCreateDto) {
    const user = await this.service.get({ email: payload.email })
    if (user)
      throw new ConflictException({
        success: false,
        message: 'User with the same email already exist',
      })
    return await this.service.create(payload)
  }

  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Put(':id')
  public async update(@Param('id') id: string, @Body() payload: UserUpdateDto) {
    const user = await this.service.get({ id })
    if (!user)
      throw new BadRequestException({
        success: false,
        message: 'User does not exist',
      })
    return await this.service.update(user, payload)
  }

  @ApiOperation({ summary: 'Delete an existing user' })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Delete(':id')
  public async delete(@Param('id') id: string) {
    const user = await this.service.get({ id })
    if (!user)
      throw new BadRequestException({
        success: false,
        message: 'User does not exist',
      })
    return await this.service.delete(id)
  }
}
