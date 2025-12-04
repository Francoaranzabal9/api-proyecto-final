import { Router } from 'express';
import { sendEmailController } from '../controllers/emailController';

const router = Router();

router.post('/send', sendEmailController);

export default router;
