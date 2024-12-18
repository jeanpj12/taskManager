import { authConfig } from '@/configs/auth'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Request, Response } from 'express'
import z from 'zod'


class SessionsController {

    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { email, password } = bodySchema.parse(req.body)

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            throw new AppError('Invalid email or password')
        }

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {
            throw new AppError('Invalid email or password')
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role ?? 'member' }, secret, {
            subject: user.id,
            expiresIn
        })

        const { password: hashpassword, ...userWithoutPassword } = user

        res.json({token, user: userWithoutPassword})
    }
}

export { SessionsController }