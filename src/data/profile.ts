/**
 * Single source of truth for every piece of content on the site.
 * Sourced directly from profile data, verified credentials, and the Emerald Glow design.
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
  Database,
  Gauge,
  GraduationCap,
  Home,
  Layers,
  MessageSquare,
  Network,
  Palette,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { FaAws, FaEnvelope, FaGithub, FaLinkedinIn, FaMedium } from 'react-icons/fa6';
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
  headline: ['Hi, I\'m', 'Voonna Gowri Ganesh', 'Building Intelligent Products with AI.'],
  supportingStatement: [
    'I build and scale AI-powered products that transform complex business requirements into intelligent, reliable and production-ready solutions.',
    'From designing application interfaces and engineering backend systems to integrating AI capabilities and deploying production-ready applications, I work across the complete product development lifecycle.',
    'My goal is to transform complex requirements into intelligent, scalable and reliable technology solutions.',
  ],
  location: 'Hyderabad, India',
  email: 'voonnagowriganesh@gmail.com',
  phone: '+91 78159 65885',
  availability: 'AI Developer @ Techgene Solutions',
  avatarUrl: '/images/profile-photo.jpg',
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
  {
    id: 'email',
    label: 'Email',
    handle: 'voonnagowriganesh@gmail.com',
    href: 'mailto:voonnagowriganesh@gmail.com',
    icon: FaEnvelope,
  },
  {
    id: 'medium',
    label: 'Medium',
    handle: '@voonnagowriganesh',
    href: 'https://medium.com/@voonnagowriganesh',
    icon: FaMedium,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   HERO BADGES & FLOATING PILLS
   ══════════════════════════════════════════════════════════════════════════ */

export const heroFeaturePills: readonly { title: string; icon: IconComponent }[] = [
  { title: 'AI Product Development', icon: Brain },
  { title: 'LLMs & RAG Applications', icon: Sparkles },
  { title: 'Backend & System Design', icon: Server },
];

