import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandling(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message })
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            message: "Validation error",
            issues: err.format()
        })
    }

    res.status(500).json({ message: err.message })
}