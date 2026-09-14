// Central reactive store for BrandedCoders with LocalStorage persistence

const STORAGE_KEY = 'bc_central_store_v3';

const initialServices = [
  {
    _id: 's-dm',
    title: 'Digital Marketing & Growth',
    slug: 'digital-marketing',
    order: 1,
    icon: 'trending-up',
    badge: 'High ROI',
    summary: 'Data-driven SEO, Google Ads, Meta Ads, and full-funnel conversion optimization.',
    description: 'We scale brands through technical SEO audits, high-converting PPC campaigns, social media growth, email workflows, and analytics that directly drive revenue.',
    highlights: ['Google & Meta Ads PPC', 'Technical & Local SEO', 'Conversion Rate Optimization (CRO)', 'Content & Social Strategy'],
    published: true,
  },
  {
    _id: 's-web',
    title: 'Website Design & Development',
    slug: 'websites',
    order: 2,
    icon: 'globe',
    summary: 'Ultra-fast, accessible marketing sites and modern web applications built on React & modern stacks.',
    description: 'High-performance websites tailored to your brand identity with responsive layouts, fluid animations, and search-optimized structure.',
    highlights: ['React & Next.js Builds', 'Responsive Mobile-first Design', '95+ Google PageSpeed', 'Clean UI/UX Architecture'],
    published: true,
  },
  {
    _id: 's-cms',
    title: 'Custom Headless & MERN CMS',
    slug: 'cms',
    order: 3,
    icon: 'layers',
    summary: 'Intuitive content management systems that let marketing teams publish in seconds without developers.',
    description: 'Custom-tailored CMS architecture with role-based permissions, live previews, media asset libraries, and flexible content schemas.',
    highlights: ['Role-based Permissions', 'Zero-code Publishing', 'Structured Schemas', 'Lightning Fast APIs'],
    published: true,
  },
  {
    _id: 's-dash',
    title: 'Dashboards & Operational Tools',
    slug: 'dashboards',
    order: 4,
    icon: 'grid',
    summary: 'Real-time operational dashboards and internal workflows that turn complex data into clear action.',
    description: 'Live charts, multi-tier permissions, automated report generation, and third-party integrations tailored for business teams.',
    highlights: ['Real-time Metrics', 'Interactive Data Visualizations', 'Custom CSV/PDF Exports', 'Secure Auth & RBAC'],
    published: true,
  },
  {
    _id: 's-app',
    title: 'Web & Mobile Applications',
    slug: 'apps',
    order: 5,
    icon: 'smartphone',
    summary: 'Cross-platform iOS and Android mobile apps alongside responsive web clients sharing one secure backend.',
    description: 'Complete product engineering from Figma prototypes to app store deployment, built with React Native and robust cloud APIs.',
    highlights: ['iOS & Android Apps', 'Single Core API', 'Offline-first Capabilities', 'Push Notifications'],
    published: true,
  },
  {
    _id: 's-ai',
    title: 'AI-Integrated Platforms',
    slug: 'ai-platforms',
    order: 6,
    icon: 'cpu',
    summary: 'Intelligent LLM pipelines, autonomous agents, and smart retrieval workflows built directly into your app.',
    description: 'Empower your software with generative AI, custom RAG pipelines, intelligent search, automated support, and predictive insights.',
    highlights: ['Custom RAG Knowledge Bases', 'AI Chatbots & Agents', 'OpenAI & Claude Integrations', 'Automated Workflows'],
    published: true,
  },
];

const initialPortfolio = [
  {
    _id: 'p-1',
    title: 'YogSathi — Complete Yoga & Wellness Ecosystem',
    client: 'YogSathi',
    category: 'Web App & CMS',
    order: 1,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=700&auto=format&fit=crop&q=80',
    summary: 'Full-stack wellness platform built with Next.js, Node.js, and MongoDB featuring role-based dashboards, trainer management, appointments, memberships, and CMS.',
    metrics: '+320% Qualified Leads · 4.4x ROAS',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'MERN Stack', 'CMS'],
    published: true,
  },
  {
    _id: 'p-2',
    title: 'Physiopilates — Healthcare & Therapy Platform',
    client: 'Physiopilates Clinic',
    category: 'Web App & CMS',
    order: 2,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80',
    summary: 'Modern physiotherapy and wellness platform featuring appointment booking, doctor profiles, therapy modules, testimonials gallery, and responsive experience.',
    metrics: '40% Faster Turnaround · 12,000 Shipments/Day',
    tags: ['React', 'Express.js', 'MongoDB', 'Healthcare'],
    published: true,
  },
  {
    _id: 'p-3',
    title: '1xdrayxh Healthcare & Diagnostic Systems',
    client: 'Dr. Ayxh Diagnostics',
    category: 'Web App & CMS',
    order: 3,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=700&auto=format&fit=crop&q=80',
    summary: 'Responsive healthcare and diagnostic platform delivering modern service pages, structured content, online appointment bookings, and optimized patient UX.',
    metrics: '₹4.2M Monthly GMV · 99.98% Uptime',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe'],
    published: true,
  },
  {
    _id: 'p-4',
    title: 'Apex Scale B2B Inbound Engine',
    client: 'Apex Global Brands',
    category: 'Digital Marketing',
    order: 4,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=80',
    summary: 'Generated +320% qualified inbound pipeline through comprehensive SEO restructuring, Google Search PPC, and full-funnel conversion tracking.',
    metrics: '+320% Qualified Leads · 4.4x ROAS',
    tags: ['Google Ads', 'Meta Ads', 'SEO Audit', 'Analytics'],
    published: true,
  },
];


