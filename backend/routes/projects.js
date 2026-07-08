import { Router } from 'express';
import Project from '../models/Project.js';

const router = Router();

// GET /api/projects - all projects with bullets + metrics
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ display_order: 1 });
    const result = projects.map(p => ({
      id: p._id,
      title: p.title,
      summary: p.summary,
      tech_stack: p.tech_stack,
      github_url: p.github_url,
      live_url: p.live_url,
      start_date: p.start_date,
      end_date: p.end_date,
      featured: p.featured,
      display_order: p.display_order,
      bullets: p.bullets || [],
      metrics: (p.metrics || []).map(m => ({ label: m.label, value: m.value }))
    }));
    res.json(result);
  } catch (err) {
    console.error('Error loading projects from MongoDB:', err);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.json({
      id: project._id,
      title: project.title,
      summary: project.summary,
      tech_stack: project.tech_stack,
      github_url: project.github_url,
      live_url: project.live_url,
      start_date: project.start_date,
      end_date: project.end_date,
      featured: project.featured,
      display_order: project.display_order,
      bullets: project.bullets || [],
      metrics: (project.metrics || []).map(m => ({ label: m.label, value: m.value }))
    });
  } catch (err) {
    console.error('Error loading single project from MongoDB:', err);
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

  try {
    const cleanedBullets = Array.isArray(bullets) ? bullets.filter(b => b && b.trim()) : [];
    const cleanedMetrics = Array.isArray(metrics) 
      ? metrics.filter(m => m.label && m.value && m.label.trim() && m.value.trim()).map(m => ({ label: m.label.trim(), value: m.value.trim() })) 
      : [];

    const newProject = new Project({
      title: title.trim(),
      summary: summary || '',
      tech_stack: tech_stack || '',
      github_url: github_url || '',
      live_url: live_url || '',
      start_date: start_date || '',
      end_date: end_date || '',
      featured: !!featured,
      display_order: 99,
      bullets: cleanedBullets,
      metrics: cleanedMetrics
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', projectId: newProject._id });
  } catch (err) {
    console.error('Error creating project in MongoDB:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project from MongoDB:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
