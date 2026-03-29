import { PrismaClient, Role, ArticleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BCN Database...');

  // ─── CATEGORIES ────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'bengal' },
      update: {},
      create: {
        name: 'Bengal',
        slug: 'bengal',
        description: 'News from West Bengal',
        color: '#C8102E',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'india' },
      update: {},
      create: {
        name: 'India',
        slug: 'india',
        description: 'National news',
        color: '#FF9933',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'world' },
      update: {},
      create: {
        name: 'World',
        slug: 'world',
        description: 'International news',
        color: '#0077CC',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'politics' },
      update: {},
      create: {
        name: 'Politics',
        slug: 'politics',
        description: 'Political news and analysis',
        color: '#7B2D8B',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Business & Economy',
        color: '#2E7D32',
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports news',
        color: '#E65100',
        sortOrder: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech news & reviews',
        color: '#1565C0',
        sortOrder: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'entertainment' },
      update: {},
      create: {
        name: 'Entertainment',
        slug: 'entertainment',
        description: 'Bollywood, Tollywood & more',
        color: '#AD1457',
        sortOrder: 8,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ─── TAGS ──────────────────────────────────────────────────────
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'breaking-news' },
      update: {},
      create: { name: 'Breaking News', slug: 'breaking-news' },
    }),
    prisma.tag.upsert({
      where: { slug: 'kolkata' },
      update: {},
      create: { name: 'Kolkata', slug: 'kolkata' },
    }),
    prisma.tag.upsert({
      where: { slug: 'west-bengal' },
      update: {},
      create: { name: 'West Bengal', slug: 'west-bengal' },
    }),
    prisma.tag.upsert({
      where: { slug: 'elections' },
      update: {},
      create: { name: 'Elections', slug: 'elections' },
    }),
    prisma.tag.upsert({
      where: { slug: 'economy' },
      update: {},
      create: { name: 'Economy', slug: 'economy' },
    }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // ─── ADMIN USER ────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@BCN2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bengalchronicle.com' },
    update: {},
    create: {
      email: 'admin@bengalchronicle.com',
      name: 'BCN Admin',
      username: 'bcn-admin',
      password: adminPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      isActive: true,
    },
  });

  // ─── JOURNALIST USER ───────────────────────────────────────────
  const journalistPassword = await bcrypt.hash('Journalist@BCN2024!', 12);
  const journalist = await prisma.user.upsert({
    where: { email: 'reporter@bengalchronicle.com' },
    update: {},
    create: {
      email: 'reporter@bengalchronicle.com',
      name: 'Rahul Banerjee',
      username: 'rahul-banerjee',
      password: journalistPassword,
      role: Role.JOURNALIST,
      bio: 'Senior Correspondent at BCN covering Bengal politics and culture.',
      isVerified: true,
      isActive: true,
      authorProfile: {
        create: {
          title: 'Senior Political Correspondent',
          expertise: ['Politics', 'Bengal', 'Culture'],
          twitter: '@rahulbcn',
        },
      },
    },
  });

  console.log('✅ Created admin and journalist users');

  // ─── SAMPLE ARTICLES ───────────────────────────────────────────
  await prisma.article.upsert({
    where: { slug: 'bcn-launches-bengal-chronicle-network-digital-platform' },
    update: {},
    create: {
      title: 'BCN Launches The Bengal Chronicle Network: A New Era of Digital Journalism in Bengal',
      slug: 'bcn-launches-bengal-chronicle-network-digital-platform',
      excerpt: 'BCN – The Bengal Chronicle Network officially launches its state-of-the-art digital news platform, bringing world-class journalism to millions of readers across Bengal and beyond.',
      content: `
        <p>The Bengal Chronicle Network (BCN) has officially launched its comprehensive digital news platform today, marking a significant milestone in the evolution of Bengal journalism.</p>

        <h2>A Platform Built for the Digital Age</h2>
        <p>BCN's new platform leverages cutting-edge technology to deliver news faster than ever before. With a team of over 50 journalists spread across West Bengal, the platform promises round-the-clock coverage.</p>

        <h2>Key Features</h2>
        <ul>
          <li>Real-time breaking news alerts</li>
          <li>Personalized news feed</li>
          <li>Multilingual content in English and Bengali</li>
          <li>Interactive multimedia storytelling</li>
        </ul>

        <h2>Commitment to Quality Journalism</h2>
        <p>BCN has pledged to uphold the highest standards of journalistic integrity. Every article undergoes rigorous fact-checking before publication.</p>
      `,
      authorId: journalist.id,
      categoryId: categories[0].id,
      status: ArticleStatus.PUBLISHED,
      isBreaking: false,
      isFeatured: true,
      publishedAt: new Date(),
      readingTime: 4,
      seoTitle: 'BCN Launches Bengal Chronicle Network Digital Platform | BCN',
      seoDescription: 'BCN – The Bengal Chronicle Network launches its digital news platform, delivering real-time news and in-depth analysis from Bengal, India, and the world.',
      seoKeywords: ['BCN', 'Bengal Chronicle Network', 'Bengal news', 'digital journalism'],
      viewCount: BigInt(1250),
      likeCount: 89,
    },
  });

  await prisma.article.upsert({
    where: { slug: 'kolkata-metro-east-west-corridor-2025' },
    update: {},
    create: {
      title: 'Kolkata Metro East-West Corridor to Connect Salt Lake with Howrah by 2025',
      slug: 'kolkata-metro-east-west-corridor-2025',
      excerpt: 'The long-awaited East-West Metro corridor in Kolkata is set to become fully operational by early 2025, promising to transform daily commutes for over 3 lakh passengers.',
      content: `
        <p>Kolkata's ambitious East-West Metro corridor project is entering its final phase, with officials confirming that the full stretch from Salt Lake Sector V to Howrah Maidan will be operational by March 2025.</p>

        <h2>The Final Stretch</h2>
        <p>The underwater tunnel section beneath the Hooghly River — a first for India — has been completed successfully, overcoming major engineering challenges.</p>

        <h2>Impact on Commuters</h2>
        <p>Once fully operational, the journey from Salt Lake to Howrah will be reduced to just 18 minutes via the metro.</p>

        <h2>Environmental Benefits</h2>
        <p>The expansion is expected to take thousands of private vehicles off Kolkata's congested roads, significantly reducing carbon emissions.</p>
      `,
      authorId: journalist.id,
      categoryId: categories[0].id,
      status: ArticleStatus.PUBLISHED,
      isBreaking: true,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      readingTime: 5,
      seoTitle: 'Kolkata Metro East-West Corridor 2025 Update | BCN',
      seoDescription: 'Kolkata Metro East-West corridor connecting Salt Lake to Howrah set for completion by early 2025.',
      seoKeywords: ['Kolkata Metro', 'East-West corridor', 'Howrah', 'Salt Lake', 'BCN'],
      viewCount: BigInt(3840),
      likeCount: 234,
    },
  });

  console.log('✅ Created sample articles');

  // ─── BREAKING TICKER ───────────────────────────────────────────
  await prisma.breakingNewsTicker.createMany({
    data: [
      {
        text: 'BCN EXCLUSIVE: Kolkata Metro East-West corridor fully operational by March 2025',
        url: '/news/kolkata-metro-east-west-corridor-2025',
        isActive: true,
        priority: 1,
      },
      {
        text: 'Bengal government announces new IT policy to attract ₹10,000 crore investment',
        isActive: true,
        priority: 2,
      },
      {
        text: 'India GDP growth forecast revised upward to 7.2% for FY2025 — BCN Report',
        isActive: true,
        priority: 3,
      },
      {
        text: 'Durga Puja 2024: UNESCO recognition boosts Bengal tourism by 40%',
        isActive: true,
        priority: 4,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created breaking news tickers');

  // ─── SITE SETTINGS ─────────────────────────────────────────────
  await prisma.siteSettings.createMany({
    data: [
      { key: 'site_name', value: 'BCN – The Bengal Chronicle Network', description: 'Site name' },
      { key: 'site_tagline', value: 'Truth. Speed. Bengal.', description: 'Site tagline' },
      { key: 'articles_per_page', value: '20', description: 'Articles per page' },
      { key: 'comment_moderation', value: 'true', description: 'Enable comment moderation' },
      { key: 'newsletter_enabled', value: 'true', description: 'Newsletter signup enabled' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created site settings');

  console.log('\n🎉 BCN Database seeded successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin:      admin@bengalchronicle.com / Admin@BCN2024!');
  console.log('   Journalist: reporter@bengalchronicle.com / Journalist@BCN2024!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());