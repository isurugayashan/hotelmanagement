import { NextFunction, Request, Response } from "express";
import FrobiddenError from "../../domian/errors/frobidden-error";

export const isAdmin = (req: Request, res: Response, next: NextFunction)  =>{
    console.log(req?.auth);
    if (!(req?.auth?.sessionClaims?.role !== "admin")) {
        throw new FrobiddenError("FrobiddenError");
        
    }
    next();
}