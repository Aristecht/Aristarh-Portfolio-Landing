import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ProjectStatus } from '../../../prisma/generated/prisma/enums';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { existsSync, promises as fs } from 'fs';
import { join, resolve } from 'path';

const uploadPathCandidates = [
  resolve(process.cwd(), 'uploads'),
  resolve(__dirname, '..', '..', '..', 'uploads'),
  resolve(__dirname, '..', '..', '..', '..', 'uploads'),
];

const uploadsDir =
  uploadPathCandidates.find(candidate => existsSync(candidate)) ||
  uploadPathCandidates[0];

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(status?: ProjectStatus) {
    return await this.prismaService.project.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prismaService.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }
    return project;
  }

  async createProject(dto: CreateProjectDto, imageUrl?: string) {
    return await this.prismaService.project.create({
      data: { ...dto, imageUrl },
    });
  }

  async updateProject(id: string, dto: UpdateProjectDto, imageUrl?: string) {
    const project = await this.findOne(id);

    if (imageUrl && project.imageUrl && project.imageUrl !== imageUrl) {
      try {
        const oldFilePath = join(
          uploadsDir,
          project.imageUrl.replace(/^\/+/, '').replace(/^uploads\//, ''),
        );
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.warn(
          `Не удалось удалить старый файл: ${project.imageUrl}`,
          error,
        );
      }
    }

    return await this.prismaService.project.update({
      where: { id },
      data: {
        ...dto,
        ...(imageUrl && { imageUrl }),
      },
    });
  }

  async removeProject(id: string) {
    const project = await this.findOne(id);

    if (project.imageUrl) {
      try {
        const filePath = join(
          uploadsDir,
          project.imageUrl.replace(/^\/+/, '').replace(/^uploads\//, ''),
        );
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Не удалось удалить файл: ${project.imageUrl}`, error);
      }
    }

    return await this.prismaService.project.delete({
      where: { id },
    });
  }
}
