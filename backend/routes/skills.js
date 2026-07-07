import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// POST /api/skills - Create a new skill (and category if needed)
router.post('/', async (req, res) => {
  const { category_name, skill_name } = req.body;
  
  if (!category_name || !skill_name) {
    return res.status(400).json({ error: 'Category name and skill name are required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check if category exists
    const [categories] = await conn.query(
      'SELECT id FROM skill_categories WHERE LOWER(category_name) = ?',
      [category_name.toLowerCase()]
    );

    let categoryId;
    if (categories.length > 0) {
      categoryId = categories[0].id;
    } else {
      // Create new category
      const [newCat] = await conn.query(
        'INSERT INTO skill_categories (category_name, display_order) VALUES (?, ?)',
        [category_name.trim(), 99] // Use high default display order
      );
      categoryId = newCat.insertId;
    }

    // Insert skill
    const [newSkill] = await conn.query(
      'INSERT INTO skills (category_id, skill_name, display_order) VALUES (?, ?, ?)',
      [categoryId, skill_name.trim(), 0]
    );

    await conn.commit();
    res.status(201).json({ 
      message: 'Skill added successfully', 
      skillId: newSkill.insertId,
      categoryId
    });
  } catch (err) {
    await conn.rollback();
    console.error('Error adding skill:', err);
    res.status(500).json({ error: 'Failed to add skill' });
  } finally {
    conn.release();
  }
});

// DELETE /api/skills/:id - Delete a skill
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Cleanup empty categories
    await pool.query(
      `DELETE FROM skill_categories 
       WHERE id NOT IN (SELECT DISTINCT category_id FROM skills)`
    );

    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;
