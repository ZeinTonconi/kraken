import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GlobalRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourses } from './dto/create-courses.dto';
import { UpdateCourses } from './dto/update-courses.dto';
import { JwtPayload } from 'src/auth/jwt.strategy';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN)
  @Post('')
  createCourses(@Body() course: CreateCourses) {
    return this.coursesService.createCourses(course);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.ADMIN)
  @Put(':id')
  updateCourse(@Param('id') courseId: string, @Body() course: UpdateCourses) {
    return this.coursesService.updateCourse(courseId, course);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalRole.TEACHER)
  @Get('my-courses')
  getMyCourses(
    @Request() req: { user: JwtPayload },
    @Query('term') termId?: string,
  ) {
    return this.coursesService.getMyCourses(req.user.sub, termId);
  }
}
