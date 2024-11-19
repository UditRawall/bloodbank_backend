import { Router } from 'express';
import { currentUserController, loginController, registerController } from "../controllers/authController.js"
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = Router();

// register : post route
router.post('/register', registerController);

// login : post route 
router.post('/login', loginController);

// get current user : get route
router.get('/current-user', authMiddleware, currentUserController)

export default router;