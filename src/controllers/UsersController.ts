import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { hash } from 'bcrypt'
import z from 'zod'

class UsersController {

    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(3),
            email: z.string().email(),
            password: z.string().min(6)
                .refine(
                    (password) => /[A-Z]/
                        .test(password),
                    'The password should contain at least 1 uppercase character'
                )
                .refine(
                    (password) => /[a-z]/.test(password),
                    'Password must contain at least one lowercase letter'
                )
                .refine(
                    (passsword) => /[0-9]/.test(passsword),
                    'Password must contain at least one number'
                )
                .refine(
                    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
                    'Password must contain at least one special character'
                )
        })

        const { name, email, password } = bodySchema.parse(req.body)

        const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

        if (userWithSameEmail) {
            throw new AppError('Email alredy registered.')
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const { password: _, ...userWhitoutPassword } = user

        res.status(201).json(userWhitoutPassword)

    }
}

export { UsersController }