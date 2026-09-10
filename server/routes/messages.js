import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Message from '../models/Message.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    const saved = await Message.create(req.body);
    return res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    return res.status(400).json({ error: 'Could not send message', detail: err.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch messages', detail: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Message not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: 'Could not update message', detail: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete message', detail: err.message });
  }
});

export default router;
