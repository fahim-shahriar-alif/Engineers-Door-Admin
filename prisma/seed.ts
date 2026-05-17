import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@engineersdoor.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@engineersdoor.com",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Sample blog posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: "building-scalable-microservices-with-nodejs" },
      update: {},
      create: {
        title: "Building Scalable Microservices with Node.js",
        slug: "building-scalable-microservices-with-nodejs",
        excerpt: "Learn how to architect and deploy production-ready microservices using Node.js, Docker, and Kubernetes.",
        body: `# Building Scalable Microservices with Node.js\n\nMicroservices architecture has become the go-to approach for building large-scale applications...\n\n## Why Microservices?\n\nMicroservices offer several advantages over monolithic architectures:\n\n- **Independent deployment** — each service can be deployed separately\n- **Technology flexibility** — use the right tool for each job\n- **Fault isolation** — failures don't cascade across the system\n\n## Getting Started\n\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\n\napp.listen(3000);\n\`\`\`\n\n## Conclusion\n\nMicroservices are powerful but come with operational complexity. Start simple and evolve.`,
        category: "Engineering",
        author: "Engineers Door Team",
        readTime: "8 min read",
        icon: "⚙️",
        gradient: "from-cyan-500 to-blue-600",
        published: true,
      },
    }),
    prisma.post.upsert({
      where: { slug: "cloud-cost-optimization-strategies-2025" },
      update: {},
      create: {
        title: "Cloud Cost Optimization Strategies for 2025",
        slug: "cloud-cost-optimization-strategies-2025",
        excerpt: "Practical strategies to reduce your AWS, GCP, or Azure bill without sacrificing performance.",
        body: `# Cloud Cost Optimization Strategies for 2025\n\nCloud costs can spiral out of control quickly. Here are proven strategies to keep them in check.\n\n## Right-sizing Resources\n\nAnalyze your actual usage and downsize over-provisioned instances.\n\n## Reserved Instances\n\nCommit to 1-3 year terms for predictable workloads and save up to 72%.\n\n## Spot Instances\n\nUse spot/preemptible instances for fault-tolerant batch workloads.`,
        category: "Cloud",
        author: "Cloud Team",
        readTime: "6 min read",
        icon: "☁️",
        gradient: "from-indigo-500 to-purple-600",
        published: true,
      },
    }),
    prisma.post.upsert({
      where: { slug: "zero-trust-security-model-explained" },
      update: {},
      create: {
        title: "Zero Trust Security Model Explained",
        slug: "zero-trust-security-model-explained",
        excerpt: "Understanding the Zero Trust security model and how to implement it in your organization.",
        body: `# Zero Trust Security Model\n\n"Never trust, always verify" — this is the core principle of Zero Trust.\n\n## Key Principles\n\n1. Verify every user and device\n2. Least privilege access\n3. Assume breach mentality\n\n## Implementation Steps\n\nStart with identity verification, then move to network segmentation.`,
        category: "Security",
        author: "Security Team",
        readTime: "10 min read",
        icon: "🔐",
        gradient: "from-orange-500 to-red-500",
        published: false,
      },
    }),
  ]);
  console.log(`✅ Created ${posts.length} blog posts`);

  // Sample jobs
  const jobs = await Promise.all([
    prisma.job.upsert({
      where: { id: "job-1" },
      update: {},
      create: {
        id: "job-1",
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        type: "Full-time",
        location: "Remote",
        techTags: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        active: true,
      },
    }),
    prisma.job.upsert({
      where: { id: "job-2" },
      update: {},
      create: {
        id: "job-2",
        title: "DevOps Engineer",
        department: "DevOps",
        type: "Full-time",
        location: "Hybrid",
        techTags: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"],
        active: true,
      },
    }),
    prisma.job.upsert({
      where: { id: "job-3" },
      update: {},
      create: {
        id: "job-3",
        title: "Cloud Solutions Architect",
        department: "Cloud",
        type: "Contract",
        location: "Remote",
        techTags: ["AWS", "GCP", "Azure", "Terraform", "Architecture"],
        active: false,
      },
    }),
  ]);
  console.log(`✅ Created ${jobs.length} job listings`);

  // Sample projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: "proj-1" },
      update: {},
      create: {
        id: "proj-1",
        title: "FinTech Payment Platform",
        category: "Web Application",
        description: "Built a high-throughput payment processing platform handling 50,000+ transactions per day with 99.99% uptime SLA.",
        result: "99.99% uptime, 50K+ daily transactions",
        techTags: ["Node.js", "React", "PostgreSQL", "Redis", "AWS", "Stripe"],
        icon: "💳",
        gradient: "from-green-500 to-teal-500",
      },
    }),
    prisma.project.upsert({
      where: { id: "proj-2" },
      update: {},
      create: {
        id: "proj-2",
        title: "E-commerce Platform Migration",
        category: "Cloud Infrastructure",
        description: "Migrated a legacy monolithic e-commerce platform to microservices on AWS, reducing infrastructure costs by 40%.",
        result: "40% cost reduction, 3x faster deployments",
        techTags: ["AWS", "Docker", "Kubernetes", "Next.js", "MongoDB"],
        icon: "🛒",
        gradient: "from-purple-500 to-cyan-500",
      },
    }),
    prisma.project.upsert({
      where: { id: "proj-3" },
      update: {},
      create: {
        id: "proj-3",
        title: "AI-Powered Analytics Dashboard",
        category: "AI/ML",
        description: "Developed a real-time analytics dashboard with ML-powered insights for a SaaS company serving 10,000+ users.",
        result: "10K+ users, 60% faster insights",
        techTags: ["Python", "TensorFlow", "React", "FastAPI", "GCP"],
        icon: "🤖",
        gradient: "from-cyan-500 to-blue-600",
      },
    }),
  ]);
  console.log(`✅ Created ${projects.length} portfolio projects`);

  // Sample contact submissions
  const contacts = await Promise.all([
    prisma.contactSubmission.upsert({
      where: { id: "contact-1" },
      update: {},
      create: {
        id: "contact-1",
        name: "Sarah Johnson",
        email: "sarah@techcorp.com",
        subject: "Partnership Inquiry",
        message: "Hi, I'm interested in exploring a potential partnership between our companies. We're looking for a reliable IT partner for our digital transformation initiative. Could we schedule a call to discuss?",
        read: false,
      },
    }),
    prisma.contactSubmission.upsert({
      where: { id: "contact-2" },
      update: {},
      create: {
        id: "contact-2",
        name: "Michael Chen",
        email: "m.chen@startup.io",
        subject: "Custom Software Development",
        message: "We need a custom CRM system built from scratch. Our team is 50 people and we have specific workflow requirements. What's your typical timeline and pricing for such a project?",
        read: true,
      },
    }),
    prisma.contactSubmission.upsert({
      where: { id: "contact-3" },
      update: {},
      create: {
        id: "contact-3",
        name: "Emma Williams",
        email: "emma@enterprise.com",
        subject: "Cloud Migration Project",
        message: "We're planning to migrate our on-premise infrastructure to AWS. We have about 200 servers and need help with the migration strategy and execution. Are you available for a consultation?",
        read: false,
      },
    }),
  ]);
  console.log(`✅ Created ${contacts.length} contact submissions`);

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Login credentials:");
  console.log("   Email:    admin@engineersdoor.com");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
