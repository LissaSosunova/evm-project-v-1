import { Router } from 'express';
import { AccountController } from '../../controllers/user/account.controller';
import { ChangeEmailController } from '../../controllers/user/change_email.controller';
import { ChangePasswordAuthController } from '../../controllers/user/change_password_auth.controller';
import { ConfirmChangeEmailController } from '../../controllers/user/confirm_change_email.controller';
import { DeleteAvatarController } from '../../controllers/user/delete_avatar.controller';
import { DeleteContactController } from '../../controllers/user/delete_contact.controller';
import { FindUserController } from '../../controllers/user/find_user.controller';
import { GetUserController } from '../../controllers/user/get_user.controller';
import { ProfileController } from '../../controllers/user/profile.controller';
import { UploadAvatarController } from '../../controllers/user/upload_avatar.controller';
import { verifyToken } from '../../middlewares/check_Jwt';
import { FileUpload } from '../../middlewares/file_upload';

const userRoutes = Router();

userRoutes.get('/account', [verifyToken], new AccountController().account.bind(new AccountController()));
userRoutes.put('/change_email', [verifyToken], new ChangeEmailController().changeEmail.bind(new ChangeEmailController()));
userRoutes.post('/change_password_auth', [verifyToken], new ChangePasswordAuthController().changePassword.bind(new ChangePasswordAuthController()));
userRoutes.get('/confirm_change_email/:token/:email/:tokenTime', new ConfirmChangeEmailController().confirm);
userRoutes.delete('/delete_avatar/:userId', [verifyToken], new DeleteAvatarController().delete.bind(new DeleteAvatarController()));
userRoutes.delete('/delete_contact/:contactUsername', [verifyToken], new DeleteContactController().delete.bind(new DeleteContactController()));
userRoutes.get('/find_user', [verifyToken], new FindUserController().find.bind(new FindUserController()));
userRoutes.get('/get_user', [verifyToken], new GetUserController().user.bind(new GetUserController()));
userRoutes.put('/profile', [verifyToken], new ProfileController().profile.bind(new ProfileController()));
userRoutes.post('/upload_avatar', [verifyToken], new FileUpload().upload.single('image'), new UploadAvatarController().uploadAvatar.bind(new UploadAvatarController()));

export default userRoutes;