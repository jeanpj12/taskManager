import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import z from 'zod'

class TeamsMemberController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            user_id: z.string(),
            team_id: z.string()
        })

        const { user_id, team_id } = bodySchema.parse(req.body)

        const user = await prisma.user.findFirst({
            where: { id: user_id }
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

        const existingMembership = await prisma.teamMembers.findFirst({
            where: { userId: user_id, teamId: team_id }
        })

        if (existingMembership) {
            throw new AppError('This user is already a member of the specified team.', 409);
        }

        await prisma.teamMembers.create({
            data: {
                userId: user_id,
                teamId: team_id
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

        const data = await prisma.teamMembers.findMany({
            where: {
                userId: user_id
            },
            include: {
                user: { select: { name: true, email: true } },
                team: { select: { name: true, desciption: true } }
            }
        })

        if (data.length === 0) {
            throw new AppError('This user id not associated with any team')
        }

        res.json(data)
    }
}

export { TeamsMemberController }