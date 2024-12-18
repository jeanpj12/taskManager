import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import z from 'zod'

class TaskStatusController {
    async update(req: Request, res: Response) {
        const bodySchema = z.object({
            status: z.enum(['pending', 'in_progress', 'completed'])
        })

        const paramSchema = z.object({
            task_id: z.string()
        })

        const { status } = bodySchema.parse(req.body)
        const { task_id } = paramSchema.parse(req.params)

        const task = await prisma.tasks.findFirst({
            where: {
                id: task_id
            }
        })

        if(!task){
            throw new AppError('Task not found')
        }

        if(task.assignedTo !== req.user?.id && req.user?.role !== 'admin'){
            throw new AppError('Unauthorized', 401)
        }

        const taskChanged = await prisma.tasks.update({
            data: {
                status: status
            },
            where: {
                id: task_id
            }
        })

        await prisma.taskHistory.create({
            data:{
                changedBy: req.user.id,
                taskId: task_id,
                oldStatus: task.status,
                newStatus: taskChanged.status
            }
        })

        res.json()
    }
}

export { TaskStatusController }