import { Router } from 'express';
import { LoginController } from '../../controllers/login/login.controller';

const loginRoute = Router();

loginRoute.post('/login', new LoginController().login);

export default loginRoute;