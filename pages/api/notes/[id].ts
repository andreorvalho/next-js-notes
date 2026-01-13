import prisma from '@lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_GET, HTTP_PUT } from '@/types';
import { z } from 'zod';
import { splitContentIntoPages } from '@/lib/contentSplitter';
import { mergePagesIntoContent } from '@/lib/contentMerger';
import type { Note } from '@/types';

const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === HTTP_GET) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    try {
      const note = await prisma.note.findUnique({
        where: { id: parseInt(id) },
        include: {
          pages: {
            orderBy: { pageNumber: 'asc' },
          },
        },
      });

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      // Merge pages into content (transparent to UI)
      const pages = Array.isArray(note.pages) ? note.pages : [];
      const noteWithContent: Note = {
        id: note.id,
        title: note.title,
        content: mergePagesIntoContent(pages),
        created_at: note.created_at,
        updated_at: note.updated_at,
      };

      return res.status(200).json(noteWithContent);
    } catch (error) {
      console.error('Error fetching note:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      return res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
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
      // Split content into pages
      const pageContents = splitContentIntoPages(content);

      // Delete existing pages and create new ones
      const note = await prisma.note.update({
        where: { id: parseInt(id) },
        data: {
          title,
          pages: {
            deleteMany: {}, // Delete all existing pages
            create: pageContents.map((pageContent, index) => ({
              content: pageContent,
              pageNumber: index + 1,
            })),
          },
        },
        include: {
          pages: {
            orderBy: { pageNumber: 'asc' },
          },
        },
      });

      // Return note with merged content (transparent to UI)
      const pages = Array.isArray(note.pages) ? note.pages : [];
      const noteWithContent: Note = {
        id: note.id,
        title: note.title,
        content: mergePagesIntoContent(pages),
        created_at: note.created_at,
        updated_at: note.updated_at,
      };

      return res.status(200).json(noteWithContent);
    } catch (error) {
      console.error('Error updating note:', error);
      return res.status(500).json({ error: 'Failed to update note' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
