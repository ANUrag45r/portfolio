import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// GET /api/projects - all projects with bullets + metrics
router.get('/', async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT * FROM projects ORDER BY display_order');
    const [bullets] = await pool.query('SELECT * FROM project_bullets ORDER BY display_order');
    const [metrics] = await pool.query('SELECT * FROM project_metrics ORDER BY display_order');

    const result = projects.map(p => ({
      ...p,
      bullets: bullets.filter(b => b.project_id === p.id).map(b => b.bullet_text),
      metrics: metrics
        .filter(m => m.project_id === p.id)
        .map(m => ({ label: m.metric_label, value: m.metric_value }))
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const [[project]] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const [bullets] = await pool.query(
      'SELECT bullet_text FROM project_bullets WHERE project_id = ? ORDER BY display_order',
      [req.params.id]
    );
    const [metrics] = await pool.query(
      'SELECT metric_label, metric_value FROM project_metrics WHERE project_id = ? ORDER BY display_order',
      [req.params.id]
    );

    res.json({
      ...project,
      bullets: bullets.map(b => b.bullet_text),
      metrics: metrics.map(m => ({ label: m.metric_label, value: m.metric_value }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load project' });
  }
});

// POST /api/projects - Create a new project with bullets and metrics
router.post('/', async (req, res) => {
  const {
    title, summary, tech_stack, github_url, live_url,
    start_date, end_date, featured, bullets, metrics
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert project
    const [projResult] = await conn.query(
      `INSERT INTO projects 
       (title, summary, tech_stack, github_url, live_url, start_date, end_date, featured, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, summary || '', tech_stack || '', github_url || '', live_url || '', start_date || '', end_date || '', featured ? 1 : 0, 99]
    );
    const projectId = projResult.insertId;

    // Insert bullets
    if (Array.isArray(bullets) && bullets.length > 0) {
      for (let i = 0; i < bullets.length; i++) {
        if (bullets[i] && bullets[i].trim()) {
          await conn.query(
            'INSERT INTO project_bullets (project_id, bullet_text, display_order) VALUES (?, ?, ?)',
            [projectId, bullets[i].trim(), i]
          );
        }
      }
    }

    // Insert metrics
    if (Array.isArray(metrics) && metrics.length > 0) {
      for (let i = 0; i < metrics.length; i++) {
        const { label, value } = metrics[i];
        if (label && value && label.trim() && value.trim()) {
          await conn.query(
            'INSERT INTO project_metrics (project_id, metric_label, metric_value, display_order) VALUES (?, ?, ?, ?)',
            [projectId, label.trim(), value.trim(), i]
          );
        }
      }
    }

    await conn.commit();
    res.status(201).json({ message: 'Project created successfully', projectId });
  } catch (err) {
    await conn.rollback();
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  } finally {
    conn.release();
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
