import express from 'express';
import { registerUserController, loginUserServiceController } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserServiceController);

export default router;