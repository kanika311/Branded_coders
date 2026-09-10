import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Portfolio from '../models/Portfolio.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const items = await Portfolio.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch portfolio', detail: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const item = await Portfolio.create(req.body);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: 'Could not create project', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json(item);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch project', detail: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: 'Could not update project', detail: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete project', detail: err.message });
  }
});

export default router;
