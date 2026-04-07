import { Router } from 'express';
import { getProfile } from '../services/profile.service';

const router = Router();

router.get('/', async (req, res) => {
  const userId = req.user!.id;
  const user = await getProfile(userId);

  res.json({
    success: true,
    user
  });
});

export default router;
