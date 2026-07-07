// Seeds the database with Anurag Sinha's resume data.
// Run with: npm run seed  (after schema.sql has been applied)
import 'dotenv/config';
import { pool } from '../config/db.js';

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log('Clearing existing data...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of [
      'contact_messages', 'skills', 'skill_categories', 'project_metrics',
      'project_bullets', 'projects', 'experience_bullets', 'experience',
      'education', 'achievements', 'profile'
    ]) {
      await conn.query(`TRUNCATE TABLE ${t}`);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Inserting profile...');
    await conn.query(
      `INSERT INTO profile
        (full_name, tagline, bio, email, phone, location, resume_url, github_url, linkedin_url, leetcode_url, gfg_url, cgpa)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        'Anurag Sinha',
        'B.Tech CSE Student · AI/ML & Full-Stack Engineer',
        'Computer Science undergraduate at NIT Patna building agentic AI systems and full-stack applications. Currently interning at Accenture on LLM-based enterprise automation, with project work spanning deepfake detection, real-time social platforms, and 500+ solved DSA problems.',
        'anuragsinha067@gmail.com',
        '+91-7765861144',
        'Patna, India',
        'https://drive.google.com/file/d/1K0Xj6-k8sWEkzmiajEVNJ7YWn8ggg4xU/view?usp=drivesdk',
        'https://github.com/ANUrag45r',
        'https://www.linkedin.com/in/anurag-sinha-598310299',
        'https://leetcode.com/u/anurag_sinha_hu/',
        'https://www.geeksforgeeks.org/profile/anuragsinha067',
        '7.8/10'
      ]
    );

    console.log('Inserting education...');
    await conn.query(
      `INSERT INTO education (institution, degree, score, start_date, end_date, display_order) VALUES
        (?,?,?,?,?,1), (?,?,?,?,?,2), (?,?,?,?,?,3)`,
      [
        'National Institute of Technology, Patna', 'B.Tech in Computer Science and Engineering', 'CGPA: 7.8/10 (till 6th sem)', '2023', '2027',
        'Holy Mission Senior Secondary School', 'Class 12th', '91.7%', '', '2022',
        'D.A.V Public School, BSEB', 'Class 10th', '89.4%', '', '2020'
      ]
    );

    console.log('Inserting experience...');
    const [exp1] = await conn.query(
      `INSERT INTO experience (role, organization, start_date, end_date, display_order) VALUES (?,?,?,?,1)`,
      ['AEH Intern', 'Accenture', 'May 2026', 'Jul 2026']
    );
    const [exp2] = await conn.query(
      `INSERT INTO experience (role, organization, start_date, end_date, display_order) VALUES (?,?,?,?,2)`,
      ['Freelance Web Developer', 'Motilal Nehru College, Delhi University', 'Feb 2025', 'Mar 2025']
    );

    await conn.query(
      `INSERT INTO experience_bullets (experience_id, bullet_text, display_order) VALUES
        (?,?,1), (?,?,2), (?,?,3), (?,?,4)`,
      [
        exp1.insertId, 'Developed and deployed agentic AI workflows using LLM-based orchestration, automating enterprise business processes and reducing manual intervention by 40%.',
        exp1.insertId, 'Worked with generative AI tools and cloud platforms to build intelligent automation pipelines integrated with existing enterprise systems.',
        exp1.insertId, 'Contributed to AI-powered decision-making modules leveraging prompt engineering and retrieval-augmented generation (RAG) for workflow optimization.',
        exp1.insertId, 'Followed Agile/Scrum methodologies, participating in sprint planning, code reviews, and cross-functional collaboration with senior engineers.'
      ]
    );
    await conn.query(
      `INSERT INTO experience_bullets (experience_id, bullet_text, display_order) VALUES
        (?,?,1), (?,?,2), (?,?,3)`,
      [
        exp2.insertId, 'Developed a full-stack departmental website using React.js, Node.js (Express), and MongoDB, serving 500+ users across the campus community.',
        exp2.insertId, 'Built a responsive content management system for notices, events, faculty profiles, and academic resources with real-time updates.',
        exp2.insertId, 'Improved information dissemination efficiency by 70% and collaborated in a 3-member team to deliver the project on schedule.'
      ]
    );

    console.log('Inserting projects...');
    const [p1] = await conn.query(
      `INSERT INTO projects (title, summary, tech_stack, github_url, start_date, end_date, featured, display_order)
       VALUES (?,?,?,?,?,?,?,1)`,
      [
        'Dual-Modal Deep Fake News Detection System',
        'A dual-modal detection platform analyzing multilingual text and AI-generated deepfake imagery simultaneously, integrated into a real-time verification web interface.',
        'PyTorch, TensorFlow, Keras, Hugging Face Transformers, XLM-RoBERTa, EfficientNetB0',
        'https://github.com/ANUrag45r/MINOR_PROJECT_DEEP_FAKE_NEWS_DETECTION',
        'Jan 2026', 'Apr 2026', true
      ]
    );
    await conn.query(
      `INSERT INTO project_bullets (project_id, bullet_text, display_order) VALUES
        (?,?,1), (?,?,2), (?,?,3)`,
      [
        p1.insertId, 'Engineered a text classification pipeline using hierarchical XLM-RoBERTa with sliding-window chunking (up to 2,560 tokens) on a bilingual English/Hindi corpus.',
        p1.insertId, 'Designed a computer vision module using EfficientNetB0 with transfer learning on 200,000+ images for deepfake image detection.',
        p1.insertId, 'Integrated both models into a web-based interface for real-time fake news and deepfake image verification with confidence scoring.'
      ]
    );
    await conn.query(
      `INSERT INTO project_metrics (project_id, metric_label, metric_value, display_order) VALUES
        (?,?,?,1), (?,?,?,2), (?,?,?,3)`,
      [
        p1.insertId, 'Text F1-score', '90.71%',
        p1.insertId, 'Vision accuracy', '87.03%',
        p1.insertId, 'AUC-ROC', '0.95'
      ]
    );

    const [p2] = await conn.query(
      `INSERT INTO projects (title, summary, tech_stack, github_url, start_date, end_date, featured, display_order)
       VALUES (?,?,?,?,?,?,?,2)`,
      [
        'Social Nexus Hub',
        'A real-time chat and social networking application with group messaging, role-based access, and live notifications.',
        'Socket.io, Node.js, Express.js, MongoDB, JWT',
        'https://github.com/ANUrag45r/social-nexus-hub',
        'Feb 2025', 'Feb 2025', true
      ]
    );
    await conn.query(
      `INSERT INTO project_bullets (project_id, bullet_text, display_order) VALUES
        (?,?,1), (?,?,2), (?,?,3)`,
      [
        p2.insertId, 'Built a real-time chat application achieving message delivery latency below 100ms.',
        p2.insertId, 'Developed group chat functionality with role-based access control for admins and members.',
        p2.insertId, 'Implemented friend requests and user discovery with JWT authentication and secure session management.'
      ]
    );
    await conn.query(
      `INSERT INTO project_metrics (project_id, metric_label, metric_value, display_order) VALUES (?,?,?,1)`,
      [p2.insertId, 'Message latency', '<100ms']
    );

    console.log('Inserting skills...');
    const categories = [
      ['Languages', ['Python', 'JavaScript', 'C', 'C++', 'HTML', 'CSS']],
      ['Frameworks & Libraries', ['React.js', 'Node.js', 'Express.js', 'PyTorch', 'TensorFlow', 'Keras', 'Hugging Face Transformers', 'Socket.io']],
      ['Developer Tools', ['Git', 'GitHub', 'Docker', 'VS Code', 'IntelliJ']],
      ['Databases & Cloud', ['MongoDB', 'Firebase', 'MySQL']]
    ];
    let catOrder = 1;
    for (const [name, skills] of categories) {
      const [cat] = await conn.query(
        `INSERT INTO skill_categories (category_name, display_order) VALUES (?, ?)`,
        [name, catOrder++]
      );
      let skillOrder = 1;
      for (const s of skills) {
        await conn.query(
          `INSERT INTO skills (category_id, skill_name, display_order) VALUES (?,?,?)`,
          [cat.insertId, s, skillOrder++]
        );
      }
    }

    console.log('Inserting achievements...');
    await conn.query(
      `INSERT INTO achievements (achievement_text, display_order) VALUES (?,1), (?,2)`,
      [
        'Solved 500+ DSA questions across LeetCode and GeeksforGeeks.',
        'Qualified Pre-Regional Mathematics Olympiad (2019) and appeared in the Regional Mathematics Olympiad.'
      ]
    );

    console.log('Seed complete.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
