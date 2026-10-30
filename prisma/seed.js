const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const documentTemplates = [
  {
    id: "doc-tmpl-contract-01",
    type: "DOCUMENT",
    name: "Standard Employment Contract",
    category: "Legal & HR",
    description: "Official full-time labor agreement compliant with employment standards, covering compensation, benefits, and confidentiality.",
    thumbnailPath: "/thumbnails/documents/contract.svg",
    filePath: "templates/documents/employment-contract.html",
    content: `<h1>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
<p style="text-align: center;"><strong>Độc lập - Tự do - Hạnh phúc</strong></p>
<hr />
<h2 style="text-align: center;">HỢP ĐỒNG LAO ĐỘNG</h2>
<p style="text-align: center;"><em>(Số: ....../2026/HĐLĐ-OFFICE)</em></p>
<p>Hôm nay, ngày ...... tháng ...... năm 2026, tại Trụ sở Công ty Cổ phần Công nghệ ABC:</p>
<h3>ĐẠI DIỆN NGƯỜI SỬ DỤNG LAO ĐỘNG (BÊN A):</h3>
<ul>
  <li><strong>Công ty:</strong> CÔNG TY CỔ PHẦN CÔNG NGHỆ ABC</li>
  <li><strong>Đại diện:</strong> Ông/Bà Nguyễn Văn A - Chức vụ: Tổng Giám Đốc</li>
  <li><strong>Địa chỉ:</strong> Tầng 12, Tòa nhà Innovation, TP. Hồ Chí Minh</li>
  <li><strong>Mã số thuế:</strong> 0109988776</li>
</ul>
<h3>NGƯỜI LAO ĐỘNG (BÊN B):</h3>
<ul>
  <li><strong>Họ và tên:</strong> Trần Thị B</li>
  <li><strong>Sinh ngày:</strong> 15/08/1995</li>
  <li><strong>Số CCCD:</strong> 079195001234 - Cấp ngày: 10/05/2022</li>
  <li><strong>Địa chỉ thường trú:</strong> Quận 1, TP. Hồ Chí Minh</li>
</ul>
<h3>ĐIỀU 1: THỜI HẠN VÀ CÔNG VIỆC HỢP ĐỒNG</h3>
<p>- Loại hợp đồng: Hợp đồng lao động xác định thời hạn 24 tháng.</p>
<p>- Vị trí chuyên môn: Senior Fullstack Software Engineer.</p>
<p>- Địa điểm làm việc: Văn phòng công ty và linh hoạt từ xa (Hybrid).</p>
<h3>ĐIỀU 2: CHẾ ĐỘ LÀM VIỆC VÀ TIỀN LƯƠNG</h3>
<p>- Mức lương cơ bản: <strong>45.000.000 VNĐ / tháng</strong> (Bốn mươi lăm triệu đồng).</p>
<p>- Phụ cấp thiết bị và ăn trưa: 3.000.000 VNĐ / tháng.</p>
<p>- Thời gian làm việc: 40 giờ/tuần (Thứ 2 đến Thứ 6).</p>
<p>- Đóng bảo hiểm xã hội, y tế, thất nghiệp đầy đủ theo quy định của pháp luật.</p>
<h3>ĐIỀU 3: BẢO MẬT VÀ SỞ HỮU TRÍ TUỆ</h3>
<p>Bên B cam kết bảo mật tuyệt đối các thông tin kinh doanh, mã nguồn và dữ liệu khách hàng trong suốt thời gian làm việc và 02 năm sau khi chấm dứt hợp đồng.</p>`
  },
  {
    id: "doc-tmpl-proposal-02",
    type: "DOCUMENT",
    name: "Enterprise Project Proposal",
    category: "Business & Strategy",
    description: "Comprehensive enterprise software implementation proposal including business goals, architecture roadmap, and budget quotation.",
    thumbnailPath: "/thumbnails/documents/proposal.svg",
    filePath: "templates/documents/project-proposal.html",
    content: `<h1>PROJECT PROPOSAL: ENTERPRISE CLOUD MIGRATION</h1>
<p><strong>Prepared for:</strong> Global Logistics Corporation</p>
<p><strong>Prepared by:</strong> CloudScale Solutions Ltd.</p>
<p><strong>Date:</strong> October 2026 | Version 1.2</p>
<hr />
<h2>1. Executive Summary</h2>
<p>This proposal outlines the strategy, architecture, and timeline for migrating Global Logistics Corporation's on-premises warehouse management systems to a modern, multi-region Kubernetes cloud infrastructure.</p>
<h2>2. Objectives & Key Results (OKRs)</h2>
<ul>
  <li><strong>System Availability:</strong> Increase uptime from 98.2% to 99.99% with active-active failover.</li>
  <li><strong>Latency Reduction:</strong> Reduce peak query response time by 45% via distributed edge caching.</li>
  <li><strong>Operating Costs:</strong> Reduce annual hardware maintenance overhead by estimated $120,000 USD.</li>
</ul>
<h2>3. Solution Architecture & Scope</h2>
<p>The proposed system architecture is designed around event-driven microservices containerized with Docker and orchestrated using AWS EKS.</p>
<p>Key phases include:</p>
<ol>
  <li><strong>Phase 1 (Month 1-2):</strong> Database schema migration & dual-write replication verification.</li>
  <li><strong>Phase 2 (Month 3-4):</strong> Core API service deployment & canary traffic routing.</li>
  <li><strong>Phase 3 (Month 5):</strong> Cutover, load testing, and staff operations handover.</li>
</ol>
<h2>4. Commercial Estimate & Budget</h2>
<table border="1" style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="padding: 8px;">Milestone Item</th>
      <th style="padding: 8px;">Timeline</th>
      <th style="padding: 8px;">Investment (USD)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;">Cloud Architecture & Security Setup</td>
      <td style="padding: 8px;">Weeks 1-4</td>
      <td style="padding: 8px;">$18,000</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Data Migration & Pipeline Deployment</td>
      <td style="padding: 8px;">Weeks 5-12</td>
      <td style="padding: 8px;">$34,000</td>
    </tr>
    <tr>
      <td style="padding: 8px;">QA, Pen-testing & Production Cutover</td>
      <td style="padding: 8px;">Weeks 13-16</td>
      <td style="padding: 8px;">$15,000</td>
    </tr>
  </tbody>
</table>`
  },
  {
    id: "doc-tmpl-minutes-03",
    type: "DOCUMENT",
    name: "Executive Board Meeting Minutes",
    category: "Operations & Management",
    description: "Structured corporate meeting documentation with attendee verification, discussion topics, vote results, and assigned action items.",
    thumbnailPath: "/thumbnails/documents/minutes.svg",
    filePath: "templates/documents/meeting-minutes.html",
    content: `<h1>EXECUTIVE BOARD MEETING MINUTES</h1>
<p><strong>Meeting Subject:</strong> Q4 Strategic Planning & Capital Allocation</p>
<p><strong>Date & Time:</strong> October 28, 2026 — 09:30 AM to 11:45 AM (GMT+7)</p>
<p><strong>Location:</strong> Boardroom A & Remote Google Meet</p>
<hr />
<h2>1. Attendees & Quorum</h2>
<ul>
  <li><strong>Chairperson:</strong> Johnathan Davis (Chief Executive Officer)</li>
  <li><strong>Secretary:</strong> Eleanor Vance (Head of Legal & Governance)</li>
  <li><strong>Directors Present:</strong> Michael Chen (CTO), Sarah Jenkins (CFO), Robert Miller (VP Product)</li>
  <li><strong>Quorum Status:</strong> 100% attendance confirmed; meeting duly constituted.</li>
</ul>
<h2>2. Agenda Items Discussed</h2>
<h3>Item A: Review of Q3 Financial Performance</h3>
<p>The CFO presented financial highlights. Total revenue reached $4.2M, beating the target by 8.4%. Gross profit margins improved to 68%.</p>
<h3>Item B: Proposed Budget for AI Product Integration</h3>
<p>The CTO presented an overview of the AI Office Assistant feature pipeline. After discussion, the Board unanimously voted <strong>APPROVED</strong> for the $250,000 R&D allocation.</p>
<h2>3. Action Items & Owners</h2>
<ul>
  <li><strong>Sarah Jenkins (CFO):</strong> Finalize banking credit facility expansion by Nov 10, 2026.</li>
  <li><strong>Michael Chen (CTO):</strong> Deliver prototype benchmark metrics for LLM integration by Nov 15, 2026.</li>
  <li><strong>Eleanor Vance (Legal):</strong> Submit corporate resolution to shareholder registry.</li>
</ul>`
  },
  {
    id: "doc-tmpl-resume-04",
    type: "DOCUMENT",
    name: "Senior Software Engineer CV",
    category: "Human Resources & Career",
    description: "Modern, professional two-column curriculum vitae tailored for technical leads, engineering managers, and senior developers.",
    thumbnailPath: "/thumbnails/documents/resume.svg",
    filePath: "templates/documents/resume-cv.html",
    content: `<h1>ALEXANDER NGUYEN</h1>
<p><strong>Staff Full-Stack Software Engineer & Solutions Architect</strong></p>
<p>Email: alexander.nguyen@example.com | Phone: (+84) 909-123-456 | GitHub: github.com/alexnguyen</p>
<hr />
<h2>Professional Summary</h2>
<p>Seasoned Software Engineer with over 8 years of experience building mission-critical distributed web applications. Expert in TypeScript, Next.js, Node.js, Go, PostgreSQL, and AWS cloud architecture. Proven track record leading cross-functional teams to ship high-throughput, fault-tolerant SaaS platforms.</p>
<h2>Core Technical Competencies</h2>
<ul>
  <li><strong>Frontend:</strong> Next.js (App Router), React, TypeScript, Tailwind CSS, Webpack, State Management.</li>
  <li><strong>Backend & APIs:</strong> Node.js, Express, NestJS, Go, GraphQL, RESTful APIs, gRPC.</li>
  <li><strong>Databases & Storage:</strong> PostgreSQL, SQLite, Prisma ORM, Redis, MinIO, DynamoDB.</li>
  <li><strong>DevOps & Cloud:</strong> Docker, Kubernetes, AWS (ECS, Lambda, S3, RDS), GitHub Actions CI/CD.</li>
</ul>
<h2>Work Experience</h2>
<h3>Lead Full-Stack Engineer — TechCore Innovation (2022 - Present)</h3>
<ul>
  <li>Spearheaded redesign of the enterprise document processing engine, cutting latency by 60%.</li>
  <li>Mentored an engineering squad of 8 developers; instituted automated testing raising coverage to 92%.</li>
  <li>Architected real-time collaboration pipeline serving 50,000 concurrent active users.</li>
</ul>
<h3>Senior Software Developer — FinData Systems (2019 - 2022)</h3>
<ul>
  <li>Constructed secure financial reconciliation microservices handling $20M+ daily transaction volume.</li>
  <li>Designed scalable OAuth2 and RBAC authorization framework across 14 microservices.</li>
</ul>
<h2>Education</h2>
<p><strong>Bachelor of Science in Computer Science</strong> — National University of Technology (Graduated with Honors, 2018)</p>`
  },
  {
    id: "doc-tmpl-report-05",
    type: "DOCUMENT",
    name: "Quarterly Business Performance Report",
    category: "Reports & Analytics",
    description: "Standard executive reporting format with KPI matrices, departmental highlights, risk assessments, and next-quarter strategic recommendations.",
    thumbnailPath: "/thumbnails/documents/report.svg",
    filePath: "templates/documents/business-report.html",
    content: `<h1>QUARTERLY BUSINESS PERFORMANCE REPORT</h1>
<p><strong>Period:</strong> Q3 2026 (July 1 - September 30, 2026)</p>
<p><strong>Department:</strong> Corporate Operations & Business Intelligence</p>
<p><strong>Author:</strong> Strategic Analytics Group</p>
<hr />
<h2>1. Executive Summary</h2>
<p>During the third quarter of 2026, the company demonstrated resilient growth across enterprise accounts. Overall Annual Recurring Revenue (ARR) expanded by 22% year-over-year, driven primarily by customer retention and upsell of our AI-assisted productivity suite.</p>
<h2>2. Financial & Operating KPI Scorecard</h2>
<ul>
  <li><strong>Net New Revenue:</strong> $1,450,000 (108% of quarterly goal).</li>
  <li><strong>Customer Acquisition Cost (CAC):</strong> $2,100 (reduced by 14% via inbound organic initiatives).</li>
  <li><strong>Net Revenue Retention (NRR):</strong> 116%.</li>
  <li><strong>Monthly Active Teams:</strong> 3,420 organizations (up 18% QoQ).</li>
</ul>
<h2>3. Departmental Milestones</h2>
<h3>Product & Engineering</h3>
<p>Successfully shipped Document Template Hub v1.0 and PPTX Exporting Engine, supporting high-fidelity local generation without external cloud dependencies.</p>
<h3>Sales & Marketing</h3>
<p>Closed 18 new enterprise annual commitments across APAC and North American fintech sectors.</p>
<h2>4. Key Risks & Mitigation Strategy</h2>
<p><strong>Talent Competition:</strong> High demand for senior cloud and AI talent. Mitigation: Introduced remote-first working policies and accelerated stock option vesting schedules.</p>
<h2>5. Strategic Priorities for Next Quarter</h2>
<ol>
  <li>Launch Presentation Template Designer with real-time slide previewing.</li>
  <li>Implement end-to-end automated regression testing for all export formats.</li>
  <li>Expand localization support for multi-language document drafting.</li>
</ol>`
  }
];

