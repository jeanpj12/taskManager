import { prisma } from '@/database/prisma'
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

    async index(req: Request, res: Response) {

        const data = await prisma.teams.findMany()

        res.json(data)

    }
}

export { TeamsController }