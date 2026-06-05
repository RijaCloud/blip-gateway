import { Router } from 'express';
import { z } from 'zod';
import { requireApiKey } from '../middleware/auth';
import { strictLimiter } from '../middleware/rateLimit';
import { ExampleItemService } from '../services/exampleItemService';
import { createExampleItemSchema, updateExampleItemSchema } from '../validators/exampleItem.schema';

const router = Router();
const service = new ExampleItemService();

router.get('/', async (req, res, next) => {
  try {
    const query = z.object({
      isActive: z.enum(['true', 'false']).optional(),
      tag: z.string().trim().min(1).max(50).optional()
    }).parse(req.query);

    const items = await service.list({
      isActive: query.isActive ? query.isActive === 'true' : undefined,
      tag: query.tag
    });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const params = z.object({
      id: z.string().trim().min(1)
    }).parse(req.params);

    const item = await service.getById(params.id);

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireApiKey, strictLimiter, async (req, res, next) => {
  try {
    const payload = createExampleItemSchema.parse(req.body);
    const item = await service.create(payload);

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireApiKey, strictLimiter, async (req, res, next) => {
  try {
    const params = z.object({
      id: z.string().trim().min(1)
    }).parse(req.params);

    const payload = updateExampleItemSchema.parse(req.body);
    const item = await service.update(params.id, payload);

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireApiKey, strictLimiter, async (req, res, next) => {
  try {
    const params = z.object({
      id: z.string().trim().min(1)
    }).parse(req.params);

    await service.remove(params.id);

    res.json({
      success: true
    });
  } catch (error) {
    next(error);
  }
});

export default router;