const presentationTemplates = [
  {
    id: "pres-tmpl-pitch-01",
    type: "PRESENTATION",
    name: "Venture Capital Pitch Deck",
    category: "Startup & Investment",
    description: "High-impact 16:9 dark-mode investor pitch deck designed for Series A/B fundraising, traction highlights, and market sizing.",
    thumbnailPath: "/thumbnails/presentations/pitch-deck.svg",
    filePath: "templates/presentations/venture-pitch-deck.pptx",
    content: "Venture Capital Pitch Deck",
    slides: JSON.stringify([
      {
        slideNumber: 1,
        title: "Title & Executive Overview",
        summary: "Company mission, vision, and core tagline.",
        keyPoints: ["Company Name & Logo", "One-line value proposition", "Presenter credentials"]
      },
      {
        slideNumber: 2,
        title: "The Problem & Market Opportunity",
        summary: "TAM/SAM/SOM market sizing and industry pain points.",
        keyPoints: ["$120B Total Addressable Market", "Inefficiencies in legacy document workflows", "Customer willingness to pay"]
      },
      {
        slideNumber: 3,
        title: "Product Architecture & Moat",
        summary: "Technical innovation and proprietary competitive advantages.",
        keyPoints: ["100% Immutable Master Templates", "High-fidelity native OpenXML export", "Zero third-party vendor lock-in"]
      },
      {
        slideNumber: 4,
        title: "Traction & Revenue Growth",
        summary: "ARR trajectory, unit economics, and customer metrics.",
        keyPoints: ["$4.2M Annual Recurring Revenue (+220% YoY)", "148 Enterprise customer logos", "128% Net Revenue Retention"]
      },
      {
        slideNumber: 5,
        title: "The Funding Ask & Allocation",
        summary: "Capital requirements and 24-month roadmap milestone targets.",
        keyPoints: ["$12M Series A funding target", "50% R&D / 30% GTM / 20% Security & Compliance"]
      }
    ])
  },
  {
    id: "pres-tmpl-qbr-02",
    type: "PRESENTATION",
    name: "Quarterly Business Review (QBR)",
    category: "Corporate & Finance",
    description: "Polished executive presentation for boardroom reporting, departmental OKRs, EBITDA margins, and strategic quarterly priorities.",
    thumbnailPath: "/thumbnails/presentations/qbr.svg",
    filePath: "templates/presentations/quarterly-business-review.pptx",
    content: "Quarterly Business Review (QBR)",
    slides: JSON.stringify([
      {
        slideNumber: 1,
        title: "QBR Header & Executive Review",
        summary: "Corporate leadership overview and governance context.",
        keyPoints: ["Q3 2026 performance period", "Board of directors attendance", "Governance and review charter"]
      },
      {
        slideNumber: 2,
        title: "Financial Scorecard & Margins",
        summary: "Revenue, gross margin, EBITDA, and budget variance.",
        keyPoints: ["$8.4M Gross Revenue achieved", "28.4% EBITDA operating margin", "118% Net Dollar Expansion"]
      },
      {
        slideNumber: 3,
        title: "Regional Sales & Customer Success",
        summary: "Performance breakdown across APAC, EMEA, and North America.",
        keyPoints: ["APAC revenue +46% QoQ expansion", "12 New Fortune 500 contract agreements", "Customer NPS score reached 72"]
      },
      {
        slideNumber: 4,
        title: "Next Quarter Strategic Roadmaps",
        summary: "High-priority operational objectives and risk management.",
        keyPoints: ["ISO 27001 & SOC 2 Type II audit completion", "Rollout of automated multi-format document engine", "New Enterprise Partner Tier launch"]
      }
    ])
  },
  {
    id: "pres-tmpl-product-03",
    type: "PRESENTATION",
    name: "Product Launch Keynote",
    category: "Product & Marketing",
    description: "Vibrant, design-forward slide deck for product launches, developer conferences, and major feature release announcements.",
    thumbnailPath: "/thumbnails/presentations/product-launch.svg",
    filePath: "templates/presentations/product-launch-keynote.pptx",
    content: "Product Launch Keynote",
    slides: JSON.stringify([
      {
        slideNumber: 1,
        title: "Keynote Announcement Cover",
        summary: "Grand reveal of Office Template Hub 2.0.",
        keyPoints: ["Office Template Hub 2.0 release", "Next-gen workplace productivity", "Opening keynote presentation"]
      },
      {
        slideNumber: 2,
        title: "Why Legacy Tools Fall Short",
        summary: "The fundamental limitations of web mocks and unstable tools.",
        keyPoints: ["Formatting loss during exports", "Accidental mutation of company master files", "Sluggish in-browser performance"]
      },
      {
        slideNumber: 3,
        title: "Architectural Pillars of Version 2.0",
        summary: "Native OpenXML generation, immutability, and type safety.",
        keyPoints: ["Immutable masters with copy-on-write drafts", "Strict TypeScript & Zod validation", "100% Offline-capable SQLite database"]
      },
      {
        slideNumber: 4,
        title: "Availability & Next Steps",
        summary: "Launch schedule, enterprise tiers, and getting started.",
        keyPoints: ["Live on recruitment MVP", "Compatible with PowerPoint, Keynote & Google Slides", "Full documentation and API coverage"]
      }
    ])
  }
];

