import { ProjectsService } from './projects.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProjectStatus } from '../../../prisma/generated/prisma/enums';
import { JwtAuthGuard } from '../../shared/guards/jwt-access.auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';

const storage = diskStorage({
  destination: './uploads',
  filename: (_: any, file: Express.Multer.File, cb: Function) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});

const fileFilter = (_: any, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Только изображения (jpg, jpeg, png, webp'), false);
  }
  cb(null, true);
};

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Query('status') status?: ProjectStatus) {
    return this.projectsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @Body() dto: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.projectsService.createProject(dto, imageUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.projectsService.updateProject(id, dto, imageUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.removeProject(id);
  }
}
