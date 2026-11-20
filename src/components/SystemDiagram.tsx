import styles from "./SystemDiagram.module.css";

/**
 * Calm, Swiss-editorial architectural systems topology rendered in the Hero right column.
 */
export const HeroArchitectureVisual = () => (
  <div className={styles.heroVisual} aria-hidden="true">
    <div className={styles.heroVisualHeader}>
      <span>SYS / ARCHITECTURE</span>
      <span style={{ color: "var(--accent)" }}>01 — 04</span>
    </div>

    <svg
      className={styles.heroVisualSvg}
      viewBox="0 0 380 310"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vertical Spine */}
      <line x1="68" y1="32" x2="68" y2="278" stroke="#222222" strokeWidth="1" />
      <line x1="190" y1="32" x2="190" y2="278" stroke="#1E1E1E" strokeWidth="1" strokeDasharray="3 5" />

      {/* Layer 01 — Client Interfaces */}
      <g data-hero-layer>
        <rect x="34" y="24" width="312" height="52" rx="4" fill="#0E0E0E" stroke="#262626" />
        <circle cx="56" cy="50" r="3.5" fill="#B89A6A" />
        <text x="74" y="45" fill="#F4F2EE" fontSize="11.5" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          CLIENT INTERFACES
        </text>
        <text x="74" y="62" fill="#787878" fontSize="10" fontFamily="Geist, sans-serif">
          React · Next.js · TypeScript · Portals
        </text>
        <text x="328" y="53" fill="#707070" fontSize="10" textAnchor="end" fontFamily="Geist, sans-serif">
          01
        </text>
      </g>

      {/* Connector 1 -> 2 */}
      <line x1="190" y1="76" x2="190" y2="98" stroke="#333333" strokeWidth="1" />
      <circle cx="190" cy="87" r="2" fill="#B89A6A" />

      {/* Layer 02 — Application & API Layer */}
      <g data-hero-layer>
        <rect x="34" y="98" width="312" height="52" rx="4" fill="#0E0E0E" stroke="#262626" />
        <circle cx="56" cy="124" r="3.5" fill="#F4F2EE" />
        <text x="74" y="119" fill="#F4F2EE" fontSize="11.5" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          API &amp; DOMAIN SERVICES
        </text>
        <text x="74" y="136" fill="#787878" fontSize="10" fontFamily="Geist, sans-serif">
          Python · Django REST · Node.js · Auth &amp; RBAC
        </text>
        <text x="328" y="127" fill="#707070" fontSize="10" textAnchor="end" fontFamily="Geist, sans-serif">
          02
        </text>
      </g>

      {/* Connector 2 -> 3 */}
      <line x1="190" y1="150" x2="190" y2="172" stroke="#333333" strokeWidth="1" />

      {/* Layer 03 — Data & Integrations (Split) */}
      <g data-hero-layer>
        <rect x="34" y="172" width="148" height="56" rx="4" fill="#0E0E0E" stroke="#262626" />
        <text x="48" y="195" fill="#F4F2EE" fontSize="11" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          DATA LAYER
        </text>
        <text x="48" y="213" fill="#787878" fontSize="9.5" fontFamily="Geist, sans-serif">
          PostgreSQL · Redis
        </text>

        <rect x="198" y="172" width="148" height="56" rx="4" fill="#0E0E0E" stroke="#262626" />
        <text x="212" y="195" fill="#F4F2EE" fontSize="11" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          INTEGRATIONS
        </text>
        <text x="212" y="213" fill="#787878" fontSize="9.5" fontFamily="Geist, sans-serif">
          Payments · AI · Web3
        </text>

        {/* Horizontal bridge between split nodes */}
        <line x1="182" y1="200" x2="198" y2="200" stroke="#B89A6A" strokeWidth="1" />
      </g>

      {/* Connectors 3 -> 4 */}
      <line x1="108" y1="228" x2="108" y2="248" stroke="#333333" strokeWidth="1" />
      <line x1="272" y1="228" x2="272" y2="248" stroke="#333333" strokeWidth="1" />

      {/* Layer 04 — Production Delivery */}
      <g data-hero-layer>
        <rect x="34" y="248" width="312" height="44" rx="4" fill="#0B0B0B" stroke="#222222" />
        <circle cx="56" cy="270" r="3" fill="#B89A6A" />
        <text x="74" y="274" fill="#A1A1A1" fontSize="10.5" fontFamily="Geist, sans-serif" letterSpacing="0.06em">
          PRODUCTION DEPLOYMENT · RELIABLE OPERATIONS
        </text>
      </g>
    </svg>

    <div className={styles.heroVisualMeta}>
      <div className={styles.metaCell}>
        <span className={styles.metaKey}>Primary Stack</span>
        <span className={styles.metaVal}>TypeScript · React · Django</span>
      </div>
      <div className={styles.metaCell}>
        <span className={styles.metaKey}>Base</span>
        <span className={styles.metaVal}>Enugu, NG · Remote</span>
      </div>
    </div>
  </div>
);

