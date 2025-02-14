import { error } from "console"
import {Request, Response , NextFunction} from "express"

const globalErrorHanflingMiddleware = (
    error : Error,
    req : Request,
    res : Response,
    next : NextFunction
) =>{
    console.log(error);
    if (error.message === "NotFoundError") {
        res.status(404).json({message: error.message});
        return ;
    }

    if (error.message === "ValidationError") {
        res.status(404).json({message: error.message});
        return ;
    }
    res.status(500).json({message: "Internal Server error"});
};

export default globalErrorHanflingMiddleware;