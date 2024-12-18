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

        if(!user){
            throw new AppError('User not found.')
        }

        const team = await prisma.teams.findFirst({
            where: {
                id: team_id
            }
        })

        if(!team){
            throw new AppError('Team not found')
        }

        await prisma.tasks.create({
            data: {
                title,
                description,
                status: 'pending',
                priority,
                assignedTo: assigned_to,
                teamId: team_id
            }
        })

        res.status(201).json
    }
}