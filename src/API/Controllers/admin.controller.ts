import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from 'src/CORE/Applications/Features/User/user.service';
import { Roles } from 'src/Shared/Common/Decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private userService: UserService) {}

  // GET: /api/v1/admin/users
  @Get('users')
  @ApiOperation({ summary: 'List all users - admin only ' })
  @HttpCode(HttpStatus.OK)
  async findAllUsers() {
    return await this.userService.findAllUser();
  }

  // DELETE: /api/v1/admin/users/2
  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a users - admin only ' })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.userService.DeleteUser(id);
  }
}
