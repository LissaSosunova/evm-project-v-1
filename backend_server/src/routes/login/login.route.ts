import { Router } from 'express';
import { LoginController } from '../../controllers/login/login.controller';
import { BruteForceProtectionService } from '../../services/brute-force-protection-service';

const loginRoute = Router();

loginRoute.post('/login', new LoginController(new BruteForceProtectionService()).login.bind(new LoginController(new BruteForceProtectionService())));

export default loginRoute;
