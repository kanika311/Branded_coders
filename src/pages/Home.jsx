import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../components/3d/TiltCard.jsx';
import HeroWordCycler from '../components/HeroWordCycler.jsx';
import { dataStore } from '../lib/dataStore.js';

export default function Home() {
  const [faqs, setFaqs] = useState(dataStore.getFaqs());
  const [teamMembers, setTeamMembers] = useState(dataStore.getTeamMembers());
  const [supportPlans, setSupportPlans] = useState(dataStore.getPlans());
  const [siteContent, setSiteContent] = useState(dataStore.getSiteContent());

  useEffect(() => {
    return dataStore.subscribe((data) => {
      if (data.faqs) setFaqs(data.faqs);
      if (data.teamMembers) setTeamMembers(data.teamMembers);
      if (data.plans) setSupportPlans(data.plans);
      if (data.siteContent) setSiteContent(data.siteContent);
    });
  }, []);

  const [openFaqId, setOpenFaqId] = useState(0);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeCaseFilter, setActiveCaseFilter] = useState('All');
  const [cardViewModes, setCardViewModes] = useState({});
  const [quickViewCase, setQuickViewCase] = useState(null);
  const carouselRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // ChatSEO-style Website Audit state
  const [auditDomain, setAuditDomain] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditStage, setAuditStage] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const handleRunAudit = (e) => {
    if (e) e.preventDefault();
    const cleanDomain = (auditDomain || 'mysite.com').replace(/^https?:\/\//i, '').trim();
    if (!cleanDomain) return;

    setShowAuditModal(true);
    setIsAuditing(true);
    setAuditProgress(20);
    setAuditStage('Testing DNS, TLS handshake & measuring Core Web Vitals benchmark…');

    setTimeout(() => {
      setAuditProgress(55);
      setAuditStage('Auditing technical SEO indexation, meta tags & mobile responsiveness…');
    }, 600);

    setTimeout(() => {
      setAuditProgress(85);
      setAuditStage('Analyzing conversion rate optimization (CRO) & pipeline leaks…');
    }, 1200);

    setTimeout(() => {
      setAuditProgress(100);
      setIsAuditing(false);
      setAuditResult({
        domain: cleanDomain,
        overallScore: 94,
        speedScore: 98,
        seoScore: 92,
        croScore: 89,
        speedTime: '0.68s',
        findings: [
          'High Opportunity: Replace render-blocking JS bundles with Next.js Edge CDN to save ~1.2s.',
          'Organic SEO: 42 high-intent commercial keywords identified with strong 90-day ranking potential.',
          'Conversion CRO: Adding frictionless 1-click WhatsApp/call scheduling will boost lead conversion by ~2.4x.',
        ],
      });
    }, 1800);
  };

  useEffect(() => {
    return dataStore.subscribe(() => {
      setFaqs(dataStore.getFaqs());
    });
  }, []);

  // 1. SERVICES OVERVIEW (Techpyro's Clean Card Structure + Reference Pictures)
  const coreServices = [
    {
      title: 'Web Development',
      slug: '/web-development',
      icon: '🌐',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      desc: 'High-speed, SEO-optimized marketing sites and React/Next.js platforms engineered to convert visitors into paying clients.',
      badge: 'Sub-second Load Speed',
      tags: ['Next.js / React', 'Mobile-First', '95+ Google PageSpeed'],
    },
    {
      title: 'Digital Marketing',
      slug: '/digital-marketing',
      icon: '📈',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      desc: 'High-ROI Google Ads PPC, Meta Ads, and Technical SEO audits built to generate a predictable pipeline of qualified buyers.',
      badge: 'Avg. 4.2x ROAS',
      tags: ['Google PPC Ads', 'Technical SEO', 'Conversion Rate (CRO)'],
    },
    {
      title: 'Web App Development',
      slug: '/web-app-development',
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
      desc: 'Custom MERN dashboards, SaaS platforms, and internal business tools that eliminate manual spreadsheets and automate ops.',
      badge: 'Scalable Architecture',
      tags: ['Full-stack MERN', 'Role-Based Access', 'API Integrations'],
    },
    {
      title: 'Mobile App Development',
      slug: '/mobile-app-development',
      icon: '📱',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
      desc: 'Fluid cross-platform iOS and Android mobile apps engineered with React Native, sharing one secure, high-speed cloud backend.',
      badge: 'iOS & Android',
      tags: ['React Native', 'App Store Launch', 'Offline Support'],
    },
  ];

  // 2. WHY CHOOSE US / PROCESS (ChatSEO Alternating Visual Roadmap)
  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Growth Strategy',
      badge: 'Week 1',
      body: 'We audit your current bottlenecks, target audience search intent, and competitors before writing a single line of code. You receive an architectural roadmap, clear wireframes, and expected revenue targets.',
      bullets: ['Competitor & keyword search audit', 'Technical requirements scope', 'Fixed price & timeline guarantee'],
      visual: {
        title: 'Strategy & Scoping Matrix',
        stat: '100% Scope Clarity',
        detail: 'Zero unexpected change fees',
      },
    },
    {
      step: '02',
      title: 'Conversion Design & Rapid Engineering',
      badge: 'Weeks 2–4',
      body: 'Our engineers build in rapid sprint cycles using React, Node.js, and modern CSS. Frontends are designed with high-conversion psychology and tested on 15+ screen resolutions for one-handed mobile ease.',
      bullets: ['Figma to pixel-perfect React', 'Sub-800ms Core Web Vitals benchmark', 'Weekly staging preview demos'],
      visual: {
        title: 'Core Web Vitals Benchmark',
        stat: '99/100 Score',
        detail: 'Tested across mobile & 4G',
      },
    },
    {
      step: '03',
      title: 'Rigorous Quality Audit & Deployment',
      badge: 'Pre-Launch',
      body: 'Comprehensive automated testing, security checks, form verification, Google Analytics 4, and search engine schema indexation ensure day-one readiness.',
      bullets: ['Complete cross-browser QA', 'CRM & WhatsApp webhook testing', 'Clean production CDN rollout'],
      visual: {
        title: 'Pre-Flight QA Checklist',
        stat: '32-Point Audit',
        detail: 'Zero broken links or forms',
      },
    },
    {
      step: '04',
      title: 'Ongoing Support & Scaled Marketing',
      badge: 'Post-Launch',
      body: 'We don\u2019t disappear after delivery. We support your platform with 99.9% uptime monitoring, monthly speed tuning, and performance PPC ad management to scale inbound revenue.',
      bullets: ['Guaranteed SLA response times', 'Monthly security & dependency updates', 'Google & Meta ad scaling'],
      visual: {
        title: '',
        stat: '4.4x Average ROAS',
        detail: 'Compounding organic pipeline',
      },
    },
  ];

  // 3. REAL RESULTS / CASE STUDIES (Techpyro Real Results + Interactive Auto-scrolling)
  const caseStudies = [
    {
      id: 'cs-yogsathi',
      client: 'YogSathi.com',
      industry: 'Health & Wellness Ecosystem',
      category: 'Web App & CMS',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=700&auto=format&fit=crop&q=80',
      metric: '+320%',
      metricLabel: 'Inbound Qualified Signups',
      timeframe: 'Achieved in 90 Days',
      problem: 'Manual therapist scheduling, disconnected video links, and fragmented user referrals was stalling organic growth.',
      solution: 'Engineered complete Next.js full-stack platform with trainer dashboards, Razorpay recurring subscriptions, and a gamified referral rewards engine.',
      tags: ['Next.js', 'Node.js', 'MongoDB', 'Razorpay', 'Gamification'],
      link: '/work',
    },
    {
      id: 'cs-physio',
      client: 'Physiopilates Clinic',
      industry: 'Physiotherapy & Rehabilitation',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&auto=format&fit=crop&q=80',
      metric: '40%',
      metricLabel: 'Faster Appointment Turnaround',
      timeframe: '500+ Weekly Patients',
      problem: 'Front-desk phone overload and uncoordinated therapy session tracking caused severe booking friction and lost patient history.',
      solution: 'Engineered clean booking portal, doctor availability calendars, encrypted patient health records, and responsive mobile UI.',
      tags: ['React', 'Express.js', 'MongoDB', 'Healthcare HIPAA', 'Calendar API'],
      link: '/work',
    },
    {
      id: 'cs-1xdrayxh',
      client: '1xdrayxh Healthcare Systems',
      industry: 'Diagnostics & Healthcare Services',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=700&auto=format&fit=crop&q=80',
      metric: '₹4.2M',
      metricLabel: 'Monthly Digital Transactions',
      timeframe: '99.98% Platform Uptime',
      problem: 'Required high-security healthcare architecture with fast diagnostic reporting and patient test dispatch without server latency.',
      solution: 'Custom Next.js & Tailwind diagnostic platform with instant encrypted report downloads, SMS webhooks, and zero-latency backend.',
      tags: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe', 'SMS Webhooks'],
      link: '/work',
    },
    {
      id: 'cs-apex',
      client: 'Apex Scale Growth Engine',
      industry: 'B2B Industrial Exports',
      category: 'Growth & PPC',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=80',
      metric: '4.4x',
      metricLabel: 'Verified Google Ads ROAS',
      timeframe: 'Scaling Globally',
      problem: 'Outdated static catalog with zero inbound search visibility losing lucrative orders to overseas competitors.',
      solution: 'Turnkey headless Next.js portal paired with performance Google Search PPC and local B2B keyword ranking.',
      tags: ['Google Ads', 'B2B SEO', 'Next.js', 'GA4 Analytics', 'CRO'],
      link: '/work',
    },
    {
      id: 'cs-northline',
      client: 'Northline Freight Hub',
      industry: 'Enterprise Logistics & Supply Chain',
      category: 'Web App & CMS',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&auto=format&fit=crop&q=80',
      metric: '-20 hrs',
      metricLabel: 'Daily Operations Time Saved',
      timeframe: '12,000 Shipments / Day',
      problem: 'Dispatchers spent 20+ hours daily manually synchronizing multiple shipping manifests across spreadsheets.',
      solution: 'Real-time logistics operations dashboard with WebSocket driver updates, automated dispatch matching, and instant ERP exports.',
      tags: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'WebSockets'],
      link: '/work',
    },
    {
      id: 'cs-verdant',
      client: 'Verdant Goods D2C',
      industry: 'Direct-to-Consumer Lifestyle',
      category: 'Growth & PPC',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&auto=format&fit=crop&q=80',
      metric: '+240%',
      metricLabel: 'Checkout Conversion Lift',
      timeframe: 'Sub-600ms Core Web Vitals',
      problem: 'High mobile bounce rates and 68% cart abandonments due to slow bloated drag-and-drop page builder software.',
      solution: 'Rebuilt storefront with headless Next.js, Edge CDN caching, friction-free Razorpay/Stripe checkout, and Meta CAPI tracking.',
      tags: ['Next.js', 'Tailwind', 'Stripe', 'Meta CAPI', 'Edge CDN'],
      link: '/work',
    },
  ];

  const caseCategories = ['All', 'Healthcare', 'Web App & CMS', 'Growth & PPC'];

  const filteredCaseStudies = activeCaseFilter === 'All'
    ? caseStudies
    : caseStudies.filter((cs) => cs.category === activeCaseFilter);

  // Programmatic smooth scroll to card inside carousel track only (never affects window/page scroll)
  const scrollToCard = (index) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll('.case-study-card');
    if (cards[index]) {
      const container = carouselRef.current;
      const card = cards[index];
      const targetScrollLeft = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    }
  };

  const handleNextCase = () => {
    const nextIdx = (activeCaseIndex + 1) % filteredCaseStudies.length;
    setActiveCaseIndex(nextIdx);
    scrollToCard(nextIdx);
  };

  const handlePrevCase = () => {
    const prevIdx = (activeCaseIndex - 1 + filteredCaseStudies.length) % filteredCaseStudies.length;
    setActiveCaseIndex(prevIdx);
    scrollToCard(prevIdx);
  };

  const handleSelectCase = (idx) => {
    setActiveCaseIndex(idx);
    scrollToCard(idx);
  };

  const handleToggleCardView = (client, mode) => {
    setCardViewModes((prev) => ({
      ...prev,
      [client]: mode,
    }));
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };



  // 4. TESTIMONIALS ("Wall of Love" Quote Cards - Exact ChatSEO Screenshot Style)
  const testimonials = [
    {
      id: 'rev-timothee',
      name: 'Timothée Tabary',
      role: 'Manager, e-commerce stores',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      linkedin: true,
      rating: 5,
      date: 'January 17, 2026',
      leadText: "On several of my sites, I've seen real gains in search engine rankings and an increase in organic traffic.",
      highlightText: 'I even tripled my clicks on this site in 3 months.',
      tailText: 'I use their full-stack engineering and SEO audit workflow almost every day across my various e-commerce stores and I recommend BrandedCoders 100%!',
      proofType: 'search-console',
      proofData: {
        clicks: '108 k',
        impressions: '12.4 M',
        ctr: '0.8%',
        position: '7.7',
      },
    },
    {
      id: 'rev-pandiweb',
      name: 'PANDIWEB',
      role: 'Web developer and manager',
      avatar: null,
      monogram: '🐼',
      monogramBg: '#F1F5F9',
      monogramColor: '#0F172A',
      rating: 5,
      date: 'May 14, 2026',
      leadText: "I've been working with BrandedCoders for 6 months. I'm very happy with it.",
      highlightText: 'My clicks are up 70% and appointment bookings doubled.',
      proofType: 'insights-box',
      proofData: {
        timeframe: 'Last 90 Days',
        clicks: '152',
        clicksChange: '70%',
        impressions: '27.9 k',
        impressionsChange: '46%',
      },
    },
    {
      id: 'rev-antoine',
      name: 'Antoine Tournaire',
      role: 'Manager / Web & graphic designer / SEO',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'May 19, 2026',
      leadText: "I've been partnering with BrandedCoders since the beginning, or almost. I find their recommendations for Next.js web apps and conversion funnels extremely relevant.",
      highlightText: 'Qualified traffic is coming in, slowly but surely!',
      proofType: 'traffic-sparkline',
      proofData: {
        stat1: '3.15k',
        stat2: '111k',
        stat3: '1.9%',
        stat4: '19.8',
      },
    },
    {
      id: 'rev-alex',
      name: 'Alex',
      role: 'Founder, D2C Lifestyle',
      avatar: null,
      monogram: 'A',
      monogramBg: '#EDE9FE',
      monogramColor: '#7C3AED',
      rating: 5,
      date: 'December 29, 2025',
      leadText: 'A really simple and high-converting team to partner with, and very promising.',
      highlightText: 'Our checkout drop-off fell by 34% after their sub-800ms speed rewrite.',
      tailText: "I run a multi-channel store; their technical audit identified critical bottlenecks that completely transformed our mobile performance.",
    },
    {
      id: 'rev-alexandre',
      name: 'Alexandre Soete',
      role: 'CEO, Healthcare Diagnostics',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'May 22, 2026',
      leadText: 'I use BrandedCoders primarily to rebuild slow legacy web portals and rewrite core commercial pages.',
      highlightText: 'I really appreciate how their engineers understand search context, Google Search Console, and mobile user journeys.',
      tailText: "It helped our agency scale without inflating overhead.",
    },
    {
      id: 'rev-david',
      name: 'David Aumont',
      role: 'Founder & CTO, Cloud Analytics',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'December 30, 2025',
      leadText: "I tested BrandedCoders on my agency's flagship product. First, I asked them to analyze the platform and develop an architecture roadmap.",
      highlightText: 'Incredibly, they identified all the hidden speed bottlenecks that I had noted myself.',
      tailText: "I thought, 'Well, we're finally on the same page with developers who get business ROI.'",
    },
    {
      id: 'rev-nicolas',
      name: 'Nicolas Since',
      role: 'Web Project Manager',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'December 23, 2025',
      leadText: 'I really like that their solutions connect cleanly with other tools like Google Search Console, CRM webhooks, and MERN databases.',
      highlightText: 'It eliminated over 20 hours of spreadsheet chaos every week.',
      tailText: "We're finally able to track our shipments and client orders in real time with zero latency.",
    },
    {
      id: 'rev-enzo',
      name: 'Enzo Connen',
      role: 'Owner of the Estate & Hospitality',
      avatar: null,
      monogram: 'EC',
      monogramBg: '#DBEAFE',
      monogramColor: '#1E40AF',
      rating: 5,
      date: 'December 2, 2025',
      leadText: "Great team: it's like having an executive CTO and performance marketing director on call.",
      highlightText: 'Our direct bookings skyrocketed by 2.4x while 3rd party commission fees plummeted.',
      tailText: 'Well done!',
    },
    {
      id: 'rev-rajesh',
      name: 'Rajesh Singhania',
      role: 'Managing Director, Apex Global',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      linkedin: true,
      rating: 5,
      date: 'July 28, 2026',
      leadText: 'Too often, development agencies disappear after deploy. BrandedCoders is available, attentive, and provides quick, actionable answers.',
      highlightText: 'International qualified inquiries skyrocketed by 320% in 90 days.',
      tailText: 'This is a real partner that inspires total confidence. Outstanding execution!',
    },
  ];

  // 7. FREQUENTLY ASKED QUESTIONS (5-6 high-value questions)
  const faqItems = [
    {
      q: 'How much does a typical project cost?',
      a: 'We provide transparent, fixed-scope proposals so there are never hidden fees. Typical marketing websites range from ₹45,000 to ₹1,20,000 depending on custom requirements. Custom web applications and dashboards start from ₹1,50,000. We can provide an exact quote within 24 hours of your initial consultation call.',
    },
    {
      q: 'What is your typical project timeline from kickoff to launch?',
      a: 'Most marketing websites launch within 2 to 4 weeks. Custom web apps and mobile applications usually require 4 to 8 weeks depending on backend complexity. We operate on transparent 1-week sprints with live preview links so you always see steady progress.',
    },
    {
      q: 'What technologies and frameworks do you use?',
      a: 'We use modern, battle-tested technologies: React, Next.js, and TypeScript on the frontend; Node.js, Express, and Python on the backend; MongoDB, PostgreSQL, and Redis for databases; and React Native for cross-platform mobile apps. We avoid bloated drag-and-drop page builders so your site stays fast forever.',
    },
    {
      q: 'How does your ongoing support/AMC plan work?',
      a: 'After deployment, we provide 30 days of complimentary bug-fixing and support. After that, clients can enroll in our monthly AMC plans to handle security patches, content updates, speed optimization, and feature enhancements with guaranteed SLAs.',
    },
    {
      q: 'Do you guarantee sub-second page speed and SEO optimization?',
      a: 'Yes! Every website we engineer is strictly benchmarked against Google Core Web Vitals to achieve 90+ PageSpeed scores on mobile. We bake in semantic HTML, OpenGraph tags, automated XML sitemaps, and structured JSON-LD schema right out of the box.',
    },
    {
      q: 'How do we get started with BrandedCoders?',
      a: 'Simply click "Get a Free Consultation" or send us a message on WhatsApp. We schedule a free 45-minute scoping call to understand your goals, and within 24 hours deliver a detailed technical roadmap with milestone deliverables and exact pricing.',
    },
  ];

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A', overflowX: 'hidden' }}>
      {/* 1. HERO SECTION (ChatSEO Layout + Unified Web Building & Marketing + Interactive Audit) */}
      <section style={{ padding: '80px 0 64px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '980px', textAlign: 'center' }}>
          {/* Eyebrow & Status Pill */}
          <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <div className="hero-pill-badge" style={{ gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
              <span>Full-Stack Engineering &amp; Growth Studio</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
              <span style={{ color: '#059669', fontWeight: 700 }}>● Taking New Clients</span>
            </div>
          </div>

          {/* ChatSEO-Inspired Display Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              color: '#0F172A',
              maxWidth: '920px',
              margin: '0 auto',
            }}
          >
            From <span style={{ color: '#2563EB' }}>Website Building</span> to{' '}
            <span style={{ color: '#2563EB' }}>High-ROI Marketing</span> &mdash; Everything Under{' '}
            <span style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#0F172A', textDecoration: 'underline decoration-blue-500/25' }}>
              One Roof
            </span>
            <span style={{ color: '#FF7A00', display: 'inline-block', marginLeft: '6px', fontSize: '0.9em' }}>✹</span>
          </h1>

          {/* Interactive Multidisciplinary Word Cycler */}
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>We eliminate vendor disconnect across</span>
            <HeroWordCycler />
          </div>

          {/* ChatSEO Clear Subheadline */}
          <p
            style={{
              marginTop: 18,
              fontSize: 'clamp(1.05rem, 1.8vw, 1.18rem)',
              color: '#475569',
              lineHeight: 1.65,
              maxWidth: '720px',
              margin: '18px auto 0',
            }}
          >
            Enter your website or product vision. BrandedCoders diagnoses technical bottlenecks, uncovers commercial growth leaks, and delivers custom full-stack web platforms + high-intent SEO under one unified roof.
          </p>

          {/* Interactive URL / Growth Audit Input Box (ChatSEO Centerpiece) */}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <form
              onSubmit={handleRunAudit}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '12px',
                padding: '6px 8px 6px 18px',
                boxShadow: '0 10px 30px -6px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
                width: '100%',
                maxWidth: '560px',
                gap: 10,
                position: 'relative',
              }}
            >
              <span style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.96rem' }}>https://</span>
              <input
                type="text"
                placeholder="mysite.com or your brand idea"
                value={auditDomain}
                onChange={(e) => setAuditDomain(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#0F172A',
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 22px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.32)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1D4ED8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2563EB')}
              >
                <span>Analyze my website</span>
                <span>&rarr;</span>
              </button>
            </form>
            <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#64748B' }}>
              Free to start &mdash; no credit card required · 45-minute technical roadmap included
            </div>
          </div>

          {/* ChatSEO Social Proof (Avatars Stack + 5 Stars + Text) */}
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                alt="Founder"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', marginLeft: '-6px' }}
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                alt="Client 1"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', marginLeft: '-6px' }}
              />
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80"
                alt="Growth Lead"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', marginLeft: '-6px' }}
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                alt="Client 2"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', marginLeft: '-6px' }}
              />
            </div>
            <div style={{ color: '#F59E0B', fontSize: '1.05rem', letterSpacing: '2px' }}>
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </div>
            <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600 }}>
              Used by 50+ website owners &amp; founders
            </span>
          </div>

          {/* Client Trust Logos Strip (ChatSEO "They trust us:" exact style) */}
          <div style={{ marginTop: 44, paddingTop: 26, borderTop: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
              They trust us:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, flexWrap: 'wrap', opacity: 0.85 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif' }}>
                YOGSATHI
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontStyle: 'italic', color: '#1E293B', fontFamily: 'Georgia, serif' }}>
                physiopilates
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.04em', color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} /> 1XDRAYXH
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0F172A' }}>
                APEX GLOBAL
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
                NORTHLINE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Website Audit Modal */}
      {showAuditModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAuditModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '620px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#2563EB', fontWeight: 700, textTransform: 'uppercase' }}>
                  BrandedCoders Architecture Audit
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                  {auditDomain || 'Your Website'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#64748B',
                }}
              >
                &#10005;
              </button>
            </div>

            {isAuditing ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚡</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
                  Analyzing {auditDomain || 'Website'}
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ width: `${auditProgress}%`, height: '100%', background: 'linear-gradient(90deg, #2563EB, #38BDF8)', transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ fontSize: '0.84rem', color: '#64748B' }}>{auditStage}</div>
              </div>
            ) : (
              auditResult && (
                <div>
                  {/* Scoreboard Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {auditResult.speedScore}/100
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, marginTop: 4 }}>
                        Core Web Vitals ({auditResult.speedTime})
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {auditResult.seoScore}/100
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, marginTop: 4 }}>
                        Organic SEO Visibility
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FF7A00', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {auditResult.croScore}/100
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, marginTop: 4 }}>
                        Conversion &amp; CRO Funnel
                      </div>
                    </div>
                  </div>

                  {/* High-Impact Deliverables */}
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px', marginBottom: 20 }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase' }}>
                      3 Key Growth Recommendations:
                    </span>
                    <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '0.84rem', color: '#1E3A8A', lineHeight: 1.5 }}>
                      {auditResult.findings.map((f, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowAuditModal(false)}
                      className="btn btn-ghost"
                      style={{ border: '1px solid #CBD5E1', padding: '10px 16px', borderRadius: '8px', fontSize: '0.86rem' }}
                    >
                      Close
                    </button>
                    <Link
                      to="/contact"
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.86rem' }}
                      onClick={() => setShowAuditModal(false)}
                    >
                      Book 45-Min Roadmap Call &rarr;
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* 2. SERVICES OVERVIEW (Techpyro Service Card Grid with Dedicated Links) */}
      <section style={{ padding: '72px 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Core Capabilities
            </span>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', fontWeight: 800, marginTop: 8, letterSpacing: '-0.025em' }}>
              Engineered for High-Growth Brands
            </h2>
            <p style={{ marginTop: 12, fontSize: '1.02rem', color: '#64748B', lineHeight: 1.6 }}>
              Clean, focused service disciplines built to deliver measurable commercial returns. No buzzwords, no junior outsourcing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {coreServices.map((s) => (
              <div
                key={s.title}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(15, 23, 42, 0.08)';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  {/* Card Reference Picture Preview */}
                  <div style={{ height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: 16, position: 'relative' }}>
                    <img
                      src={s.image}
                      alt={s.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, transparent 60%)',
                      }}
                    />
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255, 255, 255, 0.92)', padding: '4px 8px', borderRadius: 8, fontSize: '1.1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      {s.icon}
                    </div>
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span style={{ fontSize: '0.72rem', background: '#2563EB', color: '#FFFFFF', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                        {s.badge}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                    {s.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55, marginBottom: 16 }}>
                    {s.desc}
                  </p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                    {s.tags.map((t) => (
                      <span key={t} style={{ fontSize: '0.72rem', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '6px', color: '#64748B', fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={s.slug}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: 'var(--accent)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    paddingTop: 12,
                    borderTop: '1px solid #E2E8F0',
                  }}
                >
                  <span>Learn more about {s.title}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/services" style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent)' }}>
              Explore Interactive Services Matrix &amp; ROI Calculator &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 3. PROCESS / HOW IT WORKS (ChatSEO Alternating Visual Style) */}
      <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Execution Protocol
            </span>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', fontWeight: 800, marginTop: 8 }}>
              How We Deliver Predictable Results
            </h2>
            <p style={{ marginTop: 10, fontSize: '1.02rem', color: '#64748B' }}>
              Transparent milestones, weekly staging previews, and zero surprise costs.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={step.step}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    alignItems: 'center',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    padding: '36px',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  {/* Text Column */}
                  <div style={{ order: isEven ? 2 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Space Grotesk, monospace' }}>
                        {step.step}
                      </span>
                      <span style={{ fontSize: '0.76rem', background: '#FFF7ED', color: '#EA580C', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                        {step.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
                      {step.title}
                    </h3>

                    <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
                      {step.body}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {step.bullets.map((b) => (
                        <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: '#334155' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Proof / Card Column */}
                  <div style={{ order: isEven ? 1 : 2 }}>
                    <div
                      style={{
                        background: '#0F172A',
                        borderRadius: '16px',
                        padding: '32px 28px',
                        color: '#FFFFFF',
                        border: '1px solid #1E293B',
                        boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.15)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(15,23,42,0) 70%)' }} />
                      <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', fontWeight: 700 }}>
                        {step.visual.title}
                      </span>
                      <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38BDF8', marginTop: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                        {step.visual.stat}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#CBD5E1', marginTop: 6 }}>
                        {step.visual.detail}
                      </div>
                      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#10B981' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                        <span>Verified Deliverable Standard</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. REAL RESULTS & CASE STUDIES (Clean & Compact with Side Navigation) */}
      <section style={{ padding: '44px 0 36px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', position: 'relative' }}>
        <div className="container">
          {/* Main Heading Only */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 2.8vw, 2.3rem)', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Real Results. Measurable Commercial Value.
            </h2>
            <Link to="/work" className="btn btn-ghost" style={{ border: '1px solid #CBD5E1', padding: '8px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem' }}>
              View All Case Studies &rarr;
            </Link>
          </div>

          {/* Carousel Track with Floating Left & Right Buttons */}
          <div style={{ position: 'relative', width: '100%' }}>
            {/* Left Button */}
            <button
              type="button"
              onClick={handlePrevCase}
              aria-label="Previous Case Study"
              className="carousel-side-btn carousel-side-prev"
              style={{
                position: 'absolute',
                left: '-14px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.2)';
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.color = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.12)';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.color = '#0F172A';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Right Button */}
            <button
              type="button"
              onClick={handleNextCase}
              aria-label="Next Case Study"
              className="carousel-side-btn carousel-side-next"
              style={{
                position: 'absolute',
                right: '-14px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.2)';
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.color = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.12)';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.color = '#0F172A';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

          {/* Interactive Carousel Track */}
          <div
            ref={carouselRef}
            className="no-scrollbar"
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory',
              padding: '12px 4px 28px',
              cursor: isMouseDownRef.current ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
          >
            {filteredCaseStudies.map((cs, idx) => {
              const isActive = activeCaseIndex === idx;
              const currentMode = cardViewModes[cs.client] || 'impact';

              return (
                <div
                  key={cs.id}
                  className={`case-study-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveCaseIndex(idx)}
                  style={{
                    flex: '0 0 360px',
                    maxWidth: '380px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: isActive ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isActive
                      ? '0 16px 36px -6px rgba(37, 99, 235, 0.16)'
                      : '0 2px 10px rgba(15, 23, 42, 0.04)',
                    transform: isActive ? 'scale(1.01)' : 'scale(1)',
                    position: 'relative',
                  }}
                >
                  <div>
                    {/* Image Header with Tags */}
                    <div style={{ height: '150px', borderRadius: '10px', overflow: 'hidden', marginBottom: 14, position: 'relative' }}>
                      <img
                        src={cs.image}
                        alt={cs.client}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                          transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        {cs.industry}
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: isActive ? '#2563EB' : '#EFF6FF',
                          color: isActive ? '#FFFFFF' : '#1D4ED8',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        {cs.timeframe}
                      </div>
                    </div>

                    {/* Client Title & Category Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {cs.client}
                      </h3>
                      <span style={{ fontSize: '0.68rem', background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                        {cs.category}
                      </span>
                    </div>

                    {/* Interactive Tab Switcher on Card */}
                    <div
                      style={{
                        display: 'flex',
                        background: '#F1F5F9',
                        borderRadius: '8px',
                        padding: '3px',
                        marginBottom: 14,
                        gap: 4,
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCardView(cs.client, 'impact');
                        }}
                        style={{
                          flex: 1,
                          padding: '4px 0',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          background: currentMode === 'impact' ? '#FFFFFF' : 'transparent',
                          color: currentMode === 'impact' ? '#2563EB' : '#64748B',
                          boxShadow: currentMode === 'impact' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        ⚡ Results & ROI
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCardView(cs.client, 'tech');
                        }}
                        style={{
                          flex: 1,
                          padding: '4px 0',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          background: currentMode === 'tech' ? '#FFFFFF' : 'transparent',
                          color: currentMode === 'tech' ? '#2563EB' : '#64748B',
                          boxShadow: currentMode === 'tech' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        ⚙️ Architecture
                      </button>
                    </div>

                    {/* Mode 1: Results & ROI View */}
                    {currentMode === 'impact' ? (
                      <div>
                        <div
                          style={{
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            marginBottom: 12,
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 10,
                          }}
                        >
                          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {cs.metric}
                          </div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                            {cs.metricLabel}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: 14, minHeight: '50px' }}>
                          {cs.solution}
                        </p>
                      </div>
                    ) : (
                      /* Mode 2: Tech & Architecture View */
                      <div>
                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', marginBottom: 12 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                            The Challenge Solved:
                          </span>
                          <p style={{ fontSize: '0.82rem', color: '#334155', marginTop: 4, lineHeight: 1.45, minHeight: '52px' }}>
                            {cs.problem}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Area: Tech Stack & Actions */}
                  <div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      {cs.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.7rem',
                            background: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            color: '#475569',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontWeight: 600,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewCase(cs);
                        }}
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          padding: '8px 0',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        🔍 Quick Inspect
                      </button>
                      <Link
                        to="/work"
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          background: isActive ? '#2563EB' : '#FFFFFF',
                          border: isActive ? '1px solid #2563EB' : '1px solid #CBD5E1',
                          borderRadius: '8px',
                          padding: '8px 0',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: isActive ? '#FFFFFF' : 'var(--accent)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Full Study &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>

          {/* Interactive Modal: Quick Inspect Breakdown */}
          {quickViewCase && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
              onClick={() => setQuickViewCase(null)}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  maxWidth: '640px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '28px',
                  boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                  position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {quickViewCase.industry}
                    </span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                      {quickViewCase.client}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuickViewCase(null)}
                    style={{
                      background: '#F1F5F9',
                      border: 'none',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    &#10005;
                  </button>
                </div>

                {/* Modal Image Cover */}
                <div style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: 20 }}>
                  <img src={quickViewCase.image} alt={quickViewCase.client} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Verified Commercial Impact Box */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                    border: '1px solid #BFDBFE',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1E40AF', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {quickViewCase.metric}
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E3A8A' }}>
                      {quickViewCase.metricLabel}
                    </div>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '6px 14px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, color: '#2563EB', border: '1px solid #93C5FD' }}>
                    {quickViewCase.timeframe}
                  </div>
                </div>

                {/* Problem vs Solution Specs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 20 }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Initial Challenge
                    </span>
                    <p style={{ fontSize: '0.88rem', color: '#334155', marginTop: 4, lineHeight: 1.5 }}>
                      {quickViewCase.problem}
                    </p>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Engineered Solution
                    </span>
                    <p style={{ fontSize: '0.88rem', color: '#334155', marginTop: 4, lineHeight: 1.5 }}>
                      {quickViewCase.solution}
                    </p>
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 8 }}>
                    Production Tech Stack & Architecture:
                  </span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {quickViewCase.tags.map((tag) => (
                      <span key={tag} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal CTA Buttons */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setQuickViewCase(null)}
                    className="btn btn-ghost"
                    style={{ border: '1px solid #CBD5E1', padding: '10px 18px', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    Close Preview
                  </button>
                  <Link
                    to="/work"
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem' }}
                    onClick={() => setQuickViewCase(null)}
                  >
                    Open Master-Detail Case Study &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. TESTIMONIALS (ChatSEO Wall of Love Masonry Grid) */}
      <section style={{ padding: '84px 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Wall of Love &amp; Verified Reviews
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.4vw, 2.7rem)', fontWeight: 800, marginTop: 8, letterSpacing: '-0.025em' }}>
              Loved by Founders, CEOs, and Developers
            </h2>
            <p style={{ marginTop: 10, fontSize: '1.05rem', color: '#64748B' }}>
              Unfiltered feedback from clients who scaled their software platforms and organic search pipeline with BrandedCoders.
            </p>
          </div>

          <div className="reviews-masonry-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="review-card-item">
                {/* Header: Avatar, Name, Role & LinkedIn */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: t.monogramBg || '#F1F5F9',
                          color: t.monogramColor || '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                        }}
                      >
                        {t.monogram}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A' }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                        {t.role}
                      </div>
                    </div>
                  </div>

                  {t.linkedin && (
                    <div
                      title="Verified LinkedIn Client"
                      style={{
                        background: '#0A66C2',
                        color: '#FFFFFF',
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      in
                    </div>
                  )}
                </div>

                {/* Star Rating */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <span key={i} style={{ color: '#F59E0B', fontSize: '1.02rem' }}>★</span>
                  ))}
                </div>

                {/* Review Text with Bold Highlight */}
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                  {t.leadText}{' '}
                  {t.highlightText && (
                    <strong style={{ color: '#0F172A', fontWeight: 800 }}>
                      {t.highlightText}
                    </strong>
                  )}{' '}
                  {t.tailText}
                </p>

                {/* Proof Snippet 1: Search Console Graph */}
                {t.proofType === 'search-console' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', marginTop: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, textAlign: 'center', marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: '0.64rem', color: '#64748B' }}>Clicks</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563EB' }}>{t.proofData.clicks}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.64rem', color: '#64748B' }}>Impressions</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>{t.proofData.impressions}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.64rem', color: '#64748B' }}>CTR</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669' }}>{t.proofData.ctr}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.64rem', color: '#64748B' }}>Avg Position</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FF7A00' }}>{t.proofData.position}</div>
                      </div>
                    </div>
                    <svg viewBox="0 0 200 28" style={{ width: '100%', height: '24px', display: 'block' }}>
                      <path d="M0,24 Q30,22 60,16 T120,10 T160,6 T200,3" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                      <path d="M0,24 Q30,22 60,16 T120,10 T160,6 T200,3 L200,28 L0,28 Z" fill="rgba(37,99,235,0.08)" />
                    </svg>
                  </div>
                )}

                {/* Proof Snippet 2: Insights Box */}
                {t.proofType === 'insights-box' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>
                      <span>Insights</span>
                      <span style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', color: '#0F172A' }}>
                        {t.proofData.timeframe} ▾
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 10px', borderRadius: 6 }}>
                        <div style={{ fontSize: '0.66rem', color: '#64748B' }}>Clicks ⓘ</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{t.proofData.clicks}</div>
                        <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>↑ {t.proofData.clicksChange}</div>
                        <svg viewBox="0 0 60 12" style={{ width: '100%', height: '10px', marginTop: 4 }}>
                          <path d="M0,10 Q20,8 40,3 L60,1" fill="none" stroke="#2563EB" strokeWidth="2" />
                        </svg>
                      </div>
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 10px', borderRadius: 6 }}>
                        <div style={{ fontSize: '0.66rem', color: '#64748B' }}>Impressions ⓘ</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{t.proofData.impressions}</div>
                        <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>↑ {t.proofData.impressionsChange}</div>
                        <svg viewBox="0 0 60 12" style={{ width: '100%', height: '10px', marginTop: 4 }}>
                          <path d="M0,10 Q20,6 40,3 L60,1" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Proof Snippet 3: Traffic Sparkline */}
                {t.proofType === 'traffic-sparkline' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                      <span>{t.proofData.stat1}</span>
                      <span>{t.proofData.stat2}</span>
                      <span>{t.proofData.stat3}</span>
                      <span>{t.proofData.stat4}</span>
                    </div>
                    <svg viewBox="0 0 200 24" style={{ width: '100%', height: '18px', display: 'block' }}>
                      <path d="M0,20 Q50,18 100,10 T150,5 T200,2" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
                    </svg>
                  </div>
                )}

                {/* Footer Date */}
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: 14 }}>
                  {t.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOUNDER & LEADERSHIP SECTION (Dynamic from Team CMS) */}
      <section style={{ padding: '80px 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {siteContent?.home?.teamEyebrow || 'Leadership & Accountability'}
            </span>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', fontWeight: 800, marginTop: 8 }}>
              {siteContent?.home?.teamHeading || 'Direct Access to the Engineers Building Your Product'}
            </h2>
            <p style={{ marginTop: 10, fontSize: '1.02rem', color: '#64748B' }}>
              {siteContent?.home?.teamSubheading || 'No non-technical middle managers. You work directly with senior founders and hands-on architects.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {(teamMembers || []).map((f) => (
              <div
                key={f.id || f.name}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 18 }}>
                  <img
                    src={f.image}
                    alt={f.name}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{f.name}</h3>
                    <span style={{ fontSize: '0.84rem', color: 'var(--accent)', fontWeight: 700 }}>{f.role}</span>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 2 }}>📍 {f.location || 'Ludhiana, Punjab'}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
                  {f.bio}
                </p>

                <div style={{ marginTop: 'auto', width: '100%', paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Specialized Focus:
                  </span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {(Array.isArray(f.expertise) ? f.expertise : []).map((exp) => (
                      <span key={exp} style={{ fontSize: '0.74rem', background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '3px 8px', borderRadius: 6, fontWeight: 600, color: '#334155' }}>
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SUPPORT & MAINTENANCE PLANS (Techpyro AMC Section - Dynamic from Plans CMS) */}
      <section style={{ padding: '80px 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
   
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', fontWeight: 800, marginTop: 8 }}>
              {siteContent?.home?.plansHeading || 'Website & App Maintenance Plans (AMC)'}
            </h2>
            <p style={{ marginTop: 10, fontSize: '1.02rem', color: '#64748B' }}>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
            {(supportPlans || []).map((plan) => (
              <div
                key={plan.id || plan.name}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: plan.featured ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: plan.featured ? '0 12px 32px -4px rgba(37, 99, 235, 0.15)' : '0 4px 14px rgba(15, 23, 42, 0.03)',
                  position: 'relative',
                }}
              >
                {plan.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      right: 24,
                      background: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: 999,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {plan.badge || 'Most Popular'}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>{plan.name}</h3>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: 4, marginBottom: 20 }}>{plan.tagline}</p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>{plan.period}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {(Array.isArray(plan.features) ? plan.features : []).map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.86rem', color: '#334155' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" style={{ marginTop: 2, flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/plans?plan=${encodeURIComponent(plan.name)}`}
                  className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    border: plan.featured ? 'none' : '1px solid #CBD5E1',
                  }}
                >
                  {plan.cta || 'Choose Plan'}
                </Link>
              </div>
            ))}
          </div>

          {/* Direct link to Full Comparison */}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link
              to="/plans"
              className="btn btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '12px 24px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.92rem',
                color: '#0F172A',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              }}
            >
              <span>Explore Dedicated Plans Page &amp; Detailed SLA Matrix</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION (Clean Accordion) */}
      <section style={{ padding: '80px 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Frequently Asked Questions
            </span>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', fontWeight: 800, marginTop: 8 }}>
              Everything You Need to Know
            </h2>
            <p style={{ marginTop: 10, fontSize: '1rem', color: '#64748B' }}>
              Clear answers to our pricing, timelines, technology, and support process.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqItems.map((item, idx) => {
              const isOpen = openFaqId === idx;
              return (
                <div
                  key={item.q}
                  style={{
                    background: isOpen ? '#F8FAFC' : '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '1.02rem',
                      fontWeight: 700,
                      color: '#0F172A',
                    }}
                  >
                    <span>{item.q}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                        marginLeft: 12,
                        color: 'var(--accent)',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', color: '#475569', fontSize: '0.94rem', lineHeight: 1.65 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL-TO-ACTION BANNER */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Ready for Commercial Impact?
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, marginTop: 12, color: '#FFFFFF', letterSpacing: '-0.025em' }}>
            Ready to build something that grows your business?
          </h2>
          <p style={{ marginTop: 16, fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Book a free 1-hour scoping consultation with our lead engineers. We will analyze your requirements, identify opportunities, and present a clear proposal.
          </p>

          <div style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
              className="btn btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: '#2563EB',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              }}
            >
              Get a Free Consultation &rarr;
            </Link>

            <a
              href="https://wa.me/919876543210?text=Hi%20BrandedCoders!%20I%20want%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                color: '#22C55E',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              💬 WhatsApp Us Directly
            </a>
          </div>

          <div style={{ marginTop: 24, fontSize: '0.84rem', color: '#64748B' }}>
            No sales pitches. Guaranteed response in under 4 business hours.
          </div>
        </div>
      </section>
    </div>
  );
}
