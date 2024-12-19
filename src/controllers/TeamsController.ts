import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import z from 'zod'

class TeamsController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().min(6),
            description: z.string().optional()
        })

        const { name, description } = bodySchema.parse(req.body)

        await prisma.teams.create({
            data: {
                name,
                desciption: description
            }
        })

        res.status(201).json()

    }

    async update(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().min(6).optional(),
            description: z.string().optional()
        })

        const paramSchema = z.object({
            team_id: z.string()
        })

        const { name, description } = bodySchema.parse(req.body)
        const { team_id } = paramSchema.parse(req.params)

        const team = await prisma.teams.findFirst({
            where: {
                id: team_id
            }
        })

        if(!team){
            throw new AppError("Team not found.")
        }

        await prisma.teams.update({
            data: {
                name,
                desciption: description
            },
            where: {
                id: team_id
            }
        })

        res.json()

    }

    async show(req: Request, res: Response) {

        const data = await prisma.teams.findMany()

        res.json(data)

    }

    async remove(req: Request, res: Response){
        const paramSchema = z.object({
            team_id: z.string()
        })

        const { team_id } = paramSchema.parse(req.params)

        const team = await prisma.teams.findFirst({
            where:{
                id: team_id
            }
        })

        if(!team){
            throw new AppError('Team not found.')
        }

        await prisma.teams.delete({
            where: {
                id: team_id
            }
        })

        res.json()
    }
}

export { TeamsController }