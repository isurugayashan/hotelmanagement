import { NextFunction, Request, Response } from "express";
import UnauthorizedError from "../../domian/errors/unauthorized-error";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction)  =>{
    if (!req?.auth.userId) {
        throw new UnauthorizedError("Unauthorized");
        
    }
    next();
}