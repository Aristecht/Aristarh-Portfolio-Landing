import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';

@Injectable()
export class PricesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.price.findMany({
      orderBy: { priceFrom: 'asc' },
    });
  }

  async findOne(id: string) {
    const price = await this.prismaService.price.findUnique({ where: { id } });
    if (!price) throw new NotFoundException(`Price ${id} not found`);
    return price;
  }

  async create(dto: CreatePriceDto) {
    return await this.prismaService.price.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdatePriceDto) {
    await this.findOne(id);
    return this.prismaService.price.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prismaService.price.delete({
      where: {
        id,
      },
    });
  }
}
