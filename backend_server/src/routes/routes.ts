import { Router } from 'express';
import loginRoute from './login/login.route';
import chatRoutes from './chats/chat.routes';
import userRoutes from './user/user.routes';
import eventRoute from './events/event.route';
import registrationRoute from './registration/registration.route';

const routes = Router();

routes.use('/', loginRoute);
routes.use('/user', userRoutes);
routes.use('/chat', chatRoutes);
routes.use('/event', eventRoute);
routes.use('/registration', registrationRoute);

export default routes;