const initialEmployees = [
  {
    id: 'emp-1',
    name: 'Kanika Aggarwal',
    email: 'kanika@brandedcoders.com',
    role: 'Lead Business Development & Growth',
    phone: '+91 98765 43210',
    salary: 25000,
    monthlySalaryText: '₹25,000',
    bonusToday: '₹850',
    bonusGoal: '8/10 tasks with remarks',
    firstLogin: '09:30 AM',
    isOnline: true,
    onBreak: false,
    timerSeconds: 1121, // ~18 min 41 sec as in screenshot
  },
  {
    id: 'emp-2',
    name: 'Rahul Sharma',
    email: 'rahul@brandedcoders.com',
    role: 'Senior Digital Marketing Strategist',
    phone: '+91 98123 45678',
    salary: 22000,
    monthlySalaryText: '₹22,000',
    bonusToday: '₹600',
    bonusGoal: '6/10 tasks with remarks',
    firstLogin: '10:00 AM',
    isOnline: true,
    onBreak: false,
    timerSeconds: 940,
  },
  {
    id: 'emp-3',
    name: 'Priya Patel',
    email: 'priya@brandedcoders.com',
    role: 'Frontend UI/UX Specialist',
    phone: '+91 97654 32109',
    salary: 28000,
    monthlySalaryText: '₹28,000',
    bonusToday: 'Not set',
    bonusGoal: '4/10 tasks with remarks',
    firstLogin: '09:45 AM',
    isOnline: false,
    onBreak: false,
    timerSeconds: 0,
  },
];

const initialTeamMembers = [
  {
    id: 'tm-1',
    name: 'Sushant Aggarwal',
    role: 'Founder & Principal Engineer',
    location: 'Ludhiana, Punjab',
    bio: 'Full-stack software architect with 8+ years building enterprise web apps, high-throughput backend APIs, and scalable JavaScript architectures. Passionate about sub-second load times and zero-bloat code.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    expertise: ['Full-Stack JavaScript', 'Next.js & React', 'System Architecture'],
    order: 1,
  },
  {
    id: 'tm-2',
    name: 'Kanika Sharma',
    role: 'Co-Founder & Head of Growth',
    location: 'Ludhiana, Punjab',
    bio: 'Performance marketing strategist specializing in B2B SEO dominance, high-ROAS paid acquisition, and behavioral conversion optimization. Has managed over ₹1.5Cr in profitable ad spend.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    expertise: ['Performance Marketing', 'SEO Strategy', 'Funnel CRO'],
    order: 2,
  },
];

const initialPlans = [
  {
    id: 'plan-essential',
    name: 'Essential Care',
    tagline: 'Peace of mind for active marketing websites',
    price: '₹14,999',
    period: '/ month',
    sla: '24h SLA',
    badge: '',
    featured: false,
    order: 1,
    features: [
      '99.9% Uptime & Health Monitoring',
      'Weekly Security & Dependency Patches',
      'Automated Daily Cloud Backups',
      'Core Web Vitals & Speed Monitoring',
      'Up to 4 Hours dedicated monthly dev edits',
      'Email & WhatsApp ticket support (24h SLA)',
    ],
    cta: 'Choose Essential Care',
  },
  {
    id: 'plan-growth',
    name: 'Growth & Scale AMC',
    tagline: 'For revenue-generating platforms & apps',
    price: '₹29,999',
    period: '/ month',
    sla: '< 4h SLA',
    badge: 'Most Popular',
    featured: true,
    order: 2,
    features: [
      'Everything in Essential Care',
      'Priority Critical Bug Fixes (< 4h SLA)',
      'Continuous Monthly SEO & Speed Tuning',
      'Up to 12 Hours dedicated feature updates',
      'Conversion & Funnel Analytics Reporting',
      'Dedicated Senior Engineer & WhatsApp group',
    ],
    cta: 'Choose Growth AMC',
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Retainer',
    tagline: 'Dedicated engineering & growth partner',
    price: 'Custom',
    period: 'tailored SLA',
    sla: '1-hour SLA',
    badge: 'Enterprise',
    featured: false,
    order: 3,
    features: [
      'Full bespoke SLA with 1-hour critical response',
      'Dedicated sprint bandwidth (30+ hours/month)',
      'Custom CI/CD DevOps & Server Management',
      'Weekly growth strategy & optimization calls',
      'Quarterly architecture & security audits',
      'Direct phone/Slack line to leadership',
    ],
    cta: 'Contact for Retainer',
  },
];

