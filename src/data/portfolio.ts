export interface ProjectLink {
  label: string;
  url: string;
  kind?: "primary" | "portal" | "github";
}

export interface ProjectChallenge {
  challenge: string;
  solution: string;
}

export interface ProjectArchitectureLayer {
  layer: string;
  detail: string;
}

export interface ProjectGalleryItem {
  id: string;
  label: string;
  title: string;
  caption: string;
  image: string;
  url?: string;
}

export type ProjectVisualType =
  | "screenshot"
  | "mobile-screenshot"
  | "screenshot-gallery"
  | "university-systems"
  | "hoist-platform";

export interface Project {
  slug: string;
  index: string;
  title: string;
  category: string;
  filterGroup: "systems" | "fullstack" | "ai-web3" | "frontend";
  tagline: string;
  summary: string;
  featured: boolean;
  year: string;
  role: string;
  organization?: string;
  technologies: string[];
  visualType: ProjectVisualType;
  /** Replace with a real screenshot path (e.g. "/images/university.png") to override architectural diagrams */
  image?: string;
  imageAlt: string;
  gallery?: ProjectGalleryItem[];
  links: ProjectLink[];
  highlights: string[];
  caseStudy: {
    problem: string;
    objectives: string[];
    contributions: string[];
    technicalApproach: string;
    architecture: ProjectArchitectureLayer[];
    challenges: ProjectChallenge[];
    note?: string;
  };
}

export interface ExperienceLink {
  label: string;
  url: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  /** Editable date string — update exact start/end months if desired */
  period: string;
  location: string;
  current?: boolean;
  summary: string;
  contributions: string[];
  technologies: string[];
  shippedLinks?: ExperienceLink[];
}

export interface CapabilityGroup {
  index: string;
  title: string;
  summary: string;
  items: string[];
}

export interface CredentialItem {
  title: string;
  issuer: string;
  date: string;
  detail: string;
  url?: string;
  certificateImage?: string;
}

