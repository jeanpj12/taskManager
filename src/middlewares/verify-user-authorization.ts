import { AppError } from "@/utils/AppError";
import { Response, Request, NextFunction } from "express";

function verifyUserAuthorization(role: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401)
        }

        if (!role.includes(req.user.role)) {
            throw new AppError('Unauthorized', 401)
        }

        next()
    }
}

export { verifyUserAuthorization }