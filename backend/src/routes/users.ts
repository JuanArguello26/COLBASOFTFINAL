import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { LogRepository } from '../repositories/LogRepository';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', adminOnly, UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', adminOnly, UserController.create);
router.put('/:id', adminOnly, UserController.update);
router.delete('/:id', adminOnly, UserController.delete);

export default router;
