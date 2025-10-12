import { PrismaClient } from '@prisma/client';
import { Request, Response, HTTP_GET, HTTP_POST } from '../../types';
import { z } from 'zod';

const prisma = new PrismaClient();

export default async function handler(req: Request, res: Response) {
  if (req.method === HTTP_GET) {
    const users = await prisma.user.findMany();
    return res.json(users);
  }

  if (req.method === HTTP_POST) {
    const userSchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string(),
    });

    const parseResult = userSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const newUser = await prisma.user.create({ data: parseResult.data });
    return res.status(201).json(newUser);
  }
}