const initialLeads = [
  {
    id: 'lead-1',
    name: 'Vikram Malhotra',
    phone: '+91 98112 34567',
    email: 'vikram@malhotratech.in',
    company: 'Malhotra Enterprises',
    leadType: 'Digital Marketing Lead',
    service: 'Digital Marketing & Growth',
    status: 'Demo scheduled',
    budget: '₹50,000 / mo',
    notes: 'Needs comprehensive Google Ads & SEO campaign for pan-India product launch.',
    assignedTo: 'Kanika Aggarwal',
    date: '2026-09-08',
    lastContacted: 'Today at 02:15 PM',
  },
  {
    id: 'lead-2',
    name: 'Ananya Deshmukh',
    phone: '+91 99234 56789',
    email: 'ananya@zenithcare.com',
    company: 'Zenith Health Solutions',
    leadType: 'Website Inbound',
    service: 'Web & Mobile Applications',
    status: 'Contacted',
    budget: '₹1,20,000',
    notes: 'Discussed telemedicine mobile app features. Sending scope deck tomorrow.',
    assignedTo: 'Kanika Aggarwal',
    date: '2026-09-08',
    lastContacted: 'Today at 11:30 AM',
  },
  {
    id: 'lead-3',
    name: 'Rohit Bansal',
    phone: '+91 98450 12345',
    email: 'rohit@bansalfoods.com',
    company: 'Bansal Agro & Foods',
    leadType: 'Cold Call',
    service: 'Custom Headless & MERN CMS',
    status: 'New',
    budget: '₹80,000',
    notes: 'Interested in replacing their old WordPress catalog with a modern MERN dashboard.',
    assignedTo: 'Kanika Aggarwal',
    date: '2026-09-07',
    lastContacted: 'Yesterday at 04:45 PM',
  },
  {
    id: 'lead-4',
    name: 'Siddharth Roy',
    phone: '+91 97118 89900',
    email: 'siddharth@fintechroy.io',
    company: 'Roy Global FinTech',
    leadType: 'Referral',
    service: 'Dashboards & Operational Tools',
    status: 'Active',
    budget: '₹2,50,000',
    notes: 'Contract signed for internal compliance dashboard. Kickoff scheduled Friday.',
    assignedTo: 'Kanika Aggarwal',
    date: '2026-09-06',
    lastContacted: 'Yesterday at 06:10 PM',
  },
  {
    id: 'lead-5',
    name: 'Meera Chawla',
    phone: '+91 99880 77665',
    email: 'meera@fashionpulse.in',
    company: 'FashionPulse Studio',
    leadType: 'Instagram Campaign',
    service: 'Digital Marketing & Growth',
    status: 'Closed',
    budget: '₹40,000 / mo',
    notes: 'Retainer agreed for Meta Ads management and brand engagement. Advance received.',
    assignedTo: 'Rahul Sharma',
    date: '2026-09-05',
    lastContacted: '3 days ago',
  },
  {
    id: 'lead-6',
    name: 'Harpreet Singh',
    phone: '+91 98722 33445',
    email: 'harpreet@punjabexports.org',
    company: 'Punjab Exports Corp',
    leadType: 'WhatsApp Inquiry',
    service: 'Website Design & Development',
    status: 'No response',
    budget: '₹60,000',
    notes: 'Shared quote 4 days ago. Sent a reminder on WhatsApp this morning.',
    assignedTo: 'Kanika Aggarwal',
    date: '2026-09-04',
    lastContacted: 'Today at 10:00 AM',
  },
];

const initialTasks = [
  {
    id: 'task-1',
    title: 'Follow up with Vikram Malhotra on SEO/PPC proposal',
    description: 'Review the tailored proposal for Malhotra Enterprises. Schedule the Google Meet demo and clarify ROAS targets.',
    assignedTo: 'Kanika Aggarwal',
    employeeId: 'emp-1',
    priority: 'High',
    category: 'Lead Follow-up',
    deadline: 'Today, 05:00 PM',
    status: 'In Progress',
    remarks: 'Called client at 2:15 PM. They requested sample case study for similar D2C brands.',
    assignedBy: 'Admin',
    createdAt: '2026-09-08 09:40 AM',
  },
  {
    id: 'task-2',
    title: 'Prepare Digital Marketing audit for Zenith Health',
    description: 'Audit their existing Google search visibility, speed metrics, and prepare 3 key growth recommendations.',
    assignedTo: 'Kanika Aggarwal',
    employeeId: 'emp-1',
    priority: 'Medium',
    category: 'Marketing Audit',
    deadline: 'Tomorrow, 02:00 PM',
    status: 'Pending',
    remarks: '',
    assignedBy: 'Admin',
    createdAt: '2026-09-08 11:00 AM',
  },
  {
    id: 'task-3',
    title: 'Call back 5 WhatsApp inquiries from Ludhiana region',
    description: 'Reach out to inbound queries regarding website redesign and local digital marketing services.',
    assignedTo: 'Kanika Aggarwal',
    employeeId: 'emp-1',
    priority: 'High',
    category: 'Cold Outreach',
    deadline: 'Today, 06:30 PM',
    status: 'Completed',
    remarks: 'Reached all 5 contacts. 2 scheduled consultation calls for Wednesday.',
    assignedBy: 'Admin',
    createdAt: '2026-09-08 10:15 AM',
  },
  {
    id: 'task-4',
    title: 'Review weekly ad budget allocation for Meta Ads client',
    description: 'Check CPC and CTR on Retargeting ad sets. Rebalance budget towards top performing video creative.',
    assignedTo: 'Rahul Sharma',
    employeeId: 'emp-2',
    priority: 'High',
    category: 'PPC Management',
    deadline: 'Today, 04:00 PM',
    status: 'Completed',
    remarks: 'Adjusted campaign budget. CTR increased to 3.8%.',
    assignedBy: 'Admin',
    createdAt: '2026-09-08 09:15 AM',
  },
];

