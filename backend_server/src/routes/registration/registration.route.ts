import { Router } from 'express';
import { ChangePasswordController } from '../../controllers/registration/change_password.controller';
import { ConfirmEmailController } from '../../controllers/registration/confirm_email.controller';
import { ForgotPasswordController } from '../../controllers/registration/forgot_password.controller';
import { NewUserController } from '../../controllers/registration/new_user.controller';
import { ResetPasswordController } from '../../controllers/registration/reset_password.controller';

const registrationRoute = Router();
registrationRoute.post('/change_password', new ChangePasswordController().changePassword);
registrationRoute.get('/confirm_email/:token', new ConfirmEmailController().confirm);
registrationRoute.post('/forgot_password', new ForgotPasswordController().reset);
registrationRoute.post('/user', new NewUserController().user);
registrationRoute.get('/reset_password/:token/:tokenTime', new ResetPasswordController().reset);

export default registrationRoute;