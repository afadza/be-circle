import { Request, Response } from 'express';
import FollowingServices from '../services/FollowingServices';

export default new (class FollowingControllers {
  find(req: Request, res: Response) {
    FollowingServices.find(req, res);
  }

  create(req: Request, res: Response) {
    FollowingServices.create(req, res);
  }

  delete(req: Request, res: Response) {
    FollowingServices.delete(req, res);
  }
})();
