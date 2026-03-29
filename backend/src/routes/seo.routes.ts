import { Router, Request, Response } from 'express';
import { SeoService } from '../services/seo.service';
import { authenticate, isJournalist } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const seoService = new SeoService();

router.post(
  '/generate',
  authenticate,
  isJournalist,
  asyncHandler(async (req: Request, res: Response) => {
    const { title, content, excerpt, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const seoData = await seoService.generateSeoMetadata({
      title,
      content,
      excerpt,
      category,
      tags,
    });

    res.json({
      success: true,
      data: {
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        openGraph: seoData.openGraph,
        twitterCard: seoData.twitterCard,
        jsonLd: seoData.jsonLd,
        insights: {
          score: seoData.seoScore,
          readability: seoData.readabilityScore,
          keywordDensity: seoData.keywordDensity,
          suggestions: seoData.suggestions,
        },
      },
    });
  })
);

export default router;