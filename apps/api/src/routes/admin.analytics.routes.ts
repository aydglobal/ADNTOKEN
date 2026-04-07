import { Router } from 'express';
import { getAnalyticsSummary } from '../services/analyticsAdmin.service';

const router = Router();

router.get('/summary', async (_req, res) => {
  res.json({
    success: true,
    data: await getAnalyticsSummary()
  });
});

export default router;
