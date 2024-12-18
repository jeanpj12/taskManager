import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import z from 'zod'

class TaskController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            title: z.string(),
            description: z.string().optional(),
            priority: z.enum(['high', 'medium', 'low']),
            assigned_to: z.string(),
            team_id: z.string()
        })

        const { title, description, priority, assigned_to, team_id } = bodySchema.parse(req.body)

        const user = await prisma.user.findFirst({
            where: { id: assigned_to }
        })

        if (!user) {
            throw new AppError('User not found.')
        }

        const team = await prisma.teams.findFirst({
            where: {
                id: team_id
            }
        })

        if (!team) {
            throw new AppError('Team not found')
        }

        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                status: 'pending',
                priority,
                assignedTo: assigned_to,
                teamId: team_id
            }
        })

        if (!req.user?.id) {
            throw new AppError('Authenticated user ID not found.', 401);
        }

        await prisma.taskHistory.create({
            data: {
                taskId: task.id,
                changedBy: req.user.id,
                newStatus: task.status,
                oldStatus: task.status
            }
        })

        res.status(201).json()
    }

    async index(req: Request, res: Response) {
        const paramSchema = z.object({
            user_id: z.string()
        })

        const { user_id } = paramSchema.parse(req.params)

        const user = await prisma.user.findFirst({
            where: {
                id: user_id
            }
        })

        if (!user) {
            throw new AppError('User not found')
        }

        const data = await prisma.tasks.findMany({
            where: {
                assignedTo: user_id
            },
            include: {
                user: { select: { name: true, email: true } },
                team: { select: { name: true } }
            }
        })

        res.json(data)
    }

    async update(req: Request, res: Response) {

        const bodySchema = z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            assigned_to: z.string().optional(),
            team_id: z.string().optional(),
        })

        const paramSchema = z.object({
            task_id: z.string()
        })

        const { title, description, assigned_to, team_id } = bodySchema.parse(req.body)
        const parsedBody = bodySchema.parse(req.body);
        const { task_id } = paramSchema.parse(req.params)

        if (Object.keys(parsedBody).length === 0) {
            throw new AppError('At least one field must be provided.');
        }

        const task = await prisma.tasks.findFirst({
            where: {
                id: task_id
            }
        })

        if (!task) {
            throw new AppError('Task not found')
        }

        await prisma.tasks.update({
            data: {
                title,
                description,
                assignedTo: assigned_to,
                teamId: team_id
            },
            where: {
                id: task_id
            }
        })

        res.json()
    }
}

export { TaskController }