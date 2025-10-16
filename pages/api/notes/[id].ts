import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_GET, HTTP_PUT } from '@/types';
import { z } from 'zod';

const prisma = new PrismaClient();

const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === HTTP_GET) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    try {
      const note = await prisma.note.findUnique({
        where: { id: parseInt(id) }
      });

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      return res.json(note);
    } catch (error) {
      console.error('Error fetching note:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === HTTP_PUT) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    const parseResult = noteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { title, content } = parseResult.data;

    try {
      const note = await prisma.note.update({
        where: { id: parseInt(id) },
        data: { title, content }
      });

      return res.json(note);
    } catch (error) {
      console.error('Error updating note:', error);
      return res.status(500).json({ error: 'Failed to update note' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
