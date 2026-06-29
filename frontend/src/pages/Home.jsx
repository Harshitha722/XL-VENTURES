import { Link } from "react-router-dom";
import {
  ArrowRight,
  Activity,
  BarChart3,
  BookOpen,
  ClipboardList,
  Database,
  FileText,
  Layers,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import heroArt from "../assets/hero.png";

const signalSources = [
  { icon: Mail, label: "Email threads" },
  { icon: MessageCircle, label: "Meeting transcripts" },
  { icon: ClipboardList, label: "CRM history" },
  { icon: FileText, label: "Contracts" },
  { icon: ShieldCheck, label: "SLA policies" },
  { icon: BookOpen, label: "Playbooks" },
  { icon: Database, label: "Support tickets" },
  { icon: Layers, label: "Product docs" },
];

const features = [
  {
    icon: Sparkles,
    title: "Agentic account intelligence",
    text: "DecisionMesh AI turns scattered enterprise signals into prioritized renewal, expansion, and risk decisions.",
  },
  {
    icon: Database,
    title: "Enterprise memory layer",
    text: "Every interaction, policy, contract term, and playbook becomes a governed decision asset.",
  },
  {
    icon: ShieldCheck,
    title: "Explainable recommendations",
    text: "Teams see the evidence, confidence, and business reasoning behind each next best action.",
  },
  {
    icon: Activity,
    title: "Health and risk detection",
    text: "Surface churn signals, adoption gaps, escalation patterns, and expansion opportunities earlier.",
  },
  {
    icon: Users,
    title: "Human-in-the-loop control",
    text: "Customer-facing teams keep approval authority while the platform accelerates preparation and follow-up.",
  },
  {
    icon: LockKeyhole,
    title: "Enterprise-ready operating model",
    text: "Designed around traceability, repeatable workflows, and consistent customer success standards.",
  },
];

const impactMetrics = [
  { value: "30%", label: "lower churn exposure", detail: "Risk signals detected before renewal windows close." },
  { value: "25%", label: "higher renewal conversion", detail: "Account plans align to contracts, sentiment, and usage." },
  { value: "40%", label: "faster decision cycles", detail: "CSMs move from investigation to next action faster." },
  { value: "35%", label: "productivity lift", detail: "Manual research becomes structured account intelligence." },
];

const trustSignals = ["SOC-ready controls", "Human approval", "Evidence-linked actions", "Revenue team workflows"];

const audiences = [
  { title: "CS Leaders", text: "Standardize renewal strategy and account risk reviews." },
  { title: "Account Managers", text: "Prepare customer conversations with complete context." },
  { title: "RevOps Teams", text: "Turn qualitative signals into measurable operating rhythm." },
  { title: "Support Leaders", text: "Connect escalations with customer health and retention." },
];

const outcomeSteps = [
  "Detect renewal risk",
  "Retrieve account context",
  "Recommend next action",
  "Explain the evidence",
  "Capture feedback",
];

function Home() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" to="/">
          <div className="brand-mark">DM</div>
          <div>
            <p>DecisionMesh AI</p>
            <span>Enterprise Decision Intelligence Platform</span>
          </div>
        </Link>
        <nav className="landing-nav" aria-label="Primary navigation">
          <a href="#platform">Platform</a>
          <a href="#knowledge">Knowledge</a>
          <a href="#features">Features</a>
          <a href="#outcomes">Outcomes</a>
          <Link to="/login">Login</Link>
          <Link className="btn btn-primary" to="/dashboard">
            Launch Dashboard
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="home">
          <img className="hero-platform-art" src={heroArt} alt="" aria-hidden="true" />
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="eyebrow">Enterprise Decision Intelligence Platform</p>
              <h1>DecisionMesh AI</h1>
              <p className="hero-subtitle">
                Planner-based intelligence for governed, explainable enterprise decisions.
              </p>
              <p className="hero-text">
                DecisionMesh AI unifies CRM context, conversations, contracts, policies, playbooks, memory, and
                reviewer governance into one explainable workspace for confident next best actions.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-lg" to="/dashboard">
                  Launch Dashboard <ArrowRight size={18} />
                </Link>
                <a className="btn btn-secondary btn-lg" href="#outcomes">
                  View Business Impact
                </a>
              </div>
              <div className="trust-row" aria-label="Enterprise trust signals">
                {trustSignals.map((signal) => (
                  <span key={signal}>
                    <ShieldCheck size={15} />
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <aside className="product-preview" aria-label="DecisionMesh AI product preview">
              <div className="preview-toolbar">
                <span />
                <span />
                <span />
                <strong>Revenue Command Center</strong>
              </div>
              <div className="preview-body">
                <div className="preview-main">
                  <div className="preview-alert">
                    <span>Priority account</span>
                    <strong>Northstar Health</strong>
                    <p>Renewal risk elevated by adoption drop, open escalation, and unresolved SLA concern.</p>
                  </div>
                  <div className="preview-recommendation">
                    <span>Recommended action</span>
                    <strong>Schedule executive success review</strong>
                    <p>Attach product adoption plan and confirm service remediation owner.</p>
                  </div>
                </div>
                <div className="preview-side">
                  <div>
                    <span>Confidence</span>
                    <strong>91%</strong>
                  </div>
                  <div>
                    <span>Evidence</span>
                    <strong>8 sources</strong>
                  </div>
                  <div>
                    <span>Impact</span>
                    <strong>$420K ARR</strong>
                  </div>
                </div>
              </div>
              <div className="preview-footer">
                <span>Contract</span>
                <span>CRM</span>
                <span>Support</span>
                <span>Playbooks</span>
              </div>
            </aside>
          </div>

          <div className="hero-proof-grid" aria-label="Platform capabilities">
            <article>
              <BarChart3 size={22} />
              <span>Signal Intelligence</span>
              <strong>360 degree customer context</strong>
            </article>
            <article>
              <ShieldCheck size={22} />
              <span>Explainability</span>
              <strong>Evidence-backed actions</strong>
            </article>
            <article>
              <TrendingUp size={22} />
              <span>Revenue Outcomes</span>
              <strong>Retention and expansion focus</strong>
            </article>
          </div>
        </section>

        <section className="section section-grid" id="platform">
          <div className="section-intro">
            <p className="eyebrow">The Operating Challenge</p>
            <h2>Customer success teams are making revenue decisions with fragmented context.</h2>
            <p>
              Critical renewal signals live across conversations, systems, documents, policies, and account history.
              DecisionMesh AI brings those signals into a trusted operating layer for the entire post-sales organization.
            </p>
          </div>
          <div className="problem-grid">
            {signalSources.map(({ icon: Icon, label }) => (
              <div className="info-card" key={label}>
                <Icon size={20} />
                <h3>{label}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="section audience-section" aria-label="Teams DecisionMesh AI supports">
          <div className="section-intro">
            <p className="eyebrow">Built For Revenue Teams</p>
            <h2>One operating surface for the teams responsible for customer outcomes.</h2>
          </div>
          <div className="audience-grid">
            {audiences.map((audience) => (
              <article className="audience-card" key={audience.title}>
                <h3>{audience.title}</h3>
                <p>{audience.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section knowledge-section" id="knowledge">
          <div className="section-intro">
            <p className="eyebrow">Enterprise Knowledge</p>
            <h2>One enterprise memory for every customer decision.</h2>
            <p>
              DecisionMesh AI connects account activity with institutional knowledge so recommendations are grounded in
              business policy, contractual commitments, product guidance, and proven customer success motion.
            </p>
          </div>
          <div className="knowledge-layout">
            <div className="knowledge-panel">
              <div className="knowledge-row">
                <span>Account context</span>
                <strong>CRM notes, adoption history, executive sentiment</strong>
              </div>
              <div className="knowledge-row">
                <span>Commercial truth</span>
                <strong>Renewal dates, contract clauses, SLA commitments</strong>
              </div>
              <div className="knowledge-row">
                <span>Company knowledge</span>
                <strong>Playbooks, policies, product docs, FAQs</strong>
              </div>
              <div className="knowledge-row">
                <span>Decision memory</span>
                <strong>Prior recommendations, approvals, outcomes, feedback</strong>
              </div>
            </div>
            <div className="knowledge-grid">
              {signalSources.map(({ icon: Icon, label }) => (
                <div className="source-card" key={label}>
                  <Icon size={18} />
                  <h4>{label}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section outcome-section">
          <div className="section-intro">
            <p className="eyebrow">Customer-Facing Motion</p>
            <h2>From scattered signals to an explainable revenue decision.</h2>
          </div>
          <div className="outcome-strip">
            {outcomeSteps.map((step, index) => (
              <div className="outcome-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="features">
          <div className="section-intro">
            <p className="eyebrow">Platform Features</p>
            <h2>Built for enterprise customer success teams that own revenue outcomes.</h2>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text }) => (
              <article className="feature-card" key={title}>
                <Icon size={22} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section stats-section" id="outcomes">
          <div className="section-intro">
            <p className="eyebrow">Metric Features</p>
            <h2>Executive-ready visibility into customer success performance.</h2>
            <p>
              Track the operating metrics that matter: churn exposure, renewal confidence, response velocity, and team
              productivity from one polished revenue command center.
            </p>
          </div>
          <div className="stats-grid">
            {impactMetrics.map((metric, index) => (
              <article className={`stat-card ${index === 0 ? "featured" : ""}`} key={metric.label}>
                <span>{metric.label}</span>
                <h3>{metric.value}</h3>
                <p>{metric.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section compare-section">
          <div className="section-intro">
            <p className="eyebrow">Why DecisionMesh AI</p>
            <h2>A decision platform, not a chatbot.</h2>
          </div>
          <div className="comparison-table">
            <div className="table-column">
              <h4>Traditional CS workflows</h4>
              <ul>
                <li>Manual account research</li>
                <li>Scattered knowledge and policy lookup</li>
                <li>Inconsistent risk interpretation</li>
                <li>Limited decision traceability</li>
              </ul>
            </div>
            <div className="table-column highlight">
              <h4>DecisionMesh AI</h4>
              <ul>
                <li>Unified enterprise customer memory</li>
                <li>Evidence-backed next best actions</li>
                <li>Consistent reasoning across accounts</li>
                <li>Human approval with learning feedback</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section cta-section">
          <div className="cta-card">
            <p className="eyebrow">Go To Market Ready</p>
            <h2>Turn customer knowledge into revenue action.</h2>
            <p>
              Give customer success, account management, and revenue leaders one intelligent workspace for renewals,
              risk, expansion, and executive-ready account decisions.
            </p>
            <Link className="btn btn-primary btn-lg" to="/dashboard">
              Launch Dashboard <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div>
          <strong>DecisionMesh AI</strong>
          <p>Enterprise Decision Intelligence Platform</p>
        </div>
        <div>
          <p>Built for post-sales revenue teams</p>
          <p>Renewals, retention, expansion, and account intelligence</p>
        </div>
        <div>
          <p>(c) 2026 DecisionMesh AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
