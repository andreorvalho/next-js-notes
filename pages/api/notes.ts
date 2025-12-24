import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_GET, HTTP_POST } from '@/types';

const prisma = new PrismaClient();

const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === HTTP_POST) {
    const parseResult = noteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { title, content } = parseResult.data;
    try {
      const note = await prisma.note.create({ data: { title, content } });
      return res.status(200).json(note);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create note' });
    }
  }

  if (req.method === HTTP_GET) {
    const { search, orderBy, orderDirection } = req.query;

    const where = search
      ? {
          OR: [
            {
              title: {
                contains: search as string,
                mode: 'insensitive' as const,
              },
            },
            {
              content: {
                contains: search as string,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const orderByField = (orderBy as string) || 'updated_at';
    const orderDirectionValue = orderDirection === 'asc' ? 'asc' : 'desc';

    try {
      const notes = await prisma.note.findMany({
        where,
        orderBy: { [orderByField]: orderDirectionValue },
      });
      return res.json(notes);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