async function main() {
  console.log("Seeding Document Templates...");
  const docDir = path.join(__dirname, "..", "templates", "documents");
  if (!fs.existsSync(docDir)) {
    fs.mkdirSync(docDir, { recursive: true });
  }

  for (const item of documentTemplates) {
    const diskPath = path.join(__dirname, "..", item.filePath);
    fs.writeFileSync(diskPath, item.content, "utf8");

    await prisma.template.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        category: item.category,
        description: item.description,
        thumbnailPath: item.thumbnailPath,
        filePath: item.filePath,
        content: item.content,
      },
      create: {
        id: item.id,
        type: item.type,
        name: item.name,
        category: item.category,
        description: item.description,
        thumbnailPath: item.thumbnailPath,
        filePath: item.filePath,
        content: item.content,
      },
    });
    console.log(`✓ Seeded document template: ${item.name}`);
  }

  console.log("\nSeeding Presentation Templates...");
  for (const item of presentationTemplates) {
    await prisma.template.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        category: item.category,
        description: item.description,
        thumbnailPath: item.thumbnailPath,
        filePath: item.filePath,
        content: item.content,
        slides: item.slides,
      },
      create: {
        id: item.id,
        type: item.type,
        name: item.name,
        category: item.category,
        description: item.description,
        thumbnailPath: item.thumbnailPath,
        filePath: item.filePath,
        content: item.content,
        slides: item.slides,
      },
    });
    console.log(`✓ Seeded presentation template: ${item.name}`);
  }

  console.log("\nDatabase seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
