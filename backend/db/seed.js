import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding...');

    console.log('Clearing existing collection data...');
    await Profile.deleteMany({});
    await Project.deleteMany({});

    console.log('Inserting profile...');
    const profile = new Profile({
      full_name: 'Anurag Sinha',
      tagline: 'B.Tech CSE Student · AI/ML & Full-Stack Engineer',
      bio: 'Computer Science undergraduate at NIT Patna building agentic AI systems and full-stack applications. Currently interning at Accenture on LLM-based enterprise automation, with project work spanning deepfake detection, real-time social platforms, and 500+ solved DSA problems.',
      email: 'anuragsinha067@gmail.com',
      phone: '+91-7765861144',
      location: 'Patna, India',
      resume_url: 'https://drive.google.com/file/d/1K0Xj6-k8sWEkzmiajEVNJ7YWn8ggg4xU/view?usp=drivesdk',
      github_url: 'https://github.com/ANUrag45r',
      linkedin_url: 'https://www.linkedin.com/in/anurag-sinha-598310299',
      leetcode_url: 'https://leetcode.com/u/anurag_sinha_hu/',
      gfg_url: 'https://www.geeksforgeeks.org/profile/anuragsinha067',
      cgpa: '7.8/10',
      education: [
        {
          institution: 'National Institute of Technology, Patna',
          degree: 'B.Tech in Computer Science and Engineering',
          score: 'CGPA: 7.8/10 (till 6th sem)',
          start_date: '2023',
          end_date: '2027',
          display_order: 1
        },
        {
          institution: 'Holy Mission Senior Secondary School',
          degree: 'Class 12th',
          score: '91.7%',
          start_date: '',
          end_date: '2022',
          display_order: 2
        },
        {
          institution: 'D.A.V Public School, BSEB',
          degree: 'Class 10th',
          score: '89.4%',
          start_date: '',
          end_date: '2020',
          display_order: 3
        }
      ],
      experience: [
        {
          role: 'AEH Intern',
          organization: 'Accenture',
          start_date: 'May 2026',
          end_date: 'Jul 2026',
          bullets: [
            'Developed and deployed agentic AI workflows using LLM-based orchestration, automating enterprise business processes and reducing manual intervention by 40%.',
            'Worked with generative AI tools and cloud platforms to build intelligent automation pipelines integrated with existing enterprise systems.',
            'Contributed to AI-powered decision-making modules leveraging prompt engineering and retrieval-augmented generation (RAG) for workflow optimization.',
            'Followed Agile/Scrum methodologies, participating in sprint planning, code reviews, and cross-functional collaboration with senior engineers.'
          ],
          display_order: 1
        },
        {
          role: 'Freelance Web Developer',
          organization: 'Motilal Nehru College, Delhi University',
          start_date: 'Feb 2025',
          end_date: 'Mar 2025',
          bullets: [
            'Developed a full-stack departmental website using React.js, Node.js (Express), and MongoDB, serving 500+ users across the campus community.',
            'Built a responsive content management system for notices, events, faculty profiles, and academic resources with real-time updates.',
            'Improved information dissemination efficiency by 70% and collaborated in a 3-member team to deliver the project on schedule.'
          ],
          display_order: 2
        }
      ],
      skills: [
        {
          category_name: 'Languages',
          display_order: 1,
          skills: [
            { name: 'Python' },
            { name: 'JavaScript' },
            { name: 'C' },
            { name: 'C++' },
            { name: 'HTML' },
            { name: 'CSS' }
          ]
        },
        {
          category_name: 'Frameworks & Libraries',
          display_order: 2,
          skills: [
            { name: 'React.js' },
            { name: 'Node.js' },
            { name: 'Express.js' },
            { name: 'PyTorch' },
            { name: 'TensorFlow' },
            { name: 'Socket.io' }
          ]
        },
        {
          category_name: 'Developer Tools',
          display_order: 3,
          skills: [
            { name: 'Git' },
            { name: 'GitHub' },
            { name: 'Docker' },
            { name: 'VS Code' }
          ]
        },
        {
          category_name: 'Databases & Cloud',
          display_order: 4,
          skills: [
            { name: 'MongoDB' },
            { name: 'Firebase' },
            { name: 'MySQL' }
          ]
        }
      ],
      achievements: [
        'Solved 500+ DSA questions across LeetCode and GeeksforGeeks.',
        'Qualified Pre-Regional Mathematics Olympiad (2019) and appeared in the Regional Mathematics Olympiad.'
      ]
    });

    await profile.save();
    console.log('Profile seeded successfully.');

    console.log('Inserting projects...');
    const project1 = new Project({
      title: 'Dual-Modal Deep Fake News Detection System',
      summary: 'A dual-modal detection platform analyzing multilingual text and AI-generated deepfake imagery simultaneously, integrated into a real-time verification web interface.',
      tech_stack: 'PyTorch, TensorFlow, Keras, Hugging Face Transformers, XLM-RoBERTa, EfficientNetB0',
      github_url: 'https://github.com/ANUrag45r/MINOR_PROJECT_DEEP_FAKE_NEWS_DETECTION',
      start_date: 'Jan 2026',
      end_date: 'Apr 2026',
      featured: true,
      display_order: 1,
      bullets: [
        'Engineered a text classification pipeline using hierarchical XLM-RoBERTa with sliding-window chunking (up to 2,560 tokens) on a bilingual English/Hindi corpus.',
        'Designed a computer vision module using EfficientNetB0 with transfer learning on 200,000+ images for deepfake image detection.',
        'Integrated both models into a web-based interface for real-time fake news and deepfake image verification with confidence scoring.'
      ],
      metrics: [
        { label: 'Text F1-score', value: '90.71%' },
        { label: 'Vision accuracy', value: '87.03%' },
        { label: 'AUC-ROC', value: '0.95' }
      ]
    });

    const project2 = new Project({
      title: 'Social Nexus Hub',
      summary: 'A real-time chat and social networking application with group messaging, role-based access, and live notifications.',
      tech_stack: 'Socket.io, Node.js, Express.js, MongoDB, JWT',
      github_url: 'https://github.com/ANUrag45r/social-nexus-hub',
      start_date: 'Feb 2025',
      end_date: 'Feb 2025',
      featured: true,
      display_order: 2,
      bullets: [
        'Built a real-time chat application achieving message delivery latency below 100ms.',
        'Developed group chat functionality with role-based access control for admins and members.',
        'Implemented friend requests and user discovery with JWT authentication and secure session management.'
      ],
      metrics: [
        { label: 'Message latency', value: '<100ms' }
      ]
    });

    await project1.save();
    await project2.save();
    console.log('Projects seeded successfully.');

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
