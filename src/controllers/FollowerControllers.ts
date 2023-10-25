import { Request, Response } from "express";
import FollowerServices from "../services/FollowerServices";

export default new (class FolloerControllers {
    find(req: Request, res: Response) {
        FollowerServices.find(req, res)
    }

    create(req: Request, res: Response) {
        FollowerServices.create(req, res)
    }

    delete(req: Request, res: Response) {
        FollowerServices.delete(req, res)
    }
})