import fs from 'fs/promises';
import path from 'path';
import { Event } from '../types/event';

const DATA_PATH = path.join(process.cwd(), 'data', 'events.json');

async function readFileSafe(): Promise<Event[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as Event[];
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
      await fs.writeFile(DATA_PATH, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
}

async function writeFileSafe(events: Event[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(events, null, 2), 'utf-8');
}

export async function getEvents(): Promise<Event[]> {
  return await readFileSafe();
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const events = await readFileSafe();
  return events.find((e) => e.id === id);
}

export async function createEvent(data: Omit<Event, 'id'>): Promise<Event> {
  const events = await readFileSafe();
  const id = Date.now().toString();
  const toSave: Event = { id, ...data };
  events.push(toSave);
  await writeFileSafe(events);
  return toSave;
}
