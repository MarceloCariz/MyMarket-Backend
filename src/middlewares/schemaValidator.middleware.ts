import { NextFunction, Request, Response } from "express";
import {AnyZodObject, ZodError} from 'zod'
import { HTTP_RESPONSE } from "../enums/httpErrors.enum";

export const schemaValidation = 
(schema: AnyZodObject) =>
(req: Request, res:Response, next:NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        next();
    } catch (error) {
        if(error instanceof ZodError){
            return res
                .status(HTTP_RESPONSE.BadRequest)
                .json(error.issues.map((issue) => ({field: issue.path, message: issue.message})));
        }
        return res.status(HTTP_RESPONSE.InternalServerError).json({message: "Internal server Error"});
    }
}