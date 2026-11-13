/**
 * Single source of truth for every piece of content on the site.
 *
 * Sourced from the "Complete Professional Master Profile" and the verified
 * credential files. Three rules from that profile are enforced here:
 *
 *   1. No Techgene Solutions internal product, architecture or metric appears
 *      anywhere — current-role content is limited to general, transferable
 *      engineering responsibilities.
 *   2. No invented achievements. Every metric below traces to the resume; every
 *      credential below traces to a file in /public/certificates.
 *   3. Machine Learning / Deep Learning depth is not overstated — ML work is
 *      presented as academic/independent project experience, not expertise.
 */

import {
  Atom,
  Award,
  BadgeCheck,
  Bot,
  Boxes,
  Brain,
  Briefcase,
  Code,
  Container,
  Database,
  FileText,
  Gauge,
  GraduationCap,
  Home,
  Layers,
  MessageSquare,
  Mic,
  Network,
  Palette,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import {
  SiCelery,
  SiCss,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFlask,
  SiGit,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiLangchain,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiNumpy,
  SiOpencv,
  SiOpenjdk,
  SiPandas,
  SiPostgresql,
  SiPostman,
  SiPydantic,
  SiPython,
  SiQt,
  SiReact,
  SiRedis,
  SiScikitlearn,
  SiSqlite,
  SiSwagger,
  SiTypescript,
} from 'react-icons/si';

import type {
  Credential,
  Education,
  Experience,
  IconComponent,
  Identity,
  Metric,
  NavSection,
  Project,
  Service,
  SkillDomain,
  SocialProfile,
} from '@/domain/models';

/* ══════════════════════════════════════════════════════════════════════════
   IDENTITY
   ══════════════════════════════════════════════════════════════════════════ */

export const identity: Identity = {
  fullName: 'Voonna Gowri Ganesh',
  shortName: 'Gowri Ganesh',
  initials: 'VG',
  role: 'AI Developer',
  positioning: ['AI Developer', 'Full-Stack Product Engineer', 'AI Product Developer'],
  tagline:
    'Building Intelligent Products Through AI, Full-Stack Engineering and System Design.',
  headline: ['Building', 'Intelligent Products', 'with AI.'],
  supportingStatement: [
    'I build complete software products by combining AI engineering, full-stack development, system design and modern software architecture.',
    'From designing application interfaces and engineering backend systems to integrating AI capabilities and deploying production-ready applications, I work across the complete product development lifecycle.',
    'My goal is to transform complex requirements into intelligent, scalable and reliable technology solutions.',
  ],
  location: 'Hyderabad, India',
  email: 'voonnagowriganesh@gmail.com',
  phone: '+91 78159 65885',
  availability: 'Open to AI / full-stack product roles and freelance work',
  avatarUrl: '/images/profile-placeholder.svg',
  resumeUrl: '/resume/Voonna_Gowri_Ganesh_Resume.pdf',
  resumeFileName: 'Voonna_Gowri_Ganesh_Resume.pdf',
};

export const socials: readonly SocialProfile[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@voonnagowriganesh',
    href: 'https://github.com/voonnagowriganesh',
    icon: FaGithub,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'voonna-gowri-ganesh',
    href: 'https://www.linkedin.com/in/voonna-gowri-ganesh',
    icon: FaLinkedinIn,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   HEADLINE METRICS
   ══════════════════════════════════════════════════════════════════════════ */

export const headlineMetrics: readonly Metric[] = [
  { value: '2+', label: 'Years building software', countTo: 2, suffix: '+' },
  { value: '7', label: 'Shipped projects', countTo: 7 },
  { value: '11', label: 'Verified credentials', countTo: 11 },
  { value: '3', label: 'Engineering teams', countTo: 3 },
];

/* ══════════════════════════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════════════════════════ */

export const navSections: readonly NavSection[] = [
  { id: 'hero', label: 'Home', icon: Home, index: '00' },
  { id: 'about', label: 'About', icon: Sparkles, index: '01' },
  { id: 'experience', label: 'Experience', icon: Briefcase, index: '02' },
  { id: 'skills', label: 'Skills', icon: Layers, index: '03' },
  { id: 'projects', label: 'Projects', icon: Boxes, index: '04' },
  { id: 'credentials', label: 'Credentials', icon: Award, index: '05' },
  { id: 'services', label: 'Services', icon: Rocket, index: '06' },
  { id: 'contact', label: 'Contact', icon: MessageSquare, index: '07' },
];

/* ══════════════════════════════════════════════════════════════════════════
   EXPERIENCE
   Techgene entry is intentionally generic — see confidentiality rule above.
   ══════════════════════════════════════════════════════════════════════════ */

export const experiences: readonly Experience[] = [
  {
    id: 'techgene',
    company: 'Techgene Solutions',
    role: 'AI Developer',
    period: 'Jun 2026 — Present',
    startYear: '2026',
    location: 'Hyderabad, India',
    status: 'current',
    confidential: true,
    summary:
      'Building complete software products end to end — requirements and system architecture through frontend, backend, AI integration and production deployment.',
    responsibilities: [
      'End-to-end software product development across frontend, backend, data and AI layers',
      'Requirement analysis, technical planning and application architecture',
      'UI/UX implementation and frontend engineering',
      'Backend development, API engineering and database design',
      'AI, LLM and agentic workflow integration',
      'Third-party service and API integrations',
      'Infrastructure configuration, deployment and production verification',
      'Reliability, performance and scalability improvements',
    ],
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'LangGraph', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'zennial-pro',
    company: 'Zennial Pro',
    role: 'Associate Software Engineer',
    period: 'Apr 2025 — Jun 2026',
    startYear: '2025',
    location: 'Hyderabad, India',
    status: 'past',
    summary:
      'Backend and AI engineering for scalable services — microservices architecture, agent workflows and database performance.',
    responsibilities: [
      'Developed backend services using Python and REST APIs for scalable applications',
      'Architected microservices improving system modularity and maintainability',
      'Delivered AI-driven agent workflows increasing response accuracy by 25%',
      'Accelerated API performance, reducing response time by 40%',
      'Resolved production issues, improving overall system stability',
      'Optimised PostgreSQL queries for faster data retrieval',
    ],
    stack: ['Python', 'FastAPI', 'REST APIs', 'Microservices', 'PostgreSQL', 'LangChain'],
  },
  {
    id: 'instakart',
    company: 'Instakart · Flipkart',
    role: 'Trainee',
    period: 'Sep 2024 — Mar 2025',
    startYear: '2024',
    location: 'Hyderabad, India',
    status: 'past',
    summary:
      'Operations and systems analysis inside a large-scale supply chain environment.',
    responsibilities: [
      'Improved operational visibility by 30% through workflow analysis',
      'Reduced process errors by 25% via structured issue resolution',
      'Monitored system performance and generated analytical reports',
    ],
    stack: ['SQL', 'Process Analysis', 'Reporting'],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   SKILLS — grouped by the five core engineering domains
   ══════════════════════════════════════════════════════════════════════════ */

export const skillDomains: readonly SkillDomain[] = [
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    blurb:
      'Generative AI and LLM-powered applications: integration, prompting, retrieval and context management.',
    icon: Brain,
    skills: [
      { name: 'Generative AI', icon: Sparkles },
      { name: 'Large Language Models', icon: Brain },
      { name: 'LLM API Integration', icon: Network },
      { name: 'Prompt Engineering', icon: MessageSquare },
      { name: 'RAG Pipelines', icon: Database },
      { name: 'Embeddings & Semantic Retrieval', icon: Atom },
      { name: 'Context Management', icon: Layers },
      { name: 'Gemini API', icon: SiGooglegemini },
    ],
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    blurb:
      'Multi-step agent systems with tool calling, conditional routing and typed state.',
    icon: Bot,
    skills: [
      { name: 'LangChain', icon: SiLangchain },
      { name: 'LangGraph', icon: Workflow },
      { name: 'AI Agent Development', icon: Bot },
      { name: 'Tool & Function Calling', icon: Code },
      { name: 'Workflow Orchestration', icon: Workflow },
      { name: 'Conditional Routing', icon: Network },
      { name: 'Agent State Management', icon: Layers },
      { name: 'Human-in-the-Loop', icon: ShieldCheck },
    ],
  },
  {
    id: 'full-stack',
    title: 'Full-Stack Development',
    blurb:
      'Component-driven React interfaces on top of Python and Node service layers.',
    icon: Code,
    skills: [
      { name: 'Python', icon: SiPython },
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'React.js', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express', icon: SiExpress },
      { name: 'Flask', icon: SiFlask },
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss },
      { name: 'Java', icon: SiOpenjdk },
      { name: 'Responsive UI', icon: Palette },
    ],
  },
  {
    id: 'system-design',
    title: 'System Design & Architecture',
    blurb:
      'Modular application architecture, reliable error handling and scalable service boundaries.',
    icon: Server,
    skills: [
      { name: 'Application Architecture', icon: Server },
      { name: 'REST API Design', icon: SiSwagger },
      { name: 'Microservices', icon: Boxes },
      { name: 'Database Design', icon: Database },
      { name: 'Modular Software Design', icon: Layers },
      { name: 'Error Handling', icon: ShieldCheck },
      { name: 'Reliability Engineering', icon: Gauge },
      { name: 'Performance Optimisation', icon: Gauge },
      { name: 'Docker', icon: SiDocker },
      { name: 'Redis', icon: SiRedis },
      { name: 'Celery', icon: SiCelery },
      { name: 'Git', icon: SiGit },
    ],
  },
  {
    id: 'data',
    title: 'Database & Data Engineering',
    blurb:
      'Relational and document modelling, plus the processing layer that feeds AI systems.',
    icon: Database,
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'pgvector', icon: Atom },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'MySQL', icon: SiMysql },
      { name: 'SQLite', icon: SiSqlite },
      { name: 'Data Modelling', icon: Database },
      { name: 'Pandas', icon: SiPandas },
      { name: 'NumPy', icon: SiNumpy },
      { name: 'Data Validation', icon: SiPydantic },
      { name: 'Auth & JWT', icon: SiJsonwebtokens },
    ],
  },
];

