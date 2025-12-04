import { Router } from 'express';
import { sendEmailController } from '../controllers/emailController';

import { validateSchema } from '../middlewares/validateSchema';
import { emailSendSchema } from '../validators/emailValidator';

const router = Router();

router.post('/send', validateSchema(emailSendSchema), sendEmailController);

export default router;
