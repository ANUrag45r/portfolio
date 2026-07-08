import { Router } from 'express';
import Profile from '../models/Profile.js';

const router = Router();

// GET /api/profile - everything needed to render the site in one call
router.get('/', async (req, res) => {
  try {
    const profileDoc = await Profile.findOne();
    if (!profileDoc) {
      return res.json({
        profile: null,
        education: [],
        experience: [],
        achievements: [],
        skills: []
      });
    }

    res.json({
      profile: {
        full_name: profileDoc.full_name,
        tagline: profileDoc.tagline,
        bio: profileDoc.bio,
        email: profileDoc.email,
        phone: profileDoc.phone,
        location: profileDoc.location,
        resume_url: profileDoc.resume_url,
        github_url: profileDoc.github_url,
        linkedin_url: profileDoc.linkedin_url,
        leetcode_url: profileDoc.leetcode_url,
        gfg_url: profileDoc.gfg_url,
        cgpa: profileDoc.cgpa
      },
      education: (profileDoc.education || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map(e => ({
        id: e.display_order || e._id,
        institution: e.institution,
        degree: e.degree,
        score: e.score,
        start_date: e.start_date,
        end_date: e.end_date,
        display_order: e.display_order
      })),
      experience: (profileDoc.experience || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map(e => ({
        id: e.display_order || e._id,
        role: e.role,
        organization: e.organization,
        location: e.location,
        logo_url: e.logo_url,
        start_date: e.start_date,
        end_date: e.end_date,
        bullets: e.bullets,
        metrics: e.metrics,
        display_order: e.display_order
      })),
      achievements: profileDoc.achievements || [],
      skills: (profileDoc.skills || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map(c => ({
        id: c._id,
        category_name: c.category_name,
        display_order: c.display_order,
        skills: (c.skills || []).map(s => ({ id: s._id, name: s.name }))
      }))
    });
  } catch (err) {
    console.error('Error fetching profile from MongoDB:', err);
    res.status(500).json({ error: 'Failed to load profile data' });
  }
});

export default router;
