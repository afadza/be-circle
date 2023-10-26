import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

export default new (class AuthControllers {
  register(req: Request, res: Response) {
    AuthService.register(req, res);
  }

  login(req: Request, res: Response) {
    AuthService.login(req, res);
  }
  
  checkToken(req: Request, res: Response) {
    AuthService.checkToken(req, res);
  }
})();
