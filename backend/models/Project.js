import mongoose from 'mongoose';

const ProjectMetricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: String,
  tech_stack: String,
  github_url: String,
  live_url: String,
  start_date: String,
  end_date: String,
  featured: { type: Boolean, default: false },
  display_order: { type: Number, default: 0 },
  bullets: [String],
  metrics: [ProjectMetricSchema]
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
