import express from 'express';
import { getIntegrations, addIntegration, testIntegrationController } from '../controllers/integrationController.js';

const router = express.Router();

router.get('/', getIntegrations);
router.post('/', addIntegration);
router.post('/:id/test', testIntegrationController);

export default router;
