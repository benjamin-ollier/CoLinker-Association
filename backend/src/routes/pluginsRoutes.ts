import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/download/:packagename/:filename', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { packagename, filename } = req.params;
    const file = `src/upload/${packagename}/${filename}`;
    return res.download(file);
  } catch (error) {
    next(error);
  }
});

export default router;
