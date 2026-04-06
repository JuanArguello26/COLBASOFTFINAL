import { Router } from 'express';
import { AlertController } from '../controllers/AlertController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', AlertController.getAll);
router.get('/unread', AlertController.getUnread);
router.get('/count', AlertController.getCount);
router.put('/:id/read', AlertController.markAsRead);
router.put('/read-all', AlertController.markAllAsRead);
router.delete('/:id', AlertController.delete);

export default router;
