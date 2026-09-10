import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Service from '../models/Service.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ published: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json(services);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch services', detail: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    return res.status(201).json(service);
  } catch (err) {
    return res.status(400).json({ error: 'Could not create service', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    return res.status(200).json(service);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch service', detail: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: 'Could not update service', detail: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete service', detail: err.message });
  }
});

export default router;
