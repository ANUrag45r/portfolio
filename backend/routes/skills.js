import { Router } from 'express';
import Profile from '../models/Profile.js';

const router = Router();

// POST /api/skills - Create a new skill (and category if needed)
router.post('/', async (req, res) => {
  const { category_name, skill_name } = req.body;
  
  if (!category_name || !skill_name) {
    return res.status(400).json({ error: 'Category name and skill name are required' });
  }

  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create empty profile if none exists yet
      profile = new Profile({
        full_name: 'Anurag Sinha',
        skills: []
      });
    }

    // Find category case-insensitive
    let category = profile.skills.find(
      c => c.category_name.toLowerCase() === category_name.toLowerCase()
    );

    if (!category) {
      // Create category
      profile.skills.push({
        category_name: category_name.trim(),
        display_order: 99,
        skills: []
      });
      category = profile.skills[profile.skills.length - 1];
    }

    // Insert skill
    category.skills.push({ name: skill_name.trim() });
    await profile.save();

    // Get the newly created skill ID
    const addedSkill = category.skills[category.skills.length - 1];

    res.status(201).json({ 
      message: 'Skill added successfully', 
      skillId: addedSkill._id,
      categoryId: category._id
    });
  } catch (err) {
    console.error('Error adding skill to MongoDB:', err);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// DELETE /api/skills/:id - Delete a skill
router.delete('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    let skillFound = false;

    // Iterate categories and search/pull the skill
    for (let c of profile.skills) {
      const idx = c.skills.findIndex(s => s._id.toString() === req.params.id);
      if (idx !== -1) {
        c.skills.splice(idx, 1);
        skillFound = true;
        break;
      }
    }

    if (!skillFound) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Cleanup empty categories
    profile.skills = profile.skills.filter(c => c.skills.length > 0);

    await profile.save();
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Error deleting skill from MongoDB:', err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;
