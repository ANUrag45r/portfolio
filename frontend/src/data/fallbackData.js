// Static fallback so the site renders correctly even before the backend
// + MySQL is running. Once the API is live, live data overrides this.
export const fallbackProfile = {
  profile: {
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
  },
  education: [
    { id: 1, institution: 'National Institute of Technology, Patna', degree: 'B.Tech in Computer Science and Engineering', score: 'CGPA: 7.8/10 (till 6th sem)', start_date: '2023', end_date: '2027' },
    { id: 2, institution: 'Holy Mission Senior Secondary School', degree: 'Class 12th', score: '91.7%', start_date: '', end_date: '2022' },
    { id: 3, institution: 'D.A.V Public School, BSEB', degree: 'Class 10th', score: '89.4%', start_date: '', end_date: '2020' },
  ],
  experience: [
    {
      id: 1, role: 'AEH Intern', organization: 'Accenture', start_date: 'May 2026', end_date: 'Jul 2026',
      bullets: [
        'Developed and deployed agentic AI workflows using LLM-based orchestration, automating enterprise business processes and reducing manual intervention by 40%.',
        'Worked with generative AI tools and cloud platforms to build intelligent automation pipelines integrated with existing enterprise systems.',
        'Contributed to AI-powered decision-making modules leveraging prompt engineering and retrieval-augmented generation (RAG) for workflow optimization.',
        'Followed Agile/Scrum methodologies, participating in sprint planning, code reviews, and cross-functional collaboration with senior engineers.',
      ],
    },
    {
      id: 2, role: 'Freelance Web Developer', organization: 'Motilal Nehru College, Delhi University', start_date: 'Feb 2025', end_date: 'Mar 2025',
      bullets: [
        'Developed a full-stack departmental website using React.js, Node.js (Express), and MongoDB, serving 500+ users across the campus community.',
        'Built a responsive content management system for notices, events, faculty profiles, and academic resources with real-time updates.',
        'Improved information dissemination efficiency by 70% and collaborated in a 3-member team to deliver the project on schedule.',
      ],
    },
  ],
  achievements: [
    { id: 1, achievement_text: 'Solved 500+ DSA questions across LeetCode and GeeksforGeeks.' },
    { id: 2, achievement_text: 'Qualified Pre-Regional Mathematics Olympiad (2019) and appeared in the Regional Mathematics Olympiad.' },
  ],
  skills: [
    { id: 1, category_name: 'Languages', skills: ['Python', 'JavaScript', 'C', 'C++', 'HTML', 'CSS'] },
    { id: 2, category_name: 'Frameworks & Libraries', skills: ['React.js', 'Node.js', 'Express.js', 'PyTorch', 'TensorFlow', 'Socket.io'] },
    { id: 3, category_name: 'Developer Tools', skills: ['Git', 'GitHub', 'Docker', 'VS Code'] },
    { id: 4, category_name: 'Databases & Cloud', skills: ['MongoDB', 'Firebase', 'MySQL'] },
  ],
};

export const fallbackProjects = [
  {
    id: 1,
    title: 'Dual-Modal Deep Fake News Detection System',
    summary: 'A dual-modal detection platform analyzing multilingual text and AI-generated deepfake imagery simultaneously, integrated into a real-time verification web interface.',
    tech_stack: 'PyTorch, TensorFlow, Keras, Hugging Face Transformers, XLM-RoBERTa, EfficientNetB0',
    github_url: 'https://github.com/ANUrag45r/MINOR_PROJECT_DEEP_FAKE_NEWS_DETECTION',
    start_date: 'Jan 2026', end_date: 'Apr 2026', featured: true,
    bullets: [
      'Engineered a text classification pipeline using hierarchical XLM-RoBERTa with sliding-window chunking (up to 2,560 tokens) on a bilingual English/Hindi corpus.',
      'Designed a computer vision module using EfficientNetB0 with transfer learning on 200,000+ images for deepfake image detection.',
      'Integrated both models into a web-based interface for real-time fake news and deepfake image verification with confidence scoring.',
    ],
    metrics: [
      { label: 'Text F1-score', value: '90.71%' },
      { label: 'Vision accuracy', value: '87.03%' },
      { label: 'AUC-ROC', value: '0.95' },
    ],
  },
  {
    id: 2,
    title: 'Social Nexus Hub',
    summary: 'A real-time chat and social networking application with group messaging, role-based access, and live notifications.',
    tech_stack: 'Socket.io, Node.js, Express.js, MongoDB, JWT',
    github_url: 'https://github.com/ANUrag45r/social-nexus-hub',
    start_date: 'Feb 2025', end_date: 'Feb 2025', featured: true,
    bullets: [
      'Built a real-time chat application achieving message delivery latency below 100ms.',
      'Developed group chat functionality with role-based access control for admins and members.',
      'Implemented friend requests and user discovery with JWT authentication and secure session management.',
    ],
    metrics: [{ label: 'Message latency', value: '<100ms' }],
  },
];
