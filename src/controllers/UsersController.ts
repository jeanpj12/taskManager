import { Request, Response } from 'express'

class UsersController {
    async index(req: Request, res: Response) {
        res.json('ok')
    }
}

export { UsersController }