/** Flat tech list powering the hero marquee. */
export const techMarquee: readonly { name: string; icon: IconComponent }[] = [
    { name: 'Python', icon: SiPython },
    { name: 'FastAPI', icon: SiFastapi },
    { name: 'LangGraph', icon: Workflow },
    { name: 'LangChain', icon: SiLangchain },
    { name: 'React', icon: SiReact },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'PostgreSQL', icon: SiPostgresql },
    { name: 'pgvector', icon: Atom },
    { name: 'Docker', icon: SiDocker },
    { name: 'Redis', icon: SiRedis },
    { name: 'Celery', icon: SiCelery },
    { name: 'MongoDB', icon: SiMongodb },
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'Gemini', icon: SiGooglegemini },
    { name: 'Postman', icon: SiPostman },
    { name: 'Git', icon: SiGit },
  ];

/* ══════════════════════════════════════════════════════════════════════════
   PROJECTS — independent and prior-employer work only
   ══════════════════════════════════════════════════════════════════════════ */

export const projects: readonly Project[] = [
  {
    id: 'voice-ai-agent',
    title: 'Voice AI Agent System',
    subtitle: 'Production-grade multi-agent voice assistant',
    category: 'Agentic AI',
    year: '2025',
    emphasis: 'feature',
    palette: ['#22d3ee', '#8b5cf6'],
    icon: Mic,
    summary:
      'A real-time, voice-driven multi-agent system: speech in, retrieval-grounded reasoning across specialised agents, speech out — under two seconds end to end.',
    highlights: [
      'Multi-agent architecture built on FastAPI, LangGraph and Gemini, increasing response relevance by 30%',
      'RAG pipeline over PostgreSQL + pgvector, improving contextual accuracy by 35%',
      'Real-time voice loop using Whisper for speech-to-text and Edge TTS for synthesis, under 2s latency',
      'Redis caching and Celery asynchronous processing, improving throughput efficiency by 40%',
    ],
    stack: [
      'FastAPI',
      'LangGraph',
      'Gemini',
      'PostgreSQL',
      'pgvector',
      'Whisper',
      'Edge TTS',
      'Redis',
      'Celery',
    ],
    metrics: [
      { value: '<2s', label: 'Voice round-trip latency' },
      { value: '+35%', label: 'Contextual accuracy' },
      { value: '+40%', label: 'Processing efficiency' },
    ],
  },
  {
    id: 'resume-parser',
    title: 'AI Resume Parsing System',
    subtitle: 'LLM-backed structured extraction at scale',
    category: 'AI Engineering',
    year: '2025',
    emphasis: 'feature',
    palette: ['#8b5cf6', '#e879f9'],
    icon: FileText,
    summary:
      'A backend service that ingests unstructured resumes and returns validated, structured candidate records — built for throughput and for being wrong as rarely as possible.',
    highlights: [
      'FastAPI + REST service processing 100+ resumes per hour',
      'LLM-based parsing improving structured data accuracy by 60%',
      'Preprocessing and validation workflows guaranteeing reliable extraction',
      'Optimised API and data handling raising processing efficiency by 35%',
    ],
    stack: ['FastAPI', 'Python', 'LLM Integration', 'REST APIs', 'PostgreSQL', 'Pydantic'],
    metrics: [
      { value: '100+/hr', label: 'Resumes processed' },
      { value: '+60%', label: 'Extraction accuracy' },
      { value: '+35%', label: 'Processing efficiency' },
    ],
  },
  {
    id: 'agentic-workflow',
    title: 'Agentic AI Workflow Application',
    subtitle: 'Planner-driven agent with live web retrieval',
    category: 'Agentic AI',
    year: '2025',
    emphasis: 'standard',
    palette: ['#0ea5b7', '#22d3ee'],
    icon: Workflow,
    summary:
      'A planner agent that decomposes a request, routes conditionally through tools including live search, and composes a grounded answer — with typed state throughout.',
    highlights: [
      'Planner-based workflow execution with conditional routing in LangGraph',
      'External tool integration via the Tavily search API',
      'Typed state management across multi-step runs',
      'React front end over a FastAPI orchestration layer',
    ],
    stack: ['Python', 'FastAPI', 'LangGraph', 'Gemini', 'Tavily', 'React'],
  },
  {
    id: 'food-delivery',
    title: 'Food Delivery Web Application',
    subtitle: 'Full MERN product build',
    category: 'Full-Stack',
    year: '2024',
    emphasis: 'standard',
    palette: ['#f59e0b', '#e879f9'],
    icon: Boxes,
    summary:
      'An end-to-end ordering platform — menu browsing, cart, checkout and order lifecycle — built across React, Express and MongoDB.',
    highlights: [
      'Component-based React front end with responsive layouts',
      'Express REST API covering catalogue, cart and order flows',
      'MongoDB document modelling for menus and orders',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    id: 'crime-prediction',
    title: 'Crime Prediction & Analysis',
    subtitle: 'Classification over public crime data',
    category: 'Machine Learning',
    year: '2024',
    emphasis: 'standard',
    palette: ['#6d4aff', '#0ea5b7'],
    icon: Gauge,
    summary:
      'An academic classification study: preprocessing, feature engineering and KNN modelling, served through a Flask interface.',
    highlights: [
      'KNN classifier reaching approximately 89% accuracy',
      'Data preprocessing, feature engineering and evaluation pipeline',
      'Flask application exposing predictions',
    ],
    stack: ['Python', 'Flask', 'Pandas', 'NumPy', 'Scikit-learn'],
    metrics: [{ value: '~89%', label: 'Model accuracy' }],
  },
  {
    id: 'stress-detection',
    title: 'Real-Time Stress Detection',
    subtitle: 'Computer-vision inference from webcam input',
    category: 'Machine Learning',
    year: '2023',
    emphasis: 'standard',
    palette: ['#e879f9', '#6d4aff'],
    icon: Atom,
    summary:
      'A live OpenCV pipeline that reads facial signals from a webcam stream and classifies stress indicators frame by frame.',
    highlights: [
      'Real-time frame capture and preprocessing with OpenCV',
      'Feature extraction feeding a lightweight classifier',
      'Continuous on-screen inference output',
    ],
    stack: ['Python', 'OpenCV', 'Machine Learning'],
  },
  {
    id: 'fantasy-cricket',
    title: 'Fantasy Cricket Team Builder',
    subtitle: 'Desktop application with local persistence',
    category: 'Full-Stack',
    year: '2023',
    emphasis: 'standard',
    palette: ['#10b981', '#22d3ee'],
    icon: Container,
    summary:
      'A PyQt5 desktop app for assembling fantasy teams under budget and role constraints, persisted to SQLite.',
    highlights: [
      'PyQt5 interface with constraint-aware team selection',
      'SQLite schema for players, teams and saved line-ups',
      'Object-oriented application structure',
    ],
    stack: ['Python', 'PyQt5', 'SQLite'],
  },
];

/** Icon lookup for project tech tags, kept separate so Project stays serialisable. */
export const stackIcons: Readonly<Record<string, IconComponent>> = {
  Python: SiPython,
  FastAPI: SiFastapi,
  React: SiReact,
  'React.js': SiReact,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  Flask: SiFlask,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  SQLite: SiSqlite,
  Docker: SiDocker,
  Redis: SiRedis,
  Celery: SiCelery,
  Git: SiGit,
  Gemini: SiGooglegemini,
  LangChain: SiLangchain,
  LangGraph: Workflow,
  Pandas: SiPandas,
  NumPy: SiNumpy,
  'Scikit-learn': SiScikitlearn,
  OpenCV: SiOpencv,
  PyQt5: SiQt,
  Pydantic: SiPydantic,
  'REST APIs': SiSwagger,
  pgvector: Atom,
};

/* ══════════════════════════════════════════════════════════════════════════
   CREDENTIALS — every entry verified against its source file
   ══════════════════════════════════════════════════════════════════════════ */

export const credentials: readonly Credential[] = [
  {
    id: 'postman-student-expert',
    title: 'Postman API Fundamentals Student Expert',
    issuer: 'Postman',
    issued: 'Oct 2025',
    kind: 'badge',
    verifyUrl: 'https://badges.parchment.com/public/assertions/d3bRihYGSL2H1uzF3cBRCA',
    detail: 'API design, testing and documentation fundamentals.',
    icon: SiPostman,
  },
  {
    id: 'fastapi-top-10',
    title: 'Top 10% FastAPI Coder',
    issuer: 'Credmark',
    issued: 'Oct 2025',
    kind: 'badge',
    verifyUrl: 'https://credmark.ai/badge/CM-2510-6O-VHDK',
    detail: 'Assessed in the top decile for FastAPI proficiency.',
    icon: SiFastapi,
  },
  {
    id: 'genai-in-practice',
    title: 'Generative AI in Practice',
    issuer: 'SoloLearn',
    issued: 'Apr 2026',
    kind: 'certificate',
    assetUrl: '/certificates/generative-ai-practice-cert.pdf',
    credentialId: 'CC-HTAS7PCO',
    detail: 'Theoretical and practical application of generative AI.',
    icon: Sparkles,
  },
  {
    id: 'genai-mastermind',
    title: 'Generative AI Mastermind',
    issuer: 'Outskill',
    issued: '2026',
    kind: 'certificate',
    assetUrl: '/certificates/generative-ai-cert.pdf',
    detail: 'Applied generative AI programme.',
    icon: Brain,
  },
  {
    id: 'multi-agent-strands',
    title: 'Building Multi Agent Systems with Strands Agents',
    issuer: 'Strands Agents',
    issued: 'Oct 2025',
    kind: 'certificate',
    assetUrl: '/certificates/multi-agent-cert.pdf',
    credentialId: '6q9qdw7yxi',
    detail: 'Designing and orchestrating cooperating agent systems.',
    icon: Bot,
  },
  {
    id: 'micro1-ai-interview',
    title: 'AI Interview Certification — Associate Software Engineer',
    issuer: 'micro1',
    issued: '2025',
    kind: 'badge',
    assetUrl: '/certificates/micro1-ai-interview.jpg',
    detail: 'AI-assessed technical interview certification.',
    icon: BadgeCheck,
  },
  {
    id: 'docker-kodekloud',
    title: 'Crash Course: Docker for Absolute Beginners',
    issuer: 'KodeKloud',
    issued: 'Dec 2025',
    kind: 'certificate',
    assetUrl: '/certificates/docker-cert.pdf',
    credentialId: '6beb1103-5cdb-4832-bbba-86c14583f13a',
    detail: 'Containers, images and container lifecycle.',
    icon: SiDocker,
  },
  {
    id: 'agile-explorer',
    title: 'Agile Explorer',
    issuer: 'IBM SkillsBuild',
    issued: 'Dec 2025',
    kind: 'badge',
    assetUrl: '/certificates/agile-cert.pdf',
    verifyUrl: 'https://www.credly.com/badges/17ea4563-048d-40d6-bd05-526d854f37e6',
    detail: 'Agile delivery principles and practices.',
    icon: Workflow,
  },
  {
    id: 'python-internshala',
    title: 'Programming with Python',
    issuer: 'Internshala Trainings',
    issued: 'Jun 2024',
    kind: 'certificate',
    assetUrl: '/certificates/python-cert.pdf',
    credentialId: 'hxa2pdgs379',
    detail:
      'Six-week training covering OOP principles, SQLite, PyQt GUIs and a final project. Scored 78%.',
    icon: SiPython,
  },
  {
    id: 'datavalley-internship',
    title: 'Long-Term Internship — Data Science, Machine Learning & AI',
    issuer: 'Datavalley India · APSCHE',
    issued: 'Apr 2024',
    kind: 'internship',
    assetUrl: '/certificates/data-valley-internship.pdf',
    detail: '240-hour internship in collaboration with the AP State Council of Higher Education.',
    icon: GraduationCap,
  },
  {
    id: 'wsa-mern-internship',
    title: 'Full Stack Web Development in MERN',
    issuer: 'Web Stack Academy',
    issued: 'Oct 2023',
    kind: 'internship',
    assetUrl: '/certificates/wsa-internship.pdf',
    credentialId: 'WMSI23_001',
    detail: 'Hands-on MERN internship covering HTML, CSS, JavaScript, React and SDLC delivery.',
    icon: SiReact,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   SERVICES
   ══════════════════════════════════════════════════════════════════════════ */

export const services: readonly Service[] = [
  {
    id: 'ai-applications',
    title: 'AI & LLM Applications',
    description:
      'LLM features that hold up in production — grounded in your data, measured, and cheap enough to run.',
    deliverables: [
      'RAG pipelines with vector search',
      'LLM API integration & prompt design',
      'Evaluation and guardrails',
    ],
    icon: Brain,
  },
  {
    id: 'agentic-systems',
    title: 'Agentic Workflows',
    description:
      'Multi-step agents with real tools, conditional routing and state you can inspect when something goes wrong.',
    deliverables: [
      'LangGraph / LangChain orchestration',
      'Tool & function calling',
      'Human-in-the-loop checkpoints',
    ],
    icon: Bot,
  },
  {
    id: 'backend',
    title: 'Backend & API Engineering',
    description:
      'FastAPI services designed around clear boundaries, typed contracts and predictable failure modes.',
    deliverables: ['FastAPI / REST services', 'Microservice architecture', 'Async & background jobs'],
    icon: Server,
  },
  {
    id: 'frontend',
    title: 'Frontend & Product UI',
    description:
      'React interfaces that feel considered — component architecture, responsive layout, real accessibility.',
    deliverables: ['React + TypeScript apps', 'Dashboards & data UI', 'Design-system components'],
    icon: Palette,
  },
  {
    id: 'data',
    title: 'Database & Data Layer',
    description:
      'Schema design and query work that keeps the data layer from becoming the bottleneck.',
    deliverables: ['PostgreSQL / MongoDB modelling', 'Query optimisation', 'pgvector & embeddings'],
    icon: Database,
  },
  {
    id: 'delivery',
    title: 'Deployment & Delivery',
    description:
      'Getting it live and keeping it live — containerised, configured and verified in production.',
    deliverables: ['Docker & containerisation', 'Environment configuration', 'Production verification'],
    icon: Rocket,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   EDUCATION & STRENGTHS
   ══════════════════════════════════════════════════════════════════════════ */

export const education: Education = {
  degree: 'Bachelor of Technology',
  specialisation: 'Computer Science & Engineering — Artificial Intelligence and Machine Learning',
  institution: 'S.R.K Institute of Technology',
  university: 'JNTU Kakinada',
  period: '2020 — 2024',
  location: 'Vijayawada, India',
};

export const strengths: readonly { title: string; icon: IconComponent }[] = [
  { title: 'End-to-end product development', icon: Rocket },
  { title: 'Full-stack application engineering', icon: Code },
  { title: 'Python backend engineering', icon: SiPython },
  { title: 'System design & architecture', icon: Server },
  { title: 'Generative AI applications', icon: Sparkles },
  { title: 'Agentic AI workflows', icon: Bot },
  { title: 'Database engineering', icon: Database },
  { title: 'Debugging & problem-solving', icon: Gauge },
];