const initialMessages = [
  {
    _id: 'msg-1',
    name: 'Karan Mehra',
    email: 'karan@cloudscale.co',
    company: 'CloudScale Technologies',
    projectType: 'Digital marketing',
    budget: '$5k–$10k',
    message: 'We want to scale our SaaS product signups via Google Search ads and SEO content strategy. Looking for a partner studio.',
    read: false,
    createdAt: '2026-09-08 14:20',
  },
  {
    _id: 'msg-2',
    name: 'Tanvi Kapoor',
    email: 'tanvi@studioarch.com',
    company: 'Studio Arch Design',
    projectType: 'Website',
    budget: '$3k–$6k',
    message: 'Need a fast, interactive website to showcase our architecture portfolio with light modern aesthetics.',
    read: true,
    createdAt: '2026-09-07 18:05',
  },
];

const initialSiteContent = {
  home: {
    heroEyebrow: '✨ Digital Product Studio & Growth Agency',
    heroHeadline: 'We build high-converting software and scale it with Digital Marketing.',
    heroGradientWord: 'Digital Marketing',
    heroDescription: 'BrandedCoders designs and engineers fast websites, bespoke CMS platforms, operational dashboards, and mobile apps — paired with data-driven SEO and paid acquisition to drive measurable revenue.',
    stat1Number: '60+',
    stat1Label: 'Products Shipped',
    stat2Number: '4.9/5',
    stat2Label: 'Client Rating',
    stat3Number: '+280%',
    stat3Label: 'Avg. Client Growth',
    stat4Number: '100%',
    stat4Label: 'In-House Team',
    marketingBannerTitle: 'Now Offering End-to-End Digital Marketing Services',
    marketingBannerDesc: 'Google & Meta Ads management, Technical SEO audits, Social Media Growth, and Conversion Rate Optimization.',
    ctaHeadline: 'Ready to launch or accelerate your digital product?',
    ctaDesc: "",
    teamEyebrow: 'Leadership & Accountability',
    teamHeading: 'Direct Access to the Engineers Building Your Product',
    teamSubheading: 'No non-technical middle managers. You work directly with senior founders and hands-on architects.',
    plansEyebrow: '',
    plansHeading: 'Website & App Maintenance Plans (AMC)',
    plansSubheading: '',
  },
  about: {
    eyebrow: 'About the Studio',
    title: 'We build software that grows businesses, not just portfolios.',
    description: 'Founded in Ludhiana, Punjab, BrandedCoders is a specialized full-stack digital product and growth studio. We combine modern JavaScript & React web engineering with performance Digital Marketing to build assets that produce real business equity.',
    storyTitle: 'How We Work Differently',
    pillars: [
      { num: '01', title: 'Engineers & Marketers in Constant Sync', body: 'Too often, developers build a product in a vacuum, and marketers struggle to convert its features. At BrandedCoders, our engineering stack and marketing funnels are designed together from day one.' },
      { num: '02', title: 'Content & Ops Independence for Clients', body: 'We don’t believe in client lock-in. Every build ships with an intuitive custom CMS and clear documentation so your non-technical team can update copy, launch promotions, and view data effortlessly.' },
      { num: '03', title: 'Performance & Speed Obsessed', body: 'A slow site directly degrades your Google SEO ranking and ad conversion rates. We tune Core Web Vitals, write lean modular React code, and optimize server response times to guarantee sub-second page loads.' },
      { num: '04', title: 'Accountability & Direct Access', body: 'You communicate directly with the senior engineers and growth strategists building your project. No layers of non-technical account executives slowing down progress.' },
    ],
    ctaTitle: 'Want to work together?',
    ctaDesc: 'We take on a limited number of client engagements each quarter to guarantee top quality.',
  },
  contact: {
    eyebrow: 'Start a Conversation',
    title: "Let's build or scale your digital presence.",
    description: 'Tell us about your project, timeline, and growth goals. We will review your requirements and schedule a productive 15-minute scoping call.',
    email: 'hello@brandedcoders.com',
    emailSubtext: 'Average reply time: under 4 hours',
    phone: '+91 98765 43210',
    phoneTimings: 'Mon–Sat, 09:30 AM to 07:00 PM IST',
    address: 'Ludhiana, Punjab, India',
    addressSubtext: 'Serving clients across India, North America & Europe',
    formTitle: 'Project Inquiry Form',
    formSubtext: 'Fill out this form and a lead will be routed immediately to our growth team.',
  },
  footer: {
    bio: 'Full-stack digital studio designing, engineering high-speed web apps, MERN platforms, and scaling them with data-driven Digital Marketing.',
    phone: '+91 98765 43210',
    email: 'hello@brandedcoders.com',
    address: 'Ludhiana, Punjab, India',
    copyright: '© 2026 BrandedCoders Studio. Built with React & modern web engineering.',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  },
  faqs: [
    { id: 'faq-1', question: 'How long does a typical website or web application project take?', answer: 'Landing pages and corporate websites typically take 2-3 weeks from initial wireframes to production deploy. Comprehensive web platforms with custom CMS or dashboards usually take 4-6 weeks.', order: 1 },
    { id: 'faq-2', question: 'What is included in your Digital Marketing services?', answer: 'Our growth retainers include technical SEO audits, Google Search & Display PPC management, Meta (Facebook/Instagram) advertising, high-converting creative ad design, landing page speed & CRO optimization, and bi-weekly ROI reports.', order: 2 },
    { id: 'faq-3', question: 'Can our internal team edit website content without code?', answer: 'Yes! Every project comes integrated with our custom CMS where your non-technical marketing or operations team can update text, add blog posts/case studies, manage FAQs, and review inquiries.', order: 3 },
    { id: 'faq-4', question: 'What tech stack do you build on?', answer: 'We specialize in the modern JavaScript & TypeScript ecosystem: React, Next.js, Node.js, Express, MongoDB, TailwindCSS, and Three.js for interactive 3D elements.', order: 4 },
    { id: 'faq-5', question: 'How do project payments and milestones work?', answer: 'We work on milestone-based billing: 40% upon project kickoff, 30% upon approval of design prototypes and staging build, and 30% upon final production deployment and handover.', order: 5 },
  ],
  reviews: [
    { id: 'rev-1', clientName: 'Rajesh Singhania', company: 'Singhania Logistics Ltd', rating: 5, comment: 'BrandedCoders replaced our entire spreadsheet workflow with a real-time tracking dashboard. Turnaround times improved by 40% within the first month. Incredible engineering quality!', projectType: 'Custom Dashboard & MERN App', date: 'August 2026' },
    { id: 'rev-2', clientName: 'Devika Nair', company: 'Zenith Organic Co.', rating: 5, comment: 'Their digital marketing team scaled our Meta and Google ads to a 4.6x ROAS in 60 days. The custom storefront loads in under 0.8 seconds. Cannot recommend them enough.', projectType: 'Web Storefront & Digital Marketing', date: 'July 2026' },
    { id: 'rev-3', clientName: 'Amanpreet Singh', company: 'Pulse Health Care', rating: 5, comment: 'Smooth communication from wireframes to mobile launch. Having the same team build the app and run the SEO meant zero wasted time and no handoff headaches.', projectType: 'Mobile App & SEO Audit', date: 'September 2026' },
  ],
  privacyPolicy: `# Privacy Policy\n\n**Effective Date: September 2026**\n\nBrandedCoders ("we", "our", or "us") values your privacy and is committed to protecting your personal data.\n\n### 1. Information We Collect\n- **Personal Information:** Name, email address, phone number, and company name when you submit project inquiries or contact our team.\n- **Technical Data:** IP address, browser type, and device information to optimize site performance and security.\n\n### 2. How We Use Your Information\n- To communicate regarding project quotes, scoping calls, and customer support.\n- To deliver agreed digital marketing, engineering, and CMS development services.\n- We never sell, rent, or trade your personal information to third parties.\n\n### 3. Data Security & Storage\nWe apply modern encryption protocols and industry-standard security safeguards. Your information is accessed only by authorized studio personnel.\n\n### 4. Contact Us\nFor any privacy questions, email us at: **hello@brandedcoders.com** or write to us at: **Ludhiana, Punjab, India**.`,
  termsAndConditions: `# Terms and Conditions\n\n**Last Updated: September 2026**\n\nBy accessing or using the BrandedCoders website, CMS, or engagement services, you agree to be bound by these terms.\n\n### 1. Scope of Work\nAll engineering, design, and digital marketing services are governed by written project agreements and milestone schedules agreed upon before commencement.\n\n### 2. Intellectual Property\nUpon complete payment of project invoices, all custom code, design files, and digital marketing assets created exclusively for the client are transferred to the client.\n\n### 3. Client Content & Warranties\nClients warrant that any logos, copy, images, and data provided to BrandedCoders are owned by the client or properly licensed.\n\n### 4. Limitation of Liability\nBrandedCoders is not liable for indirect, incidental, or consequential damages resulting from third-party API downtime, advertising platform policy shifts, or client server interruptions.\n\n### 5. Governing Law\nThese terms shall be governed by and construed in accordance with the laws of India, subject to the jurisdiction of the courts of Ludhiana, Punjab.`,
};

