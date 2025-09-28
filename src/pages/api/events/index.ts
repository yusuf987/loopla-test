import { NextApiRequest, NextApiResponse } from 'next';
import { getEvents, createEvent } from '../../../lib/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const events = await getEvents();
    res.status(200).json(events);
    return;
  }

  if (req.method === 'POST') {
    try {
      const { title, description = '', date, location } = req.body;
      if (!title || !date || !location) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const created = await createEvent({
        title: String(title).trim(),
        description: String(description).trim(),
        date: new Date(date).toISOString(),
        location: String(location).toUpperCase(),
      });

      res.status(201).json(created);
      return;
    } catch (err) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