export const portfolioData = {
  profile: {
    firstName: "Chukwuebuka",
    fullName: "Chukwuebuka Emmanuel Egwuete",
    shortName: "Chukwuebuka Egwuete",
    monogram: "CE",
    eyebrow: "SOFTWARE ENGINEER / FULL-STACK & AI AUTOMATION",
    role: "Software Engineer · AI Automation",
    location: "Enugu, Nigeria",
    availability: "Open to opportunities and interesting engineering challenges.",
    resumeUrl: "/pdf/CHUKWUEBUKA%20EGWUETE%20CV.pdf",
    photo: "/images/IMG_1715.JPG",
    photos: [
      {
        src: "/images/IMG_1715.JPG",
        alt: "Chukwuebuka Emmanuel Egwuete presenting product architecture on screen",
        caption: "Product & architecture walkthrough",
        objectPosition: "58% 28%",
      },
      {
        src: "/images/IMG_1710%20(1).JPG",
        alt: "Chukwuebuka Emmanuel Egwuete reviewing TypeScript code during a technical session",
        caption: "TypeScript & code review session",
        objectPosition: "48% 24%",
      },
      {
        src: "/images/IMG_1748.jpg",
        alt: "Chukwuebuka Emmanuel Egwuete in an engineering discussion",
        caption: "Engineering discussion · Enugu",
        objectPosition: "50% 22%",
      },
    ],
  },

  hero: {
    headlineLines: ["I build software", "that solves", "real problems."],
    description:
    "I build web applications, backend systems, and AI automation workflows — turning complex ideas into practical, reliable software.",
    primaryCta: {
      label: "Explore selected work",
      href: "#work",
    },
    secondaryCta: {
      label: "Let's connect",
      href: "#contact",
    },
  },

  introduction: {
    eyebrow: "POSITIONING",
    heading: "Engineering software & AI automation.",
    paragraphs: [
      "I am a software engineer focused on building useful digital products, reliable systems, and practical AI automation. My work spans frontend development, backend engineering, API design, AI workflow integration, and deployment.",
      "I enjoy working through the entire process — understanding a problem, designing an automated or full-stack solution, building it, and making sure it performs reliably in the real world.",
    ],
    pillars: [
      {
        label: "AI Automation",
        value: "AI-driven workflows, contextual assistants & operational automation in Python",
      },
      {
        label: "Full-Stack Systems",
        value: "End-to-end delivery across event platforms, university portals & Web3 apps",
      },
      {
        label: "Engineering Practice",
        value: "Maintainable TypeScript, React/Next.js, Django REST APIs & clean UX",
      },
    ],
  },

  projects: [
    {
      slug: "kuepass",
      index: "01",
      title: "Kuepass",
      category: "Event Technology",
      filterGroup: "fullstack",
      tagline: "Simplifying event operations, ticket sales, and attendee entry.",
      summary:
        "Kuepass is an event ticketing and management platform designed to simplify event operations, ticket sales, attendee management, and QR-based ticket validation.",
      featured: true,
      year: "2025",
      role: "Lead Software Developer",
      organization: "CrispTV",
      technologies: [
        "Next.js",
        "TypeScript",
        "Python",
        "Django REST Framework",
        "PostgreSQL",
      ],
      visualType: "screenshot",
      image: "/images/Capture3.PNG",
      imageAlt: "Kuepass event discovery, search, and ticketing web platform interface",
      links: [
        { label: "Visit Kuepass", url: "https://kuepass.com", kind: "primary" },
      ],
      highlights: [
        "Event host dashboard for ticket inventory, pricing tiers, and sales tracking",
        "Encrypted QR ticket generation bound to attendee records for anti-fraud entry control",
        "End-to-end attendee registration, payment workflows, and multi-checkpoint validation",
        "AI-assisted operational workflows for event planning and coordination",
      ],
      caseStudy: {
        problem:
          "Event organizers frequently juggle disconnected spreadsheets, manual payment confirmation, and error-prone gate check-ins — leading to entry bottlenecks, duplicate tickets, and limited visibility into real-time sales.",
        objectives: [
          "Provide a single platform where event hosts can publish events, configure ticket tiers, and monitor transactions in real time.",
          "Issue secure, mobile-ready QR tickets tied directly to attendee records to prevent gate-crashing and unauthorized reuse.",
          "Streamline attendee discovery and checkout so purchasing a ticket takes minimal friction on mobile or desktop.",
          "Introduce workflow automation to reduce manual operational overhead for organizers.",
        ],
        contributions: [
          "Led end-to-end product development across the Next.js / TypeScript web interface and Python / Django REST backend APIs.",
          "Designed and built the event host dashboard covering ticket inventory controls, transaction records, and live sales visibility.",
          "Implemented QR-based ticket generation and validation workflows supporting entry control and session checkpoints.",
          "Integrated payment processing flows and AI-assisted automation features across host operations.",
        ],
        technicalApproach:
          "Built as a decoupled frontend and API-driven backend architecture. Next.js and TypeScript power fast event discovery pages and responsive organizer dashboards, communicating with a Django REST Framework service backed by PostgreSQL for transactional integrity across ticket allocations, orders, and validation states.",
        architecture: [
          {
            layer: "Web Client & Host Dashboard",
            detail:
              "Next.js + TypeScript application handling public event discovery, checkout flows, and organizer inventory management.",
          },
          {
            layer: "Core Ticketing & Operations API",
            detail:
              "Python & Django REST Framework managing event lifecycle, seat/tier inventory constraints, order state transitions, and QR verification endpoints.",
          },
          {
            layer: "Data & Workflow Layer",
            detail:
              "PostgreSQL relational store for atomic ticket reservation and check-in records, paired with automated notification and AI planning workflows.",
          },
        ],
        challenges: [
          {
            challenge:
              "Preventing duplicate ticket usage and race conditions during concurrent ticket purchases or high-traffic gate entry.",
            solution:
              "Bound each generated QR credential to a unique verifiable record with strict server-side state validation on scan, ensuring single-use enforcement and clear checkpoint status feedback.",
          },
          {
            challenge:
              "Keeping the organizer dashboard intuitive while supporting multi-tier tickets, transaction logs, and attendee lookups.",
            solution:
              "Structured the host workspace into modular views with predictable navigation, clear status indicators, and responsive table/card patterns tailored to on-site event staff.",
          },
        ],
      },
    },
    {
      slug: "university-systems",
      index: "02",
      title: "University Systems",
      category: "Education Technology / Digital Infrastructure",
      filterGroup: "systems",
      tagline:
        "Digital infrastructure powering admissions, student portals, university library access, and academic administration.",
      summary:
        "Institutional software systems built for higher-education operations — connecting student admissions portals, authorized administrative dashboards, and digital library / learning platforms across Marist Polytechnic and Godfrey Okoye University.",
      featured: true,
      year: "Present",
      role: "Full-Stack / Frontend Software Engineer",
      organization: "Hoist IT Solutions & Godfrey Okoye University",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "REST APIs",
        "Role-Based Access",
        "Institutional Portals",
      ],
      visualType: "screenshot-gallery",
      image: "/images/Capturea.PNG",
      imageAlt:
        "Marist Polytechnic and Godfrey Okoye University student, administration, and library web portals",
      gallery: [
        {
          id: "marist-student",
          label: "Marist Student",
          title: "Marist Polytechnic — Student & Admissions Portal",
          caption:
            "Online ND & affiliated degree applications, document upload, real-time admission tracking, and existing student Matric No onboarding.",
          image: "/images/Capturea.PNG",
          url: "https://portal.maristpolytechnic.edu.ng/login",
        },
        {
          id: "marist-admin",
          label: "Marist Admin",
          title: "Marist Polytechnic — Administration Portal",
          caption:
            "Authorized staff authentication and institutional admissions administration interface.",
          image: "/images/Capturem.PNG",
          url: "https://adminportal.maristpolytechnic.edu.ng/login",
        },
        {
          id: "gouni-library",
          label: "GOUNI Library",
          title: "Godfrey Okoye University — University Library Portal",
          caption:
            "Academic library hub linking collections, Library Catalogue, online resources, institutional repository, and Student ERP access.",
          image: "/images/Capturel.PNG",
          url: "https://onlinelearning.gouni.edu.ng/",
        },
        {
          id: "gouni-student",
          label: "GOUNI Student",
          title: "Godfrey Okoye University — Student & Admissions Portal",
          caption:
            "Prospective student admission mode selection, application initiation, and admission status portal.",
          image: "/images/Captures.PNG",
          url: "https://goufrontends.vercel.app/",
        },
        {
          id: "gouni-admin",
          label: "GOUNI Admin",
          title: "Godfrey Okoye University — Enterprise Admin Portal",
          caption:
            "Role-restricted institutional staff portal for admissions and academic administration.",
          image: "/images/Capturess.PNG",
          url: "https://goufrontendadmin.vercel.app/login",
        },
      ],
      links: [
        {
          label: "Marist Student Portal",
          url: "https://portal.maristpolytechnic.edu.ng/login",
          kind: "portal",
        },
        {
          label: "Marist Admin Portal",
          url: "https://adminportal.maristpolytechnic.edu.ng/login",
          kind: "portal",
        },
        {
          label: "GOUNI Library & Online Learning",
          url: "https://onlinelearning.gouni.edu.ng/",
          kind: "primary",
        },
        {
          label: "GOUNI Student Portal",
          url: "https://goufrontends.vercel.app/",
          kind: "portal",
        },
        {
          label: "GOUNI Admin Portal",
          url: "https://goufrontendadmin.vercel.app/login",
          kind: "portal",
        },
      ],
      highlights: [
        "Marist Polytechnic Admissions & Student Portal supporting ND and AE-FUNAI degree applications, document submission, and Matric No onboarding",
        "Dedicated authorized-staff Administration Portals for both Marist Polytechnic and Godfrey Okoye University",
        "Godfrey Okoye University Library & Online Learning web portal connecting academic collections, catalogue search, and institutional repositories",
        "Godfrey Okoye University Student Admissions portal streamlining admission mode selection and status tracking",
      ],
      caseStudy: {
        problem:
          "Higher-education institutions often rely on fragmented paper forms, isolated spreadsheets, and disconnected legacy portals. Students face friction during admissions, onboarding, resource access, and course workflows, while administrative staff lack a unified interface to review applications and coordinate institutional operations.",
        objectives: [
          "Separate prospective/current student self-service workflows from privileged administrative operations through clean, role-scoped web portals.",
          "Support core institutional journeys including online admissions, document uploads, Matric No onboarding, digital library discovery, and administrative review.",
          "Deliver responsive, dependable web interfaces usable across campus desktops and student mobile devices on varying network conditions.",
          "Maintain strict security boundaries between public landing interfaces, student portals, and authorized staff dashboards.",
        ],
        contributions: [
          "Built and maintained the Marist Polytechnic Student/Admissions Portal and Administration Portal interfaces through Hoist IT Solutions.",
          "Engineered Godfrey Okoye University's University Library portal alongside its modern Student Admissions Portal and Enterprise Administrative Portal frontends.",
          "Implemented structured authentication flows, role-gated views, multi-step onboarding/application validation, and REST API integration layers.",
          "Aligned frontend architecture across both institutions with unified institutional ERP and academic workflows.",
        ],
        technicalApproach:
          "Approached institutional software as connected infrastructure rather than isolated pages. Each institution separates public academic resources, student admissions portals, and authorized administrative portals while maintaining consistent component architecture, clear session boundaries, and structured API contracts.",
        architecture: [
          {
            layer: "Student & Admissions Portals",
            detail:
              "Dedicated web applications (Marist Polytechnic & GOUNI student portals) for admission mode selection, document uploads, Matric No onboarding, and application status tracking.",
          },
          {
            layer: "Enterprise & Staff Admin Portals",
            detail:
              "Authorized staff portals (Marist Administration & GOUNI Enterprise Portal) governing admissions administration and institutional workflows via role-based access control.",
          },
          {
            layer: "University Library & Learning Hub",
            detail:
              "Godfrey Okoye University Library & online learning platform connecting academic resources, Library Catalogue search, Institutional Repository, and Student ERP links.",
          },
          {
            layer: "Shared API & Authentication Layer",
            detail:
              "Centralized institutional services keeping admissions, student status, academic resources, and staff permissions synchronized.",
          },
        ],
        challenges: [
          {
            challenge:
              "Serving diverse user groups — prospective applicants, continuing students, librarians, and administrative staff — without exposing privileged routes or cluttering workflows.",
            solution:
              "Separated student, library, and administrative surfaces into dedicated portals with clear authentication boundaries, role-scoped routing, and focused task navigation.",
          },
          {
            challenge:
              "Supporting multi-step admissions applications, existing-student Matric No onboarding, and high-traffic registration windows across mobile networks.",
            solution:
              "Built lightweight, well-validated form journeys with explicit state feedback so applicants and returning students can complete onboarding reliably on any device.",
          },
        ],
        note: "Note: Administrative and student portal URLs link to public login entry points only. No private institutional data, student records, or internal API endpoints are exposed.",
      },
    },
    {
      slug: "cookeaze",
      index: "03",
      title: "Cookeaze",
      category: "Food Technology / AI",
      filterGroup: "ai-web3",
      tagline:
        "Making meal discovery, recipe planning, and everyday cooking more accessible through AI.",
      summary:
        "Cookeaze is a digital cooking companion combining curated regional and global recipes with AI-powered culinary assistance, personalized meal planning, and interactive kitchen workflows.",
      featured: true,
      year: "2024 — 2025",
      role: "Full-Stack / AI Automation Contributor",
      organization: "Viicsoft",
      technologies: ["Python", "React", "AI Automation", "REST APIs"],
      visualType: "mobile-screenshot",
      image: "/images/cookeaze.jpg",
      imageAlt:
        "Cookeaze mobile application showing curated Nigerian and global recipes alongside the Sous Chef AI assistant",
      links: [
        { label: "Visit Cookeaze", url: "https://cookeaze.com", kind: "primary" },
      ],
      highlights: [
        "AI-powered Sous Chef assistant supporting contextual recipe guidance and meal planning",
        "Curated catalog bridging global dishes and authentic African / Nigerian home cooking",
        "Personalized recipe discovery, dietary filtering, and bookmarkable meal planners",
        "Python-backed automation services powering smart recommendations and structured interactions",
      ],
      caseStudy: {
        problem:
          "Home cooks often know what ingredients they have on hand or what health goal they want to support, yet struggle to bridge recipe inspiration with practical, step-by-step preparation — especially across authentic regional cuisines.",
        objectives: [
          "Create an approachable culinary discovery experience that surfaces both global meals and authentic Nigerian/African dishes.",
          "Integrate contextual AI assistance that responds to real cooking questions, ingredient constraints, and meal planning goals.",
          "Build maintainable backend automation workflows capable of producing structured, reliable culinary suggestions.",
        ],
        contributions: [
          "Contributed to engineering and refining Cookeaze's AI automation systems in Python.",
          "Built logic supporting personalized meal plans, recipe generation workflows, and contextual user interactions.",
          "Collaborated on frontend and administrative tooling to keep recipe discovery and content management smooth.",
        ],
        technicalApproach:
          "Combined structured culinary catalog data with Python-driven AI workflow services. Prompt orchestration and response formatting layers translate free-form cooking queries into consistent, usable recommendations that integrate directly into the app's recipe and planner interfaces.",
        architecture: [
          {
            layer: "Consumer Experience",
            detail:
              "Mobile-first interface for recipe browsing, favorites, meal planning, and direct access to the Sous Chef assistant.",
          },
          {
            layer: "AI Automation Pipeline",
            detail:
              "Python services handling contextual prompt construction, recipe synthesis, meal plan workflows, and response normalization.",
          },
          {
            layer: "Content & Admin Services",
            detail:
              "Structured recipe catalog supporting categories, prep times, regional cuisine tags, and editorial curation.",
          },
        ],
        challenges: [
          {
            challenge:
              "Ensuring AI-generated recipe suggestions remain practical, culturally relevant, and cleanly formatted for UI rendering.",
            solution:
              "Introduced structured output constraints and contextual culinary guardrails within the Python automation layer so responses map predictably into interface components.",
          },
        ],
      },
    },
    {
      slug: "soundrig",
      index: "04",
      title: "SoundRig",
      category: "Music Technology / Web3",
      filterGroup: "ai-web3",
      tagline:
        "Exploring the intersection of digital music discovery, artist ownership, and Web3.",
      summary:
        "A Web3 music platform built on blockchain infrastructure, pairing responsive music discovery and playback interfaces with multi-wallet connectivity and smart contract interactions.",
      featured: true,
      year: "2024 — 2025",
      role: "Frontend Developer",
      organization: "SoundRig",
      technologies: [
        "React",
        "TypeScript",
        "Web3.js",
        "Python",
        "PostgreSQL",
      ],
      visualType: "screenshot",
      image: "/images/sound.PNG",
      imageAlt:
        "SoundRig Web3 music exploration interface displaying curated artist releases and purchase controls",
      links: [
        { label: "Visit SoundRig", url: "https://soundrig.io", kind: "primary" },
      ],
      highlights: [
        "Responsive music discovery, library, and artist onboarding interfaces",
        "Integration of multiple third-party Web3 wallets for decentralized transactions",
        "Smart contract interaction states with transparent transaction feedback",
        "Frontend performance tuning across external blockchain and media APIs",
      ],
      caseStudy: {
        problem:
          "Decentralized music applications often expose raw blockchain complexity directly to listeners — resulting in confusing wallet prompts, slow interface states, and fragmented discovery experiences.",
        objectives: [
          "Deliver a familiar, clean music browsing and listening experience while supporting Web3 ownership under the hood.",
          "Integrate multiple third-party Web3 wallets reliably for signing and transaction flows.",
          "Coordinate state seamlessly across external blockchain RPCs, smart contracts, and media APIs.",
        ],
        contributions: [
          "Led key frontend implementation tracks for the SoundRig web application using React and TypeScript.",
          "Integrated multiple third-party Web3 wallet providers and built transaction flow UI states around smart contract interactions.",
          "Connected high-stakes external APIs with resilient loading, error recovery, and responsive layouts.",
        ],
        technicalApproach:
          "Engineered modular React and TypeScript UI views decoupled from Web3 provider mechanics through dedicated wallet/contract hooks. Asynchronous transaction lifecycles were modeled explicitly so users receive clear feedback during wallet connection, signing, and on-chain confirmation.",
        architecture: [
          {
            layer: "Discovery & Playback UI",
            detail:
              "Dark-mode React + TypeScript interface featuring curated picks, latest releases, personal music libraries, and artist profiles.",
          },
          {
            layer: "Web3 Integration Layer",
            detail:
              "Wallet connection adapters and Web3.js contract interaction utilities handling transaction signing and chain state updates.",
          },
          {
            layer: "Backend & External APIs",
            detail:
              "Platform APIs and PostgreSQL metadata services powering track catalogs, artist profiles, and synchronized ownership views.",
          },
        ],
        challenges: [
          {
            challenge:
              "Coordinating inconsistent latency and edge cases across multiple third-party Web3 wallets and external APIs.",
            solution:
              "Normalized wallet adapter states and implemented explicit pending, confirmed, and recoverable error states throughout the purchase and playback flows.",
          },
        ],
      },
    },
    {
      slug: "hoist-it-solutions",
      index: "05",
      title: "Hoist IT Solutions",
      category: "Enterprise / Digital Transformation",
      filterGroup: "systems",
      tagline:
        "Presenting enterprise software engineering and institutional digital transformation systems.",
      summary:
        "Corporate web platform for Hoist IT Solutions — a digital transformation partner designing institutional ERP platforms, custom business software, systems integration, and cloud infrastructure for universities, polytechnics, and enterprises.",
      featured: true,
      year: "Present",
      role: "Software Engineer",
      organization: "Hoist IT Solutions",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Responsive Architecture",
        "SEO",
      ],
      visualType: "screenshot",
      image: "/images/Captureh.PNG",
      imageAlt:
        "Hoist IT Solutions corporate platform hero showcasing digital transformation systems for institutions and enterprises",
      links: [
        {
          label: "Visit Hoist IT Solutions",
          url: "https://hoistitsolutions.com/",
          kind: "primary",
        },
      ],
      highlights: [
        "Clear positioning across institutional ERP platforms, custom software, cloud infrastructure, and IT consulting",
        "Structured showcase of university and polytechnic transformation ecosystems (Godfrey Okoye University & Marist Polytechnic)",
        "Performance-focused responsive architecture built for institutional decision-makers and enterprise stakeholders",
      ],
      caseStudy: {
        problem:
          "Enterprise technology partners serving universities and corporate organizations must communicate complex multi-module capabilities — ERP, portals, cybersecurity, cloud, and custom software — clearly without overwhelming non-technical decision-makers.",
        objectives: [
          "Present Hoist IT Solutions' institutional platforms and enterprise engineering services with clarity and authority.",
          "Highlight real institutional transformation modules spanning admissions, student portals, staff systems, finance, CBT, and LMS.",
          "Ensure fast page performance, clean information hierarchy, and dependable mobile responsiveness.",
        ],
        contributions: [
          "Engineered the corporate web platform for Hoist IT Solutions from layout architecture to responsive implementation.",
          "Structured service pages and institutional solution breakdowns to articulate unified database-backed ecosystems clearly.",
          "Aligned visual hierarchy, navigation, and performance across desktop and mobile viewports.",
        ],
        technicalApproach:
          "Built with component-driven frontend architecture emphasizing semantic markup, clean content structuring, and crisp responsive grids so institutional leaders can quickly evaluate capabilities and initiate engagements.",
        architecture: [
          {
            layer: "Presentation & Narrative Layer",
            detail:
              "Modular landing and solutions sections articulating institutional ERP ecosystems and enterprise software services.",
          },
          {
            layer: "Solution & Case Showcase",
            detail:
              "Structured breakdowns linking Hoist's modular architecture to real university and polytechnic deployments.",
          },
          {
            layer: "Performance & SEO Foundation",
            detail:
              "Semantic HTML structure, responsive typography, and lightweight asset delivery for reliable browsing across devices.",
          },
        ],
        challenges: [
          {
            challenge:
              "Organizing a wide service catalog (education ERP, corporate custom software, cloud, cybersecurity, AI) into a cohesive user journey.",
            solution:
              "Grouped offerings around two primary tracks — Institutional Platforms and Business Solutions — backed by concise module descriptions and clear calls to action.",
          },
        ],
      },
    },
    {
      slug: "viicsoft",
      index: "06",
      title: "Viicsoft Solutions",
      category: "Technology Agency / Web Platform",
      filterGroup: "fullstack",
      tagline:
        "Digital home for a software agency building AI-driven digital products.",
      summary:
        "Corporate web platform for Viicsoft Solutions, presenting engineering services, industry focus areas, technology capabilities, and case studies for modern web and AI-driven digital products.",
      featured: true,
      year: "2024 — 2025",
      role: "Full-Stack Developer",
      organization: "Viicsoft Solutions",
      technologies: ["React", "JavaScript", "Node.js", "CSS"],
      visualType: "screenshot",
      image: "/images/viicsoft.png",
      imageAlt: "Viicsoft Solutions corporate agency website interface",
      links: [
        {
          label: "Visit Viicsoft Solutions",
          url: "https://viicsoft.dev/",
          kind: "primary",
        },
      ],
      highlights: [
        "Structured agency navigation covering services, industries, technologies, case studies, and insights",
        "Responsive layout translating product showcase visuals cleanly across viewports",
        "Direct consultation booking and client inquiry touchpoints",
      ],
      caseStudy: {
        problem:
          "A growing software engineering agency needed a sharp, credible web presence capable of articulating its full-stack and AI-driven delivery capabilities to prospective clients.",
        objectives: [
          "Showcase agency services, target industries, technical stack, and shipped case studies cleanly.",
          "Provide frictionless paths for prospective clients to explore capabilities and schedule discovery calls.",
        ],
        contributions: [
          "Developed responsive frontend architecture and reusable page sections in React.",
          "Collaborated on service content structure, interactive navigation menus, and production deployment.",
        ],
        technicalApproach:
          "Componentized React implementation designed for maintainability, clear typographic pacing, and straightforward updates as new agency case studies and insights ship.",
        architecture: [
          {
            layer: "Componentized UI",
            detail:
              "Reusable React navigation, showcase blocks, and service sections engineered with modular CSS.",
          },
          {
            layer: "Production Delivery",
            detail:
              "Production web deployment at viicsoft.dev optimized for fast load times across devices.",
          },
        ],
        challenges: [
          {
            challenge:
              "Balancing visual showcase density with fast initial load and readable mobile navigation.",
            solution:
              "Kept layout sections cleanly spaced with streamlined navigation grouping and optimized image presentation.",
          },
        ],
      },
    },
    {
      slug: "crisptv",
      index: "07",
      title: "CrispTV",
      category: "Media & Live Production",
      filterGroup: "fullstack",
      tagline:
        "Live event production showcase for multi-camera broadcast and streaming.",
      summary:
        "Web platform for CrispTV highlighting live event coverage, pre-production planning, multi-camera recording, live streaming, studio shoots, and post-production highlights.",
      featured: false,
      year: "2025",
      role: "Software Developer",
      organization: "CrispTV",
      technologies: ["Next.js", "TypeScript", "Node.js", "CSS"],
      visualType: "screenshot",
      image: "/images/Capturetv.PNG",
      imageAlt: "CrispTV live event production and studio discovery website interface",
      links: [
        {
          label: "Visit CrispTV",
          url: "https://www.crisptv.media/",
          kind: "primary",
        },
      ],
      highlights: [
        "Split-screen production showcase for live concerts, commercial film shoots, and studio sessions",
        "Structured discovery across filming, audio, lighting, editing services, and showreels",
        "Built with Next.js and TypeScript for responsive browsing and client inquiries",
      ],
      caseStudy: {
        problem:
          "Live event production teams depend on visual credibility — prospective clients need immediate proof of production caliber, studio capabilities, and end-to-end coverage scope.",
        objectives: [
          "Present CrispTV's live events, film shoots, studio work, and production services in a crisp split-screen editorial interface.",
          "Enable quick booking inquiries and service discovery for corporate and private event organizers.",
        ],
        contributions: [
          "Built the Next.js and TypeScript web platform, interactive discovery categories, showreel navigation, and service views.",
        ],
        technicalApproach:
          "Designed around visual storytelling paired with categorized service discovery and fast production delivery at crisptv.media.",
        architecture: [
          {
            layer: "Frontend Application",
            detail:
              "Next.js + TypeScript application presenting live event portfolios, studio services, and showreels.",
          },
        ],
        challenges: [
          {
            challenge:
              "Balancing rich full-bleed production visuals with fast browsing across services and studio categories.",
            solution:
              "Used a clean split-screen layout combining editorial hero storytelling on the left with structured service discovery on the right.",
          },
        ],
      },
    },
    {
      slug: "winner-chikezie",
      index: "08",
      title: "Winner Chikezie Portfolio",
      category: "Frontend Engineering",
      filterGroup: "frontend",
      tagline:
        "Minimalist portfolio engineered for a Lead Product Designer.",
      summary:
        "A clean, grid-aligned portfolio website built with Next.js and React to showcase product design case studies, creative playground experiments, and career highlights.",
      featured: false,
      year: "2024",
      role: "Frontend Developer",
      technologies: ["Next.js", "React", "CSS"],
      visualType: "screenshot",
      image: "/images/winner.png",
      imageAlt: "Winner Chikezie Lead Product Designer portfolio homepage",
      links: [
        {
          label: "Visit Live Site",
          url: "https://winnerchikezie.com",
          kind: "primary",
        },
      ],
      highlights: [
        "Faithful translation of designer-authored typography, ruler grid accents, and micro-details",
        "Fast Next.js page transitions across Work, About, Playground, and Resume",
      ],
      caseStudy: {
        problem:
          "Product designers require exact typographic fidelity, subtle spacing rhythm, and crisp responsiveness so their portfolio reflects the quality of their design craft.",
        objectives: [
          "Translate the design specification accurately into production React/Next.js code.",
          "Ensure smooth performance and crisp rendering across desktop and mobile devices.",
        ],
        contributions: [
          "Engineered the complete frontend implementation in Next.js, React, and custom CSS.",
        ],
        technicalApproach:
          "Focused on clean semantic markup, precise spacing tokens, and minimal JavaScript overhead.",
        architecture: [
          {
            layer: "Frontend",
            detail:
              "Next.js application with custom CSS layout grid and modular case study sections.",
          },
        ],
        challenges: [
          {
            challenge:
              "Preserving editorial spacing and grid alignment details across varying screen widths.",
            solution:
              "Used fluid typography and carefully tuned responsive breakpoints to keep proportions balanced.",
          },
        ],
      },
    },
    {
      slug: "crp-church",
      index: "09",
      title: "CRP Church",
      category: "Full Stack / Community Platform",
      filterGroup: "fullstack",
      tagline:
        "Digital platform for the Church of the Resurrection Power, Enugu.",
      summary:
        "Official website for the Church of the Resurrection Power — serving the New Haven Archdeaconry in the Anglican Diocese of Enugu with service information, ministries, sermons, online viewing, and administrative controls.",
      featured: false,
      year: "2024",
      role: "Full-Stack Developer",
      technologies: ["React", "TypeScript", "Python", "CSS"],
      visualType: "screenshot",
      image: "/images/church.PNG",
      imageAlt: "Church of the Resurrection Power website interface",
      links: [
        { label: "Visit CRP Church", url: "https://crpchurch.org", kind: "primary" },
      ],
      highlights: [
        "Public portal for service schedules, ministries, messages, giving, and live watch access",
        "Administrative interface supporting ongoing community content updates",
      ],
      caseStudy: {
        problem:
          "The congregation needed an accessible central hub for weekly schedules, sermon recordings, ministry announcements, and remote participation.",
        objectives: [
          "Provide clear access to service times, online streaming, ministries, and messages.",
          "Include administrative tooling so church staff can publish updates independently.",
        ],
        contributions: [
          "Built the React/TypeScript frontend and Python-backed content management capabilities.",
        ],
        technicalApproach:
          "Combined an accessible, mobile-friendly public site with simple backend administration for non-technical editors.",
        architecture: [
          {
            layer: "Public Portal & Admin",
            detail:
              "React + TypeScript frontend integrated with Python backend services.",
          },
        ],
        challenges: [
          {
            challenge:
              "Making navigation effortless for a multi-generational community largely browsing on mobile.",
            solution:
              "Prioritized high-contrast typography, clear primary actions, and simple top-level navigation.",
          },
        ],
      },
    },
  ] as Project[],

  experiences: [
    {
      id: "hoist-it-solutions",
      company: "Hoist IT Solutions",
      role: "Software Engineer — Institutional & Web Systems",
      // Editable: add your exact start date (e.g. "2025 — Present") when ready
      period: "Current",
      location: "Nigeria · Remote",
      current: true,
      summary:
        "Engineering enterprise web platforms and institutional digital transformation software for higher-education institutions and corporate organizations.",
      contributions: [
        "Built the Hoist IT Solutions corporate platform presenting institutional ERP ecosystems, custom software engineering, and systems integration.",
        "Developed the Marist Polytechnic Student & Admissions Portal supporting ND and AE-FUNAI affiliated degree applications, document uploads, and Matric No onboarding.",
        "Built the Marist Polytechnic Administration Portal for authorized staff and admissions management workflows.",
        "Implemented role-separated navigation, authentication boundaries, and responsive interfaces tailored to institutional scale.",
      ],
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "REST APIs",
        "Institutional Portals",
      ],
      shippedLinks: [
        { label: "Hoist IT Solutions", url: "https://hoistitsolutions.com/" },
        {
          label: "Marist Student Portal",
          url: "https://portal.maristpolytechnic.edu.ng/login",
        },
        {
          label: "Marist Admin Portal",
          url: "https://adminportal.maristpolytechnic.edu.ng/login",
        },
      ],
    },
    {
      id: "godfrey-okoye-university",
      company: "Godfrey Okoye University",
      role: "Software Engineer — University Digital Systems",
      // Editable: add your exact start date when ready
      period: "Current",
      location: "Enugu, Nigeria",
      current: true,
      summary:
        "Building and maintaining Godfrey Okoye University's digital portals, academic library platform, and admissions administration interfaces.",
      contributions: [
        "Built the Godfrey Okoye University Library & Online Learning web portal connecting academic collections, Library Catalogue access, online resources, and the institutional repository.",
        "Developed the Godfrey Okoye University Student & Admissions Portal supporting admission mode selection, online applications, and admission status lookup.",
        "Engineered the Godfrey Okoye University Enterprise Administrative Portal for authorized staff and admissions administration.",
        "Collaborated across institutional ICT workflows to align frontend portals with centralized university services.",
      ],
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "REST APIs",
        "Role-Based Access",
      ],
      shippedLinks: [
        {
          label: "GOUNI Library & Online Learning",
          url: "https://onlinelearning.gouni.edu.ng/",
        },
        {
          label: "GOUNI Student Portal",
          url: "https://goufrontends.vercel.app/",
        },
        {
          label: "GOUNI Admin Portal",
          url: "https://goufrontendadmin.vercel.app/login",
        },
      ],
    },
    {
      id: "crisptv",
      company: "CrispTV",
      role: "Software Developer",
      period: "2025",
      location: "Enugu, Nigeria",
      current: false,
      summary:
        "Led end-to-end engineering of Kuepass, an event management and ticketing platform, alongside CrispTV's live production web platform.",
      contributions: [
        "Led full-stack development of kuepass.com covering event discovery, ticket inventory, checkout flows, and QR-based validation.",
        "Built the event host dashboard for managing multi-tier ticket inventory, transactions, attendee lists, and sales tracking.",
        "Integrated AI-assisted automation across platform operational workflows and built CrispTV's production website (crisptv.media).",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Python",
        "Django REST Framework",
        "PostgreSQL",
      ],
      shippedLinks: [
        { label: "Kuepass", url: "https://kuepass.com" },
        { label: "CrispTV", url: "https://www.crisptv.media/" },
      ],
    },
    {
      id: "viicsoft",
      company: "Viicsoft Solutions",
      role: "Full-Stack Developer",
      period: "2024 — 2025",
      location: "Nigeria · Hybrid",
      current: false,
      summary:
        "Contributed across product architecture, frontend interfaces, backend API development, AI automation, and production deployment for client and in-house software.",
      contributions: [
        "Developed full-stack web applications end-to-end with React, Next.js, TypeScript, Python, and Django REST Framework.",
        "Built and refined Python AI automation workflows powering personalized recipe and meal-planning features on Cookeaze.",
        "Engineered RESTful APIs, integrated third-party services, and delivered the Viicsoft Solutions web platform (viicsoft.dev).",
      ],
      technologies: [
        "Python",
        "Django REST",
        "Next.js",
        "React",
        "Node.js",
        "AI Automation",
      ],
      shippedLinks: [
        { label: "Viicsoft Solutions", url: "https://viicsoft.dev/" },
        { label: "Cookeaze", url: "https://cookeaze.com" },
      ],
    },
    {
      id: "soundrig",
      company: "SoundRig",
      role: "Frontend Developer",
      period: "Oct 2024 — Nov 2025",
      location: "Remote",
      summary:
        "Contributed to the frontend engineering of SoundRig.io, a blockchain-based music platform focused on artist releases and decentralized ownership.",
      contributions: [
        "Built responsive Web3 application views for music discovery, user libraries, and artist onboarding.",
        "Integrated multiple third-party Web3 wallets to handle signing and blockchain transaction flows.",
        "Engineered resilient frontend state management across external blockchain and media APIs.",
      ],
      technologies: ["React", "TypeScript", "Web3.js", "PostgreSQL", "Git"],
      shippedLinks: [{ label: "SoundRig", url: "https://soundrig.io" }],
    },
    {
      id: "genesys-tech-hub",
      company: "Genesys Tech Hub",
      role: "Web Developer (Intern → Contract)",
      period: "Dec 2022 — Dec 2024",
      location: "Enugu, Nigeria",
      summary:
        "Completed an intensive in-person web development internship and was retained as contract staff, building React and TypeScript applications in Agile teams.",
      contributions: [
        "Developed scalable cloud-based web applications using React and TypeScript in collaboration with product designers and backend engineers.",
        "Adopted structured frontend architectural patterns, code reviews, and testing workflows to improve codebase reliability.",
        "Mentored junior interns and participated in cross-team design and technical reviews.",
      ],
      technologies: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
    },
  ] as ExperienceItem[],

  capabilities: [
    {
      index: "01",
      title: "Frontend Engineering",
      summary:
        "Designing clean component architectures and responsive interfaces with strong attention to typography, state clarity, and usability.",
      items: [
        "React & Next.js",
        "TypeScript & Modern JavaScript",
        "State Management (Redux, Zustand)",
        "Responsive Interface Architecture",
        "Component Systems & UI Translation",
        "CSS Modules, Sass & Tailwind CSS",
        "Accessibility & Web Performance",
      ],
    },
    {
      index: "02",
      title: "Backend Engineering",
      summary:
        "Building structured APIs, relational data models, authentication flows, and dependable business logic behind real applications.",
      items: [
        "Python & Django",
        "Django REST Framework",
        "Node.js",
        "REST API Design & Documentation",
        "Authentication & Role-Based Access",
        "Domain Business Logic",
        "Automated Workflows & Task Processing",
      ],
    },
    {
      index: "03",
      title: "Databases & Infrastructure",
      summary:
        "Managing persistent data, containerized environments, CI/CD pipelines, and production web deployments.",
      items: [
        "PostgreSQL",
        "MongoDB & MySQL",
        "Redis",
        "Docker",
        "Git & GitHub Actions (CI/CD)",
        "Production Deployment (Vercel, Netlify, Cloud)",
        "Observability Basics (Prometheus, Grafana)",
      ],
    },
    {
      index: "04",
      title: "AI Automation & Integrations",
      summary:
      "Designing practical AI automation pipelines, intelligent workflows, and third-party integrations that eliminate manual operational bottlenecks.",
      items: [
        "AI Workflow Automation",
        "LLM & Contextual Assistant Integration",
        "Python Automation Pipelines",
        "Process & Operational Automation",
        "Payment Gateway Integrations",
        "Third-Party & External APIs",
        "Institutional Portal & Web3 Systems",
      ],
    },
  ] as CapabilityGroup[],

  about: {
    eyebrow: "ABOUT & AI AUTOMATION",
    heading: "Systems thinking & AI automation.",
    paragraphs: [
      "I'm interested in more than making interfaces look good. I enjoy understanding how systems work, how data moves, how AI automation eliminates repetitive manual work, and how software simplifies real operational problems.",
      "My development journey has evolved from frontend engineering into full-stack development and AI automation — giving me the opportunity to work across user interfaces, APIs, databases, intelligent workflows, integrations, and deployment.",
      "I value practical engineering, continuous learning, maintainable code, and building software and automated systems that serve a genuine purpose.",
    ],
    aiFocus: {
      eyebrow: "CORE SPECIALTY / AI AUTOMATION",
      title: "Practical AI automation built into production software.",
      description:
        "Beyond building web applications, I engineer AI-driven automation that powers real product workflows — from Python-backed culinary intelligence and personalized meal planning in Cookeaze to automated event operations in Kuepass and workflow integrations across business systems.",
      points: [
        "Python-based AI automation pipelines & structured output orchestration",
        "Contextual AI assistants integrated directly into web & mobile interfaces",
        "Automated operational workflows reducing repetitive manual tasks",
      ],
    },
    approachNote:
    "Whether shipping an AI-automated workflow, an event ticketing engine, or a university administrative portal, I focus on clarity of architecture, dependable behavior in edge cases, and interfaces people can trust.",
    credentials: [
      {
        title: "B.Sc. Biochemistry",
        issuer: "Ambrose Alli University, Ekpoma",
        date: "2013 — 2017",
        detail: "Analytical foundation in structured research, precision, and empirical problem solving.",
      },
      {
        title: "Codename: Learnable Internship (Frontend)",
        issuer: "Genesys Tech Hub",
        date: "June 2024",
        detail: "9-month collaborative engineering cohort focused on React, JavaScript, and production team delivery.",
        certificateImage: "/images/genesys.png",
      },
      {
        title: "Legacy JavaScript Algorithms & Data Structures",
        issuer: "freeCodeCamp",
        date: "November 2024",
        detail: "300-hour verified curriculum covering ES6+, algorithmic problem solving, and data structures.",
        url: "https://www.freecodecamp.org/certification/Ebuka_0racle/javascript-algorithms-and-data-structures",
        certificateImage: "/images/free.PNG",
      },
    ] as CredentialItem[],
  },

  contact: {
    eyebrow: "CONTACT",
    heading: "Let's build something meaningful.",
    description:
      "Open to software engineering opportunities, collaborations, and interesting projects.",
    email: "emmanuel.henry71@gmail.com",
    phone: "+234 703 240 1339",
    phoneHref: "tel:+2347032401339",
    github: "https://github.com/chchukwuebuka",
    linkedin: "https://www.linkedin.com/in/chukwuebuka-egwuete",
    twitter: "https://x.com/Ebuka__042",
    instagram: "https://www.instagram.com/oracle_e_",
  },

  nav: [
    { id: "work", label: "Work", href: "/#work" },
    { id: "about", label: "About", href: "/#about" },
    { id: "experience", label: "Experience", href: "/#experience" },
    { id: "contact", label: "Contact", href: "/#contact" },
  ],
};

export const featuredProjects = portfolioData.projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return portfolioData.projects.find((p) => p.slug === slug);
}
