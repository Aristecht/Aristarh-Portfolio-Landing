import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ProjectStatus } from '../../../prisma/generated/prisma/enums';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { promises as fs } from 'fs';
import { join } from 'path';

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
        const oldFilePath = join(process.cwd(), project.imageUrl);
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
        const filePath = join(process.cwd(), project.imageUrl);
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
