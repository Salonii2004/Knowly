import express from 'express';
import { uploadData } from '../controllers/dataController.js';

const router = express.Router();

router.post('/upload', uploadData);

export default router;
