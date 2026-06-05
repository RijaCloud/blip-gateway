import { FilterQuery } from 'mongoose';
import { HttpError } from '../utils/httpError';
import { ExampleItemModel } from '../models/exampleItem.model';
import type { CreateExampleItemInput, UpdateExampleItemInput } from '../validators/exampleItem.schema';

export class ExampleItemService {
  async list(filters?: { isActive?: boolean; tag?: string }) {
    const query: FilterQuery<typeof ExampleItemModel> = {};

    if (typeof filters?.isActive === 'boolean') {
      query.isActive = filters.isActive;
    }

    if (filters?.tag) {
      query.tags = filters.tag;
    }

    return ExampleItemModel.find(query).sort({ createdAt: -1 }).lean();
  }

  async getById(id: string) {
    const item = await ExampleItemModel.findById(id).lean();

    if (!item) {
      throw new HttpError(404, 'Ressource introuvable.', 'EXAMPLE_ITEM_NOT_FOUND');
    }

    return item;
  }

  async create(payload: CreateExampleItemInput) {
    try {
      const item = await ExampleItemModel.create(payload);
      return item.toObject();
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new HttpError(409, 'Un enregistrement avec ce slug existe deja.', 'EXAMPLE_ITEM_DUPLICATE');
      }

      throw error;
    }
  }

  async update(id: string, payload: UpdateExampleItemInput) {
    try {
      const item = await ExampleItemModel.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
      ).lean();

      if (!item) {
        throw new HttpError(404, 'Ressource introuvable.', 'EXAMPLE_ITEM_NOT_FOUND');
      }

      return item;
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new HttpError(409, 'Un enregistrement avec ce slug existe deja.', 'EXAMPLE_ITEM_DUPLICATE');
      }

      throw error;
    }
  }

  async remove(id: string) {
    const item = await ExampleItemModel.findByIdAndDelete(id).lean();

    if (!item) {
      throw new HttpError(404, 'Ressource introuvable.', 'EXAMPLE_ITEM_NOT_FOUND');
    }

    return item;
  }
}
