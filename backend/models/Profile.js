import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  score: String,
  start_date: String,
  end_date: String,
  display_order: { type: Number, default: 0 }
});

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  organization: { type: String, required: true },
  start_date: String,
  end_date: String,
  bullets: [String],
  display_order: { type: Number, default: 0 }
});

const SkillCategorySchema = new mongoose.Schema({
  category_name: { type: String, required: true },
  skills: [{
    name: { type: String, required: true }
  }],
  display_order: { type: Number, default: 0 }
});

const ProfileSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  tagline: String,
  bio: String,
  email: String,
  phone: String,
  location: String,
  resume_url: String,
  github_url: String,
  linkedin_url: String,
  leetcode_url: String,
  gfg_url: String,
  cgpa: String,
  education: [EducationSchema],
  experience: [ExperienceSchema],
  skills: [SkillCategorySchema],
  achievements: [String]
}, { timestamps: true });

export default mongoose.model('Profile', ProfileSchema);