/**
 * Honest architectural plate for University Systems (Marist Polytechnic & Godfrey Okoye University).
 */
export const UniversitySystemsPlate = () => (
  <div className={styles.plate} role="img" aria-label="University digital infrastructure architecture connecting admissions, student portals, administrative portals, and online learning">
    <div className={styles.plateHeader}>
      <span className={styles.plateTag}>
        <span className={styles.plateDot} />
        INSTITUTIONAL INFRASTRUCTURE BLUEPRINT
      </span>
      <span>EDTECH / ERP</span>
    </div>

    <div className={styles.plateSvgWrap}>
      <svg
        className={styles.plateSvg}
        viewBox="0 0 640 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Row: Public & Student Surfaces */}
        <rect x="20" y="18" width="182" height="78" rx="4" fill="#1A1A1A" stroke="#333333" />
        <text x="36" y="42" fill="#B89A6A" fontSize="9.5" fontFamily="Geist, sans-serif" letterSpacing="0.1em">
          01 / SELF-SERVICE
        </text>
        <text x="36" y="62" fill="#F4F2EE" fontSize="13.5" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          Student Portals
        </text>
        <text x="36" y="80" fill="#8C8C8C" fontSize="10.5" fontFamily="Geist, sans-serif">
          Registration · Fees · Records
        </text>

        <rect x="229" y="18" width="182" height="78" rx="4" fill="#1A1A1A" stroke="#333333" />
        <text x="245" y="42" fill="#B89A6A" fontSize="9.5" fontFamily="Geist, sans-serif" letterSpacing="0.1em">
          02 / AUTHORIZED STAFF
        </text>
        <text x="245" y="62" fill="#F4F2EE" fontSize="13.5" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          Admin Portals
        </text>
        <text x="245" y="80" fill="#8C8C8C" fontSize="10.5" fontFamily="Geist, sans-serif">
          Admissions · RBAC · Approvals
        </text>

        <rect x="438" y="18" width="182" height="78" rx="4" fill="#1A1A1A" stroke="#333333" />
        <text x="454" y="42" fill="#B89A6A" fontSize="9.5" fontFamily="Geist, sans-serif" letterSpacing="0.1em">
          03 / COURSEWARE
        </text>
        <text x="454" y="62" fill="#F4F2EE" fontSize="13.5" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          Online Learning
        </text>
        <text x="454" y="80" fill="#8C8C8C" fontSize="10.5" fontFamily="Geist, sans-serif">
          UG · PG · ICT · Sandwich LMS
        </text>

        {/* Connecting Vertical & Horizontal Bus */}
        <line x1="111" y1="96" x2="111" y2="132" stroke="#3B3B3B" strokeWidth="1.2" />
        <line x1="320" y1="96" x2="320" y2="152" stroke="#B89A6A" strokeWidth="1.2" />
        <line x1="529" y1="96" x2="529" y2="132" stroke="#3B3B3B" strokeWidth="1.2" />
        <line x1="111" y1="132" x2="529" y2="132" stroke="#3B3B3B" strokeWidth="1.2" />
        <circle cx="320" cy="132" r="3.5" fill="#B89A6A" />

        {/* Middle Unified API Bus */}
        <rect x="80" y="152" width="480" height="54" rx="4" fill="#161616" stroke="#3A3A3A" />
        <circle cx="104" cy="179" r="3.5" fill="#B89A6A" />
        <text x="120" y="176" fill="#F4F2EE" fontSize="12.5" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          UNIFIED INSTITUTIONAL API &amp; AUTHENTICATION LAYER
        </text>
        <text x="120" y="193" fill="#8C8C8C" fontSize="10.5" fontFamily="Geist, sans-serif">
          Role-Based Access · Academic Workflows · Payment Reconciliation · Data Integrity
        </text>

        {/* Bottom Institutions */}
        <line x1="196" y1="206" x2="196" y2="232" stroke="#353535" strokeWidth="1.2" />
        <line x1="444" y1="206" x2="444" y2="232" stroke="#353535" strokeWidth="1.2" />

        <rect x="64" y="232" width="246" height="52" rx="4" fill="#181818" stroke="#2B2B2B" />
        <text x="82" y="254" fill="#F4F2EE" fontSize="12" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          Marist Polytechnic, Enugu
        </text>
        <text x="82" y="271" fill="#7A7A7A" fontSize="10" fontFamily="Geist, sans-serif">
          portal.maristpolytechnic.edu.ng · adminportal
        </text>

        <rect x="330" y="232" width="246" height="52" rx="4" fill="#181818" stroke="#2B2B2B" />
        <text x="348" y="254" fill="#F4F2EE" fontSize="12" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          Godfrey Okoye University
        </text>
        <text x="348" y="271" fill="#7A7A7A" fontSize="10" fontFamily="Geist, sans-serif">
          onlinelearning.gouni.edu.ng · student &amp; admin apps
        </text>
      </svg>
    </div>

    <div className={styles.plateFooter}>
      <div className={styles.plateInstitutions}>
        <span>Marist Polytechnic</span>
        <span>·</span>
        <span>Godfrey Okoye University</span>
      </div>
      <span>Delivered via Hoist IT Solutions</span>
    </div>
  </div>
);

