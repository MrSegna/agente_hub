import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/AppError';

export abstract class BaseService<T extends { id: string }> {
  constructor(
    protected prisma: PrismaClient,
    protected model: keyof PrismaClient,
    protected modelName: string
  ) {}

  protected abstract transformOutput(item: T): any;
  protected abstract transformInput(data: any): Partial<T>;

  async findAll(where = {}, include = {}, orderBy = { createdAt: 'desc' as const }): Promise<any[]> {
    const items = await (this.prisma[this.model] as any).findMany({
      where,
      include,
      orderBy,
    });
    return items.map(item => this.transformOutput(item));
  }

  async findById(id: string, include = {}): Promise<any> {
    const item = await (this.prisma[this.model] as any).findUnique({
      where: { id },
      include,
    });

    if (!item) {
      throw new NotFoundError(this.modelName);
    }

    return this.transformOutput(item);
  }

  async create(data: any): Promise<any> {
    const transformedData = this.transformInput(data);
    const item = await (this.prisma[this.model] as any).create({
      data: transformedData,
    });
    return this.transformOutput(item);
  }

  async update(id: string, data: any): Promise<any> {
    await this.findById(id);

    const transformedData = this.transformInput(data);
    const updatedItem = await (this.prisma[this.model] as any).update({
      where: { id },
      data: transformedData,
    });

    return this.transformOutput(updatedItem);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await (this.prisma[this.model] as any).delete({
      where: { id },
    });
  }

  async count(where = {}): Promise<number> {
    return await (this.prisma[this.model] as any).count({
      where,
    });
  }
}