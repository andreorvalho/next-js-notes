import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type { Request, Response } from '@/types';
import { HTTP_GET, HTTP_POST } from '@/types';

const prisma = new PrismaClient();

const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export default async function handler(req: Request, res: Response) {
  if (req.method === HTTP_POST) {
    const parseResult = noteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { title, content } = parseResult.data;
    const note = await prisma.note.create({ data: { title, content } });
    return res.status(201).json(note);
  }

  if (req.method === HTTP_GET) {
    const notes = await prisma.note.findMany();
    return res.json(notes);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
