import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfilesService } from './profiles.service';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { Roles } from 'src/common/roles.decorator';
import { GlobalRole } from '@prisma/client';
import { UpdateProfile } from './dto/update-profile.dto';
import { RolesGuard } from 'src/common/roles.guard';
import { ChangeStatus } from './dto/change-stauts.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() req: { user: JwtPayload }) {
    return this.profiles.getUserProfileById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMyProfile(
    @Request() req: { user: JwtPayload },
    @Body() updateProfile: UpdateProfile,
  ) {
    return this.profiles.updateMyProfile(req.user.sub, updateProfile);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN)
  @Patch("change-status/:id")
  changeStatusStudent(@Param('id') userId: string, @Body() changeStatus: ChangeStatus) {
    return this.profiles.changeStatusStudent(userId, changeStatus.status)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN, GlobalRole.TEACHER)
  @Get(':id')
  async getStudentProfile(@Param('id') userId: string) {
    const user = await this.profiles.getUserProfileById(userId);
    if (user?.profile?.role === GlobalRole.STUDENT) return user;
    throw new ForbiddenException('You are not allowed to see that profile');
  }
}
