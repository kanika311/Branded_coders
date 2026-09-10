import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../server/models/Admin.js';
import Service from '../server/models/Service.js';
import Portfolio from '../server/models/Portfolio.js';

const services = [
  { title: 'Website Design & Development', slug: 'websites', order: 1, icon: 'globe',
    summary: 'Fast, accessible marketing sites and web apps built on the MERN stack.',
    description: 'From landing pages to multi-tenant platforms — React front ends, Node/Express APIs, and MongoDB behind them, shipped on a CI pipeline you control.' },
  { title: 'Custom CMS', slug: 'cms', order: 2, icon: 'layers',
    summary: 'Editable content models so your team ships copy changes without a deploy.',
    description: 'Role-based publishing, drafts, media libraries, and structured content types tailored to how your team actually works.' },
  { title: 'Dashboards & Internal Tools', slug: 'dashboards', order: 3, icon: 'grid',
    summary: 'Operational dashboards that turn raw data into decisions.',
    description: 'Real-time charts, permissioned views, and exports built with React and your existing data sources.' },
  { title: 'Web & Mobile Apps', slug: 'apps', order: 4, icon: 'smartphone',
    summary: 'Cross-platform product builds from prototype to app-store release.',
    description: 'React Native and responsive web clients sharing one API, one design system, one codebase where it makes sense.' },
  { title: 'AI-Integrated Platforms', slug: 'ai-platforms', order: 5, icon: 'cpu',
    summary: 'LLM features wired into your product — not bolted on.',
    description: 'Retrieval pipelines, agent workflows, and model-backed features integrated directly into your existing stack.' },
  { title: 'Wireframes & Product Design', slug: 'wireframes', order: 6, icon: 'figma',
    summary: 'Low to high-fidelity wireframes that de-risk the build before code starts.',
    description: 'Information architecture, flows, and interactive prototypes your engineers and stakeholders can align around early.' },
  { title: 'Digital Marketing', slug: 'marketing', order: 7, icon: 'trending-up',
    summary: 'SEO, paid acquisition, and content that gets your product found.',
    description: 'Technical SEO audits, campaign management, and analytics instrumentation tied to the sites and apps we build.' },
];

const portfolio = [
  { title: 'Northline Freight Portal', client: 'Northline Logistics', category: 'Dashboard', order: 1,
    summary: 'Live shipment tracking dashboard replacing three spreadsheets and a shared inbox.', tags: ['React', 'Node', 'MongoDB'] },
  { title: 'Verdant Grocer', client: 'Verdant Market Co.', category: 'Web App', order: 2,
    summary: 'Local-delivery storefront with route-optimized checkout and vendor CMS.', tags: ['MERN', 'Stripe', 'CMS'] },
  { title: 'Pulse Health Companion', client: 'Pulse Clinics', category: 'Mobile App', order: 3,
    summary: 'Patient-facing React Native app for appointment booking and care plans.', tags: ['React Native', 'AI'] },
  { title: 'Almanac AI Research Assistant', client: 'Almanac Labs', category: 'AI Platform', order: 4,
    summary: 'Retrieval-augmented research tool embedded into an existing knowledge base.', tags: ['LLM', 'RAG', 'Node'] },
];

async function run() {
  const args = process.argv.slice(2);
  const isOnlyAdmin = args.includes('--only-admin');
  const isReset = args.includes('--reset') || args.includes('--force');

  // Positional or flagged arguments: node scripts/seed.js [email] [password]
  const positionalArgs = args.filter((a) => !a.startsWith('--'));
  const customEmail = positionalArgs[0] || args.find((a) => a.startsWith('--email='))?.split('=')[1];
  const customPassword = positionalArgs[1] || args.find((a) => a.startsWith('--password='))?.split('=')[1];

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('\n⚠️  MONGODB_URI is not defined in your environment or .env file.');
    console.error('To seed MongoDB:');
    console.error('  1. Create a .env file (or copy from .env.example)');
    console.error('  2. Set: MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/brandedcoders');
    console.error('  3. Run: npm run seed\n');
    console.error('Default Frontend Admin Credentials (in LocalStorage mock store):');
    console.error('  Email:    admin@brandedcoders.com');
    console.error('  Password: admin123\n');
    process.exit(1);
  }

  console.log('Connecting to MongoDB database…');
  await mongoose.connect(uri);

  const email = (customEmail || process.env.ADMIN_EMAIL || 'admin@brandedcoders.com').trim().toLowerCase();
  const password = customPassword || process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await Admin.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash, name: 'BrandedCoders Admin' });
    console.log(`\n✅ Created new administrator account:`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}\n`);
  } else {
    if (isReset || customPassword) {
      existing.passwordHash = await bcrypt.hash(password, 10);
      await existing.save();
      console.log(`\n✅ Successfully updated credentials for existing administrator:`);
      console.log(`   Email:    ${email}`);
      console.log(`   Password: ${password}\n`);
    } else {
      console.log(`\nℹ️  Administrator (${email}) already exists.`);
      console.log(`   To reset/update password, run: npm run seed:reset or node scripts/seed.js ${email} <new_password> --reset\n`);
    }
  }

  if (isOnlyAdmin) {
    await mongoose.disconnect();
    console.log('Admin seeding complete.');
    return;
  }

  for (const s of services) {
    await Service.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
  }
  console.log(`Seeded ${services.length} services.`);

  const portfolioCount = await Portfolio.countDocuments();
  if (portfolioCount === 0) {
    await Portfolio.insertMany(portfolio);
    console.log(`Seeded ${portfolio.length} portfolio items.`);
  } else {
    console.log('Portfolio already has items, skipping.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
