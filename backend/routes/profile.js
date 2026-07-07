import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// GET /api/profile - everything needed to render the site in one call
router.get('/', async (req, res) => {
  try {
    const [[profile]] = await pool.query('SELECT * FROM profile LIMIT 1');
    const [education] = await pool.query('SELECT * FROM education ORDER BY display_order');
    const [experience] = await pool.query('SELECT * FROM experience ORDER BY display_order');
    const [experienceBullets] = await pool.query('SELECT * FROM experience_bullets ORDER BY display_order');
    const [achievements] = await pool.query('SELECT * FROM achievements ORDER BY display_order');
    const [skillCategories] = await pool.query('SELECT * FROM skill_categories ORDER BY display_order');
    const [skills] = await pool.query('SELECT * FROM skills ORDER BY display_order');

    const experienceWithBullets = experience.map(e => ({
      ...e,
      bullets: experienceBullets
        .filter(b => b.experience_id === e.id)
        .map(b => b.bullet_text)
    }));

    const skillsWithCategories = skillCategories.map(c => ({
      ...c,
      skills: skills.filter(s => s.category_id === c.id).map(s => ({ id: s.id, name: s.skill_name }))
    }));

    res.json({
      profile,
      education,
      experience: experienceWithBullets,
      achievements,
      skills: skillsWithCategories
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile data' });
  }
});

export default router;