const initialAdmins = [
  {
    id: 'admin-1',
    name: 'Studio Administrator',
    email: 'admin@brandedcoders.com',
    password: 'admin123',
    role: 'Super Admin',
    createdAt: '2026-09-08',
  },
];

class CentralDataStore {
  constructor() {
    this.listeners = new Set();
    this.data = this.loadData();
    // Live timer runner for active employee session
    this.timerInterval = null;
    this.startGlobalTimer();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          services: parsed.services?.length ? parsed.services : initialServices,
          portfolio: parsed.portfolio?.length ? parsed.portfolio : initialPortfolio,
          employees: parsed.employees?.length ? parsed.employees : initialEmployees,
          teamMembers: parsed.teamMembers?.length ? parsed.teamMembers : initialTeamMembers,
          plans: parsed.plans?.length ? parsed.plans : initialPlans,
          leads: parsed.leads?.length ? parsed.leads : initialLeads,
          tasks: parsed.tasks?.length ? parsed.tasks : initialTasks,
          messages: parsed.messages?.length ? parsed.messages : initialMessages,
          siteContent: parsed.siteContent ? { ...initialSiteContent, ...parsed.siteContent } : initialSiteContent,
          admins: parsed.admins?.length ? parsed.admins : initialAdmins,
        };
      }
    } catch (e) {
      console.warn('Failed to parse stored data, resetting to defaults.', e);
    }
    return {
      services: initialServices,
      portfolio: initialPortfolio,
      employees: initialEmployees,
      teamMembers: initialTeamMembers,
      plans: initialPlans,
      leads: initialLeads,
      tasks: initialTasks,
      messages: initialMessages,
      siteContent: initialSiteContent,
      admins: initialAdmins,
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Storage quota exceeded or unavailable', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.data);
      } catch (e) {
        console.error('Error notifying listener', e);
      }
    }
  }

  startGlobalTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      let updated = false;
      this.data.employees = this.data.employees.map((emp) => {
        if (emp.isOnline && !emp.onBreak) {
          updated = true;
          return { ...emp, timerSeconds: (emp.timerSeconds || 0) + 1 };
        }
        return emp;
      });
      if (updated) {
        this.notify();
      }
    }, 1000);
  }

  // SERVICES
  getServices() {
    return [...this.data.services];
  }

  addService(service) {
    const newService = {
      ...service,
      _id: 's-' + Date.now(),
      order: this.data.services.length + 1,
      published: service.published !== false,
    };
    this.data.services.push(newService);
    this.save();
    return newService;
  }

  updateService(id, updates) {
    this.data.services = this.data.services.map((s) => (s._id === id ? { ...s, ...updates } : s));
    this.save();
  }

  deleteService(id) {
    this.data.services = this.data.services.filter((s) => s._id !== id);
    this.save();
  }

  // PORTFOLIO
  getPortfolio() {
    return [...this.data.portfolio];
  }

  addPortfolio(item) {
    const newItem = {
      ...item,
      _id: 'p-' + Date.now(),
      order: this.data.portfolio.length + 1,
      published: item.published !== false,
    };
    this.data.portfolio.push(newItem);
    this.save();
    return newItem;
  }

  updatePortfolio(id, updates) {
    this.data.portfolio = this.data.portfolio.map((p) => (p._id === id ? { ...p, ...updates } : p));
    this.save();
  }

  deletePortfolio(id) {
    this.data.portfolio = this.data.portfolio.filter((p) => p._id !== id);
    this.save();
  }

  // LEADS
  getLeads() {
    return [...this.data.leads];
  }

  addLead(lead) {
    const newLead = {
      id: 'lead-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      lastContacted: 'Just added',
      status: lead.status || 'New',
      assignedTo: lead.assignedTo || 'Kanika Aggarwal',
      budget: lead.budget || 'Open / Scoping',
      ...lead,
    };
    this.data.leads.unshift(newLead);
    this.save();
    return newLead;
  }

  updateLead(id, updates) {
    this.data.leads = this.data.leads.map((l) => (l.id === id ? { ...l, ...updates } : l));
    this.save();
  }

  deleteLead(id) {
    this.data.leads = this.data.leads.filter((l) => l.id !== id);
    this.save();
  }

  // TASKS
  getTasks() {
    return [...this.data.tasks];
  }

  addTask(task) {
    const newTask = {
      id: 'task-' + Date.now(),
      createdAt: new Date().toLocaleString(),
      status: task.status || 'Pending',
      remarks: task.remarks || '',
      assignedBy: 'Admin',
      ...task,
    };
    this.data.tasks.unshift(newTask);
    this.save();
    return newTask;
  }

  updateTask(id, updates) {
    this.data.tasks = this.data.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    this.save();
  }

  deleteTask(id) {
    this.data.tasks = this.data.tasks.filter((t) => t.id !== id);
    this.save();
  }

  // EMPLOYEES
  getEmployees() {
    return [...this.data.employees];
  }

  getEmployeeById(id) {
    return this.data.employees.find((e) => e.id === id) || null;
  }

  getEmployeeByEmail(email) {
    return this.data.employees.find((e) => e.email.toLowerCase() === email.toLowerCase()) || null;
  }

  addEmployee(employee) {
    const newEmp = {
      id: 'emp-' + Date.now(),
      isActive: true,
      isOnline: false,
      onBreak: false,
      firstLogin: 'Not logged in yet',
      timerSeconds: 0,
      bonusToday: '₹0',
      bonusGoal: '0/10 tasks with remarks',
      password: employee.password || 'employee123',
      monthlySalaryText: employee.salary ? (employee.salary.toString().startsWith('₹') ? employee.salary : '₹' + Number(employee.salary).toLocaleString()) : '₹20,000',
      ...employee,
    };
    this.data.employees.push(newEmp);
    this.save();
    return newEmp;
  }

  updateEmployee(id, updates) {
    this.data.employees = this.data.employees.map((emp) => {
      if (emp.id === id) {
        const updated = { ...emp, ...updates };
        if (updates.salary) {
          updated.monthlySalaryText = updates.salary.toString().startsWith('₹')
            ? updates.salary
            : '₹' + Number(updates.salary).toLocaleString();
        }
        return updated;
      }
      return emp;
    });
    this.save();
  }

  toggleEmployeeActive(id) {
    this.data.employees = this.data.employees.map((emp) => {
      if (emp.id === id) {
        const nextState = emp.isActive === false ? true : false;
        return { ...emp, isActive: nextState, isOnline: nextState ? emp.isOnline : false };
      }
      return emp;
    });
    this.save();
  }

  deleteEmployee(id) {
    this.data.employees = this.data.employees.filter((e) => e.id !== id);
    this.save();
  }

  toggleBreak(empId) {
    this.data.employees = this.data.employees.map((emp) => {
      if (emp.id === empId) {
        return { ...emp, onBreak: !emp.onBreak };
      }
      return emp;
    });
    this.save();
  }

  setEmployeeOnline(empId, isOnline) {
    this.data.employees = this.data.employees.map((emp) => {
      if (emp.id === empId) {
        return { ...emp, isOnline, onBreak: false };
      }
      return emp;
    });
    this.save();
  }

  // TEAM & LEADERSHIP MEMBERS (Public Website "Direct Access to Engineers")
  getTeamMembers() {
    if (!this.data.teamMembers) {
      this.data.teamMembers = [...initialTeamMembers];
    }
    return [...this.data.teamMembers].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getTeamMemberById(id) {
    return this.getTeamMembers().find((tm) => tm.id === id) || null;
  }

  addTeamMember(member) {
    if (!this.data.teamMembers) this.data.teamMembers = [...initialTeamMembers];
    const newMember = {
      id: 'tm-' + Date.now(),
      name: member.name || 'Team Member',
      role: member.role || 'Senior Engineer',
      location: member.location || 'Ludhiana, Punjab',
      bio: member.bio || '',
      image: member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      expertise: Array.isArray(member.expertise)
        ? member.expertise
        : (member.expertise ? member.expertise.split(',').map((s) => s.trim()).filter(Boolean) : []),
      order: (this.data.teamMembers.length || 0) + 1,
    };
    this.data.teamMembers.push(newMember);
    this.save();
    return newMember;
  }

  updateTeamMember(id, updates) {
    if (!this.data.teamMembers) this.data.teamMembers = [...initialTeamMembers];
    this.data.teamMembers = this.data.teamMembers.map((tm) => {
      if (tm.id === id) {
        let expertise = tm.expertise;
        if (updates.expertise !== undefined) {
          expertise = Array.isArray(updates.expertise)
            ? updates.expertise
            : updates.expertise.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return { ...tm, ...updates, expertise };
      }
      return tm;
    });
    this.save();
  }

  deleteTeamMember(id) {
    if (!this.data.teamMembers) return;
    this.data.teamMembers = this.data.teamMembers.filter((tm) => tm.id !== id);
    this.save();
  }

  resetTeamMembers() {
    this.data.teamMembers = [...initialTeamMembers];
    this.save();
  }

  // MAINTENANCE PLANS & AMC
  getPlans() {
    if (!this.data.plans) {
      this.data.plans = [...initialPlans];
    }
    return [...this.data.plans].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getPlanById(id) {
    return this.getPlans().find((p) => p.id === id) || null;
  }

  addPlan(plan) {
    if (!this.data.plans) this.data.plans = [...initialPlans];
    const newPlan = {
      id: 'plan-' + Date.now(),
      name: plan.name || 'New AMC Plan',
      tagline: plan.tagline || '',
      price: plan.price || '₹19,999',
      period: plan.period || '/ month',
      sla: plan.sla || '24h SLA',
      badge: plan.badge || '',
      featured: !!plan.featured,
      order: (this.data.plans.length || 0) + 1,
      features: Array.isArray(plan.features)
        ? plan.features
        : (plan.features ? plan.features.split('\n').map((s) => s.trim()).filter(Boolean) : []),
      cta: plan.cta || 'Choose Plan',
    };
    this.data.plans.push(newPlan);
    this.save();
    return newPlan;
  }

  updatePlan(id, updates) {
    if (!this.data.plans) this.data.plans = [...initialPlans];
    this.data.plans = this.data.plans.map((p) => {
      if (p.id === id) {
        let features = p.features;
        if (updates.features !== undefined) {
          features = Array.isArray(updates.features)
            ? updates.features
            : updates.features.split('\n').map((s) => s.trim()).filter(Boolean);
        }
        return { ...p, ...updates, features };
      }
      return p;
    });
    this.save();
  }

  deletePlan(id) {
    if (!this.data.plans) return;
    this.data.plans = this.data.plans.filter((p) => p.id !== id);
    this.save();
  }

  resetPlans() {
    this.data.plans = [...initialPlans];
    this.save();
  }

  // MESSAGES
  getMessages() {
    return [...this.data.messages];
  }

  addMessage(msg) {
    const newMsg = {
      _id: 'msg-' + Date.now(),
      createdAt: new Date().toLocaleString(),
      read: false,
      ...msg,
    };
    this.data.messages.unshift(newMsg);

    // Also automatically create an inbound lead from the contact message!
    this.addLead({
      name: msg.name,
      email: msg.email,
      phone: msg.phone || 'Provided via form',
      company: msg.company || 'Website Inquiry',
      leadType: 'Website Inbound',
      service: msg.projectType || 'Website Design & Development',
      budget: msg.budget || 'Scoping',
      status: 'New',
      notes: msg.message,
      assignedTo: 'Kanika Aggarwal',
    });

    this.save();
    return newMsg;
  }

  toggleMessageRead(id) {
    this.data.messages = this.data.messages.map((m) => (m._id === id ? { ...m, read: !m.read } : m));
    this.save();
  }

  deleteMessage(id) {
    this.data.messages = this.data.messages.filter((m) => m._id !== id);
    this.save();
  }

  // SITE CONTENT CMS
  getSiteContent() {
    return { ...this.data.siteContent };
  }

  updateSiteContent(section, newValues) {
    if (!this.data.siteContent) {
      this.data.siteContent = { ...initialSiteContent };
    }
    if (typeof newValues === 'string') {
      this.data.siteContent[section] = newValues;
    } else {
      this.data.siteContent[section] = {
        ...this.data.siteContent[section],
        ...newValues,
      };
    }
    this.save();
  }

  // FAQS
  getFaqs() {
    return [...(this.data.siteContent?.faqs || initialSiteContent.faqs)];
  }

  addFaq(faq) {
    if (!this.data.siteContent.faqs) this.data.siteContent.faqs = [];
    const newFaq = {
      id: 'faq-' + Date.now(),
      order: this.data.siteContent.faqs.length + 1,
      ...faq,
    };
    this.data.siteContent.faqs.push(newFaq);
    this.save();
    return newFaq;
  }

  updateFaq(id, updates) {
    if (!this.data.siteContent.faqs) return;
    this.data.siteContent.faqs = this.data.siteContent.faqs.map((f) => (f.id === id ? { ...f, ...updates } : f));
    this.save();
  }

  deleteFaq(id) {
    if (!this.data.siteContent.faqs) return;
    this.data.siteContent.faqs = this.data.siteContent.faqs.filter((f) => f.id !== id);
    this.save();
  }

  // REVIEWS
  getReviews() {
    return [...(this.data.siteContent?.reviews || initialSiteContent.reviews)];
  }

  addReview(rev) {
    if (!this.data.siteContent.reviews) this.data.siteContent.reviews = [];
    const newRev = {
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rating: 5,
      ...rev,
    };
    this.data.siteContent.reviews.unshift(newRev);
    this.save();
    return newRev;
  }

  updateReview(id, updates) {
    if (!this.data.siteContent.reviews) return;
    this.data.siteContent.reviews = this.data.siteContent.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r));
    this.save();
  }

  deleteReview(id) {
    if (!this.data.siteContent.reviews) return;
    this.data.siteContent.reviews = this.data.siteContent.reviews.filter((r) => r.id !== id);
    this.save();
  }

  // ADMINS MANAGEMENT
  getAdmins() {
    return [...(this.data.admins || initialAdmins)];
  }

  getAdminByEmail(email) {
    if (!email) return null;
    const list = this.getAdmins();
    return list.find((a) => a.email.toLowerCase() === email.toLowerCase()) || null;
  }

  getAdminById(id) {
    if (!id) return null;
    const list = this.getAdmins();
    return list.find((a) => a.id === id) || null;
  }

  addAdmin(admin) {
    if (!this.data.admins) this.data.admins = [...initialAdmins];
    const newAdmin = {
      id: 'admin-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      role: admin.role || 'Super Admin',
      password: admin.password || 'admin123',
      ...admin,
    };
    this.data.admins.push(newAdmin);
    this.save();
    return newAdmin;
  }

  updateAdmin(id, updates) {
    if (!this.data.admins) this.data.admins = [...initialAdmins];
    this.data.admins = this.data.admins.map((a) => (a.id === id ? { ...a, ...updates } : a));
    this.save();
  }

  updateAdminPassword(email, newPassword) {
    if (!this.data.admins) this.data.admins = [...initialAdmins];
    this.data.admins = this.data.admins.map((a) => {
      if (a.email.toLowerCase() === email.toLowerCase()) {
        return { ...a, password: newPassword };
      }
      return a;
    });
    this.save();
  }

  updateAdminPasswordById(id, newPassword) {
    if (!this.data.admins) this.data.admins = [...initialAdmins];
    this.data.admins = this.data.admins.map((a) => {
      if (a.id === id) {
        return { ...a, password: newPassword };
      }
      return a;
    });
    this.save();
  }

  deleteAdmin(id) {
    if (!this.data.admins) return;
    if (this.data.admins.length <= 1) {
      throw new Error('Cannot delete the last remaining administrator account.');
    }
    this.data.admins = this.data.admins.filter((a) => a.id !== id);
    this.save();
  }
}

export const dataStore = new CentralDataStore();
