import { Router } from 'express';
import { ChangeEventStatusController } from '../../controllers/events/change_event_status.controller';
import { GetEventsController } from '../../controllers/events/get_events.controller';
import { verifyToken } from '../../middlewares/check_Jwt';

const eventRoute = Router();

eventRoute.put('/change_status/:eventId', [verifyToken], new ChangeEventStatusController().changeStatus.bind(new ChangeEventStatusController()));
eventRoute.get('/event/:id/', [verifyToken], new GetEventsController().getEvents.bind(new GetEventsController()));


export default eventRoute;