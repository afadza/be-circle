import { Request, Response } from "express";
import RepliesService from "../services/RepliesService";

export default new (class RepliesControllers {
    find(req: Request, res: Response) {
        RepliesService.find(req, res)
    }

    create(req: Request, res: Response) {
        RepliesService.create(req, res)
    }

    delete(req: Request, res: Response) {
        RepliesService.delete(req, res)
    }
})