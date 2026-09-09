import jwt from 'jsonwebtoken';

export function requireAuth(req, res) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Missing or invalid authorization token' });
    return null;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (err) {
    res.status(401).json({ error: 'Session expired, please log in again' });
    return null;
  }
}
