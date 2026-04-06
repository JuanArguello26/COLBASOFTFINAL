import { Router } from 'express';
import { MovementController } from '../controllers/MovementController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', MovementController.getAll);
router.get('/stats', MovementController.getStats);
router.get('/rotation', MovementController.getRotation);
router.get('/:id', MovementController.getById);
router.post('/entrada', MovementController.entrada);
router.post('/salida', MovementController.salida);
router.post('/ajuste', MovementController.ajuste);

export default router;
