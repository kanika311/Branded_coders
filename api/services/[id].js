import { connectDB, applyCors } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import Service from '../models/Service.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    return res.status(200).json(service);
  }

  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'PUT') {
    const updated = await Service.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
