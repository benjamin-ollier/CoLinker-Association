import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/download/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const file = `src/upload/${slug}`;
    return res.download(file);
  } catch (error) {
    next(error);
  }
});

export default router;
