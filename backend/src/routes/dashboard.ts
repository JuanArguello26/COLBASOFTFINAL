import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/stats', DashboardController.getStats);
router.get('/chart', DashboardController.getChartData);
router.get('/kpis', DashboardController.getKPIs);

export default router;
