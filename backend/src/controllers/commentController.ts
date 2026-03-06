import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  targetType: z.enum(['DRIVER', 'SACCO', 'APP']),
  targetId: z.string().optional(),
});

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, rating, targetType, targetId } = commentSchema.parse(req.body);
    const userId = req.user!.id;

    const comment = await prisma.comment.create({
      data: { userId, content, rating, targetType, targetId },
    });

    res.status(201).json(comment);
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: 'Validation error', errors: error.issues });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { targetType, targetId } = req.query;
    const comments = await prisma.comment.findMany({
      where: {
        ...(targetType ? { targetType: targetType as string } : {}),
        ...(targetId ? { targetId: targetId as string } : {}),
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