export const heroFloatingBadges: readonly { label: string; icon: IconComponent }[] = [
  { label: 'LLMs', icon: Brain },
  { label: 'RAG', icon: Layers },
  { label: 'AI Agents', icon: Bot },
  { label: 'Product Development', icon: Code },
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
   Matches design: Home, About, Experience, Projects, Skills, Certifications, Contact
   ══════════════════════════════════════════════════════════════════════════ */

export const navSections: readonly NavSection[] = [
  { id: 'hero', label: 'Home', icon: Home, index: '00' },
  { id: 'about', label: 'About', icon: Sparkles, index: '01' },
  { id: 'experience', label: 'Experience', icon: Briefcase, index: '02' },
  { id: 'projects', label: 'Projects', icon: Boxes, index: '03' },
  { id: 'skills', label: 'Skills', icon: Layers, index: '04' },
  { id: 'certifications', label: 'Certifications', icon: Award, index: '05' },
  { id: 'contact', label: 'Contact', icon: MessageSquare, index: '06' },
];

/* ══════════════════════════════════════════════════════════════════════════
   EXPERIENCE
   ══════════════════════════════════════════════════════════════════════════ */

export const experiences: readonly Experience[] = [
  {
    id: 'techgene',
    company: 'Techgene Solutions',
    role: 'AI Developer',
    period: 'Jun 2026 — Present',
    badgeText: 'Jun 2026 - Present',
    startYear: '2026',
    location: 'Hyderabad, India',
    status: 'current',
    confidential: true,
    logo: '/company_logos/techgene_solutions.png',
    summary:
      'Building AI products end to end — requirements, architecture, frontend, backend, AI integration and production deployment.',
    responsibilities: [
      'End-to-end software product development across frontend, backend, data and AI layers',
      'System design, application architecture and requirement analysis',
      'UI/UX implementation and frontend engineering with React and TypeScript',
      'Backend development and API engineering with Python and FastAPI',
      'AI, LLM and agentic workflow integration with LangGraph and RAG',
      'Reliability, performance, proxy integration and infrastructure scalability',
    ],
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'LangGraph', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'zennial-pro',
    company: 'Zennial Pro',
    role: 'Associate Software Engineer',
    period: 'Apr 2025 — Jun 2026',
    badgeText: 'Apr 2025 - Jun 2026',
    startYear: '2025',
    location: 'Hyderabad, India',
    status: 'past',
    logo: '/company_logos/zennial_pro.jpg',
    summary:
      'Worked on product development, automation and backend enhancements.',
    responsibilities: [
      'Developed backend services using Python and REST APIs for scalable applications',
      'Architected microservices improving system modularity and maintainability',
      'Delivered AI-driven agent workflows increasing response accuracy by 25%',
      'Accelerated API performance, reducing response time by 40%',
      'Optimised PostgreSQL queries for faster data retrieval',
    ],
    stack: ['Python', 'FastAPI', 'REST APIs', 'Microservices', 'PostgreSQL', 'LangChain'],
  },
  {
    id: 'flipkart',
    company: 'Flipkart',
    role: 'Trainee SCCP',
    period: 'Sep 2024 — Mar 2025',
    badgeText: 'Sep 2024 - Mar 2025',
    startYear: '2024',
    location: 'Hyderabad, India',
    status: 'past',
    logo: '/company_logos/flipkart.png',
    summary:
      'Gained experience in large-scale operations, process handling and cross-functional collaboration.',
    responsibilities: [
      'Improved operational visibility by 30% through workflow analysis',
      'Reduced process errors by 25% via structured issue resolution',
      'Monitored system performance and generated analytical reports',
    ],
    stack: ['SQL', 'Process Analysis', 'Reporting', 'Workflow Optimization'],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   TECHNICAL ARSENAL / TECH STACK
   ══════════════════════════════════════════════════════════════════════════ */

export interface StackCategory {
  id: string;
  name: string;
  icon: IconComponent;
  category: 'AI & GenAI' | 'Backend' | 'Frontend' | 'Database' | 'DevOps & Cloud';
}

export const technicalArsenal: readonly StackCategory[] = [
  { id: 'python', name: 'Python', icon: SiPython, category: 'Backend' },
  { id: 'langchain', name: 'LangChain', icon: SiLangchain, category: 'AI & GenAI' },
  { id: 'langgraph', name: 'LangGraph', icon: Workflow, category: 'AI & GenAI' },
  { id: 'llms', name: 'LLMs', icon: Brain, category: 'AI & GenAI' },
  { id: 'rag', name: 'RAG', icon: Layers, category: 'AI & GenAI' },
  { id: 'fastapi', name: 'FastAPI', icon: SiFastapi, category: 'Backend' },
  { id: 'react', name: 'React', icon: SiReact, category: 'Frontend' },
  { id: 'docker', name: 'Docker', icon: SiDocker, category: 'DevOps & Cloud' },
  { id: 'aws', name: 'AWS', icon: FaAws, category: 'DevOps & Cloud' },
  { id: 'typescript', name: 'TypeScript', icon: SiTypescript, category: 'Frontend' },
  { id: 'postgresql', name: 'PostgreSQL', icon: SiPostgresql, category: 'Database' },
  { id: 'redis', name: 'Redis', icon: SiRedis, category: 'Database' },
  { id: 'mongodb', name: 'MongoDB', icon: SiMongodb, category: 'Database' },
  { id: 'gemini', name: 'Gemini API', icon: SiGooglegemini, category: 'AI & GenAI' },
  { id: 'git', name: 'Git', icon: SiGit, category: 'DevOps & Cloud' },
];

export const techMarquee = technicalArsenal;

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

/* ══════════════════════════════════════════════════════════════════════════
   PROJECTS — Matching the exact 5 cards in the design layout
   ══════════════════════════════════════════════════════════════════════════ */

export const projects: readonly Project[] = [
  {
    id: 'voice-ai-agent-system',
    title: 'Voice AI Agent System',
    subtitle: 'Production-grade multi-agent voice assistant with real-time speech in, speech out.',
    category: 'AI Product',
    year: '2025',
    emphasis: 'feature',
    palette: ['#10b981', '#34d399'],
    icon: Bot,
    summary:
      'A real-time, voice-driven multi-agent system: speech in, retrieval-grounded reasoning across specialised agents, speech out — under two seconds end to end.',
    highlights: [
      'Multi-agent architecture built on FastAPI, LangGraph and Gemini, increasing response relevance by 30%',
      'RAG pipeline over PostgreSQL and pgvector, improving contextual accuracy by 35%',
      'Real-time voice interaction using Whisper (speech-to-text) and Edge TTS, with latency under 2 seconds',
      'Redis caching and Celery-based asynchronous processing, improving efficiency by 40%',
    ],
    stack: ['FastAPI', 'LangGraph', 'Gemini', 'PostgreSQL', 'Whisper', 'Edge TTS', 'Redis', 'Celery'],
    metrics: [
      { value: '<2s', label: 'Voice Round-Trip Latency' },
      { value: '+35%', label: 'Contextual Accuracy' },
      { value: '+40%', label: 'Processing Efficiency' },
    ],
  },
  {
    id: 'ai-resume-parsing-system',
    title: 'AI Resume Parsing System',
    subtitle: 'LLM-backed structured extraction, processing 100+ resumes per hour.',
    category: 'AI Engineering',
    year: '2025',
    emphasis: 'standard',
    palette: ['#0ea5e9', '#38bdf8'],
    icon: Brain,
    summary:
      'A backend system that ingests unstructured resumes and returns validated, structured candidate records at scale.',
    highlights: [
      'FastAPI and REST API backend processing 100+ resumes per hour',
      'LLM-based parsing techniques improving structured data accuracy by 60%',
      'Preprocessing and validation workflows ensuring reliable data extraction',
      'Optimised API and data handling increasing processing efficiency by 35%',
    ],
    stack: ['FastAPI', 'Python', 'LLM Integration', 'REST APIs', 'PostgreSQL', 'Pydantic'],
    metrics: [
      { value: '100+/hr', label: 'Resumes Processed' },
      { value: '+60%', label: 'Extraction Accuracy' },
      { value: '+35%', label: 'Processing Efficiency' },
    ],
  },
  {
    id: 'agentic-workflow-application',
    title: 'Agentic AI Workflow Application',
    subtitle: 'Planner-driven agent with live web retrieval and typed state.',
    category: 'Agentic AI',
    year: '2025',
    emphasis: 'standard',
    palette: ['#8b5cf6', '#a855f7'],
    icon: Workflow,
    summary:
      'A planner agent that decomposes a request, routes conditionally through tools including live search, and composes a grounded answer.',
    highlights: [
      'Planner-based workflow execution with conditional routing in LangGraph',
      'External tool integration via the Tavily search API',
      'Typed state management across multi-step runs',
      'React front end over a FastAPI orchestration layer',
    ],
    stack: ['Python', 'FastAPI', 'LangGraph', 'Gemini', 'Tavily', 'React'],
  },
  {
    id: 'food-delivery-app',
    title: 'Food Delivery Web Application',
    subtitle: 'Full MERN product build — menu, cart, checkout and order lifecycle.',
    category: 'Full-Stack',
    year: '2024',
    emphasis: 'standard',
    palette: ['#f59e0b', '#fbbf24'],
    icon: Code,
    summary:
      'An end-to-end ordering platform built across React, Express and MongoDB.',
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
    subtitle: 'Classification over public crime data using KNN.',
    category: 'ML / Data',
    year: '2024',
    emphasis: 'standard',
    palette: ['#ec4899', '#f472b6'],
    icon: Gauge,
    summary:
      'An academic classification study: preprocessing, feature engineering and KNN modelling, served through a Flask interface.',
    highlights: [
      'KNN classifier reaching approximately 89% accuracy',
      'Data preprocessing, feature engineering and evaluation pipeline',
      'Flask application exposing predictions',
    ],
    stack: ['Python', 'Flask', 'Pandas', 'NumPy', 'Scikit-learn'],
    metrics: [{ value: '~89%', label: 'Model Accuracy' }],
  },
  {
    id: 'stress-detection',
    title: 'Real-Time Stress Detection',
    subtitle: 'Webcam-based facial signal classification.',
    category: 'Computer Vision',
    year: '2023',
    emphasis: 'standard',
    palette: ['#a855f7', '#ec4899'],
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
];

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
  AWS: FaAws,
};

/* ══════════════════════════════════════════════════════════════════════════
   CASE STUDY: JOB SCRAPER & MARKET INTELLIGENCE PLATFORM
   ══════════════════════════════════════════════════════════════════════════ */

export const featuredCaseStudy = {
  title: 'Voice AI Agent System',
  subtitle:
    'A real-time, voice-driven multi-agent system built on FastAPI, LangGraph and Gemini — retrieval-grounded reasoning across specialised agents, speech in to speech out.',
  cubeImage: '/images/isometric_cube.png',
  metrics: [
    { value: '<2s', label: 'Voice Latency' },
    { value: '+35%', label: 'Contextual Accuracy' },
    { value: '+40%', label: 'Efficiency' },
  ],
  highlights: [
    'Multi-agent architecture increasing response relevance by 30%',
    'RAG pipeline over PostgreSQL and pgvector, +35% contextual accuracy',
    'Real-time voice loop via Whisper and Edge TTS, under 2s latency',
    'Redis caching and Celery async processing, +40% efficiency',
  ],
};

/* ══════════════════════════════════════════════════════════════════════════
   PROFESSIONAL CERTIFICATIONS
   Matching the 6 cards in the design + verified badges & certificates
   ══════════════════════════════════════════════════════════════════════════ */

export const certificationsList: readonly Credential[] = [
  {
    id: 'programming-python-internshala',
    title: 'Programming with Python',
    issuer: 'Internshala',
    issued: 'Jun 2024',
    kind: 'certificate',
    assetUrl: '/certificates/python-cert.pdf',
    logo: '/images/internshala.jpg',
    credentialId: 'hxa2pdgs379',
    detail: 'OOP principles, SQLite database integration, PyQt5 GUI development and final evaluation. Scored 78%.',
    icon: SiPython,
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
    id: 'datavalley-internship',
    title: 'Long-Term Internship — Data Science, Machine Learning & AI',
    issuer: 'Datavalley India · APSCHE',
    issued: 'Apr 2024',
    kind: 'internship',
    assetUrl: '/certificates/data-valley-internship.pdf',
    logo: '/images/data_valley.png',
    detail: '240-hour internship in collaboration with the AP State Council of Higher Education.',
    icon: GraduationCap,
  },
  {
    id: 'wsa-fullstack-mern',
    title: 'Full Stack Web Development (MERN)',
    issuer: 'Web Stack Academy',
    issued: 'Oct 2023',
    kind: 'internship',
    assetUrl: '/certificates/wsa-internship.pdf',
    logo: '/images/webstack.jpg',
    credentialId: 'WMSI23_001',
    detail: 'Hands-on MERN stack development covering React, Express, MongoDB, Node.js and complete product lifecycle delivery.',
    icon: SiReact,
  },
  {
    id: 'postman-student-expert',
    title: 'Postman API Fundamentals Student Expert',
    issuer: 'Postman',
    issued: 'Oct 25, 2025',
    kind: 'badge',
    verifyUrl: 'https://badges.parchment.com/public/assertions/d3bRihYGSL2H1uzF3cBRCA',
    detail: 'API design, testing, automated scripting and collection documentation.',
    icon: SiPostman,
  },
  {
    id: 'fastapi-top-10',
    title: 'Top 10% FastAPI Coder',
    issuer: 'Credmark',
    issued: 'Oct 24, 2025',
    kind: 'badge',
    verifyUrl: 'https://credmark.ai/badge/CM-2510-6O-VHDK',
    detail: 'Benchmarked in the top 10% worldwide for FastAPI development proficiency.',
    icon: SiFastapi,
  },
  {
    id: 'docker-kodekloud',
    title: 'Crash Course: Docker for Absolute Beginners',
    issuer: 'KodeKloud',
    issued: 'Dec 2025',
    kind: 'certificate',
    assetUrl: '/certificates/docker-cert.pdf',
    credentialId: '6beb1103-5cdb-4832-bbba-86c14583f13a',
    detail: 'Containers, image creation, multi-stage builds and Docker compose orchestration.',
    icon: SiDocker,
  },
  {
    id: 'genai-mastermind',
    title: 'Generative AI Mastermind',
    issuer: 'Outskill',
    issued: '2026',
    kind: 'certificate',
    assetUrl: '/certificates/generative-ai-cert.pdf',
    detail: 'Applied generative AI and LLM application engineering.',
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
    detail: 'Designing, deploying and coordinating multi-agent systems with state persistence.',
    icon: Bot,
  },
  {
    id: 'micro1-ai-interview',
    title: 'AI Interview Certification — Associate Software Engineer',
    issuer: 'micro1',
    issued: '2025',
    kind: 'badge',
    assetUrl: '/certificates/micro1-ai-interview.jpg',
    detail: 'AI-evaluated technical and system problem solving interview certification.',
    icon: BadgeCheck,
  },
];

export const credentials = certificationsList;

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
