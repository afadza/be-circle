import * as express from 'express';
import ThreadControllers from '../controllers/ThreadControllers';
import UserControllers from '../controllers/UserControllers';
import RepliesControllers from '../controllers/RepliesControllers';
import LikesControllers from '../controllers/LikesControllers';
import FollowerControllers from '../controllers/FollowerControllers';
import FollowingControllers from '../controllers/FollowingControllers';
import AuthControllers from '../controllers/AuthControllers';
import AuthenticationMiddlewares from '../middlewares/Auth';
// import { upload } from '../middlewares/UploadFile';
import {upload} from '../middlewares/UploadFile';

const router = express.Router();

router.get('/threads', ThreadControllers.find);
router.get('/thread/:id', ThreadControllers.findOne);
router.post('/thread', AuthenticationMiddlewares.Authentication, upload('image'), ThreadControllers.create);
router.patch('/thread/:id', ThreadControllers.update);
router.delete('/thread/:id', ThreadControllers.delete);

router.get('/users', UserControllers.find);
router.get('/user/:id', UserControllers.findOne);
router.post('/user', UserControllers.create);
router.patch('/user/:id', UserControllers.update);
router.delete('/user/:id', UserControllers.delete);

router.post("/follow/", AuthenticationMiddlewares.Authentication, UserControllers.follow);

router.get('/replies', RepliesControllers.find);
router.post('/reply', AuthenticationMiddlewares.Authentication, upload('image'), RepliesControllers.create);
router.delete('/reply/:id', RepliesControllers.delete);

router.get('/likes', LikesControllers.find);
router.post('/like', AuthenticationMiddlewares.Authentication, LikesControllers.create);
router.delete('/like/:id', LikesControllers.delete);

router.get('/followers', FollowerControllers.find);
router.post('/follower', FollowerControllers.create);
router.delete('/follower/:id', FollowerControllers.delete);

router.get('/following', FollowingControllers.find);
router.post('/following', AuthenticationMiddlewares.Authentication, FollowingControllers.create);
router.delete('/following/:id', FollowingControllers.delete);

router.post('/register', AuthControllers.register);
router.post('/login', AuthControllers.login);
router.get('/auth/check', AuthenticationMiddlewares.Authentication, AuthControllers.checkToken);
export default router;