/**
 * Honest architectural plate for Hoist IT Solutions corporate & transformation platform.
 */
export const HoistPlatformPlate = () => (
  <div className={styles.plate} role="img" aria-label="Hoist IT Solutions digital transformation and institutional technology platform architecture">
    <div className={styles.plateHeader}>
      <span className={styles.plateTag}>
        <span className={styles.plateDot} />
        ENTERPRISE TRANSFORMATION PLATFORM
      </span>
      <span>HOISTITSOLUTIONS.COM</span>
    </div>

    <div className={styles.plateSvgWrap}>
      <svg
        className={styles.plateSvg}
        viewBox="0 0 640 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Main Block */}
        <rect x="20" y="22" width="286" height="150" rx="4" fill="#1A1A1A" stroke="#333333" />
        <text x="38" y="48" fill="#B89A6A" fontSize="9.5" fontFamily="Geist, sans-serif" letterSpacing="0.12em">
          TRACK 01 / INSTITUTIONS
        </text>
        <text x="38" y="74" fill="#F4F2EE" fontSize="16" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          University &amp; School ERP
        </text>
        <line x1="38" y1="90" x2="288" y2="90" stroke="#2A2A2A" />
        <text x="38" y="114" fill="#A1A1A1" fontSize="11" fontFamily="Geist, sans-serif">
          • Online Admissions &amp; Onboarding
        </text>
        <text x="38" y="134" fill="#A1A1A1" fontSize="11" fontFamily="Geist, sans-serif">
          • Student, Staff &amp; Finance Portals
        </text>
        <text x="38" y="154" fill="#A1A1A1" fontSize="11" fontFamily="Geist, sans-serif">
          • CBT, LMS &amp; Hostel Management
        </text>

        {/* Right Main Block */}
        <rect x="334" y="22" width="286" height="150" rx="4" fill="#1A1A1A" stroke="#333333" />
        <text x="352" y="48" fill="#B89A6A" fontSize="9.5" fontFamily="Geist, sans-serif" letterSpacing="0.12em">
          TRACK 02 / ENTERPRISE
        </text>
        <text x="352" y="74" fill="#F4F2EE" fontSize="16" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          Custom Business Systems
        </text>
        <line x1="352" y1="90" x2="602" y2="90" stroke="#2A2A2A" />
        <text x="352" y="114" fill="#A1A1A1" fontSize="11" fontFamily="Geist, sans-serif">
          • Workflow-Specific Web Software
        </text>
        <text x="352" y="134" fill="#A1A1A1" fontSize="11" fontFamily="Geist, sans-serif">
          • Systems Integration &amp; Cloud Setup
        </text>
        <text x="352" y="154" fill="#A1A1A1" fontSize="11" fontFamily="Geist, sans-serif">
          • Data Analytics, Security &amp; AI
        </text>

        {/* Bridge */}
        <line x1="306" y1="97" x2="334" y2="97" stroke="#B89A6A" strokeWidth="1.2" />

        {/* Bottom Unified Ecosystem Bar */}
        <line x1="163" y1="172" x2="163" y2="202" stroke="#363636" strokeWidth="1.2" />
        <line x1="477" y1="172" x2="477" y2="202" stroke="#363636" strokeWidth="1.2" />

        <rect x="20" y="202" width="600" height="58" rx="4" fill="#161616" stroke="#2E2E2E" />
        <circle cx="44" cy="231" r="3.5" fill="#B89A6A" />
        <text x="60" y="227" fill="#F4F2EE" fontSize="12.5" fontFamily="Space Grotesk, sans-serif" fontWeight="500">
          HOIST IT SOLUTIONS — DIGITAL TRANSFORMATION PARTNER
        </text>
        <text x="60" y="245" fill="#848484" fontSize="10.5" fontFamily="Geist, sans-serif">
          Unified Databases · Long-Term Production Support · Lagos &amp; Enugu, Nigeria
        </text>
      </svg>
    </div>

    <div className={styles.plateFooter}>
      <span>Institutional &amp; Enterprise Web Platform</span>
      <span>Live at hoistitsolutions.com</span>
    </div>
  </div>
);
