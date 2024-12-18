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

        const existingMembership = await prisma.teamMembers.findFirst({
            where: {userId: user_id, teamId: team_id}
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
}

export { TeamsMemberController }