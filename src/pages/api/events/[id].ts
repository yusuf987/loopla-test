import { NextApiRequest, NextApiResponse } from 'next';
import { getEventById } from '../../../lib/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const event = await getEventById(id);
  if (!event) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.status(200).json(event);
}
