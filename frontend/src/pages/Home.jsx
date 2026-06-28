import { Link } from "react-router-dom";
import {
  ArrowRight,
  GitBranch,
  Sparkles,
  Layers,
  Activity,
  ClipboardList,
  FileText,
  Mail,
  MessageCircle,
  Database,
  ShieldCheck,
  Terminal,
  BookOpen,
  Shield,
  CheckCircle,
} from "lucide-react";

function Home() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <div className="brand-mark">RA</div>
          <div>
            <p>RenewAI</p>
            <span>Agentic Decision Intelligence</span>
          </div>
        </div>
        <nav className="landing-nav">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#solution">Architecture</a>
          <a href="/dashboard">Dashboard</a>
          <Link to="/login">Login</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <GitBranch size={16} /> GitHub
          </a>
          <Link className="btn btn-primary" to="/dashboard">
            Launch Dashboard
          </Link>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-copy">
          <div className="eyebrow">Agentic Customer Success Intelligence</div>
          <h1>RenewAI</h1>
          <p className="hero-subtitle">
            Agentic Customer Success & Contract Intelligence Platform
          </p>
          <p className="hero-text">
            RenewAI is an Agentic Decision Intelligence Platform that analyzes customer interactions,
            retrieves enterprise knowledge, reasons across multiple business signals, and recommends
            explainable Next Best Actions to Customer Success Managers.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/dashboard">
              Launch Dashboard
            </Link>
            <a className="btn btn-secondary" href="#solution">
              View Architecture
            </a>
          </div>
          <div className="hero-chips">
            <span>Multi-Agent reasoning</span>
            <span>Explainable recommendations</span>
            <span>Enterprise RAG knowledge</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-header">
              <span>AI Workflow Preview</span>
              <div className="status-pill">Live</div>
            </div>
            <div className="visual-body">
              <div className="workflow-step">
                <Sparkles size={20} />
                <div>
                  <strong>Customer Interaction</strong>
                  <p>Captured from email, transcripts, CRM & contracts.</p>
                </div>
              </div>
              <div className="workflow-branch">
                <div />
              </div>
              <div className="workflow-grid">
                <article>
                  <h4>Planner Agent</h4>
                  <p>Orchestrates specialized reasoning agents.</p>
                </article>
                <article>
                  <h4>Knowledge Agent</h4>
                  <p>Retrieves enterprise playbooks and policies via RAG.</p>
                </article>
                <article>
                  <h4>Contract Agent</h4>
                  <p>Extracts SLA, renewal dates and risk triggers.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-grid" id="problem">
        <div className="section-intro">
          <p className="eyebrow">The Problem</p>
          <h2>Customer information is scattered across systems.</h2>
          <p>Disjoint data and manual workflows leave opportunities unnoticed and renewals at risk.</p>
        </div>
        <div className="problem-grid">
          <div className="info-card">
            <Mail size={20} />
            <h3>Emails</h3>
          </div>
          <div className="info-card">
            <MessageCircle size={20} />
            <h3>Meeting transcripts</h3>
          </div>
          <div className="info-card">
            <ClipboardList size={20} />
            <h3>CRM Notes</h3>
          </div>
          <div className="info-card">
            <FileText size={20} />
            <h3>Contracts</h3>
          </div>
          <div className="info-card">
            <Database size={20} />
            <h3>Support tickets</h3>
          </div>
          <div className="info-card">
            <BookOpen size={20} />
            <h3>Playbooks</h3>
          </div>
          <div className="info-card">
            <ShieldCheck size={20} />
            <h3>Policies</h3>
          </div>
          <div className="info-card">
            <Shield size={20} />
            <h3>FAQs</h3>
          </div>
        </div>
      </section>

      <section className="section" id="solution">
        <div className="section-intro">
          <p className="eyebrow">How RenewAI Solves It</p>
          <h2>End-to-end agentic workflow for explainable customer success.</h2>
        </div>
        <div className="flow-diagram">
          <div className="flow-node">Customer Interaction</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-node accent">Planner Agent</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-group">
            <div className="flow-col">
              <div className="flow-node">Customer Health Agent</div>
              <div className="flow-node">CRM Context Agent</div>
            </div>
            <div className="flow-col">
              <div className="flow-node">Contract Agent</div>
              <div className="flow-node">Knowledge Agent (RAG)</div>
            </div>
          </div>
          <div className="flow-arrow">↓</div>
          <div className="flow-node">Business Reasoning Agent</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-node">Recommendation Agent</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-node">Human Review</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-node">Memory</div>
        </div>
      </section>

      <section className="section" id="agents">
        <div className="section-intro">
          <p className="eyebrow">Agent Intelligence</p>
          <h2>Specialized agents working together.</h2>
        </div>
        <div className="agent-grid">
          <article className="agent-card">
            <Sparkles size={20} />
            <h3>Planner Agent</h3>
            <p>Determines which specialized agents should execute.</p>
          </article>
          <article className="agent-card">
            <Layers size={20} />
            <h3>Knowledge Agent</h3>
            <p>Uses RAG to retrieve relevant playbooks, policies, FAQs and docs.</p>
          </article>
          <article className="agent-card">
            <Activity size={20} />
            <h3>Customer Health Agent</h3>
            <p>Analyzes health score, adoption, and engagement signals.</p>
          </article>
          <article className="agent-card">
            <ClipboardList size={20} />
            <h3>Contract Agent</h3>
            <p>Extracts renewal dates, SLA clauses and contract details.</p>
          </article>
          <article className="agent-card">
            <ShieldCheck size={20} />
            <h3>Business Reasoning Agent</h3>
            <p>Combines knowledge and context to identify risks and opportunities.</p>
          </article>
          <article className="agent-card">
            <ArrowRight size={20} />
            <h3>Recommendation Agent</h3>
            <p>Generates prioritized Next Best Actions.</p>
          </article>
          <article className="agent-card">
            <CheckCircle size={20} />
            <h3>Explanation Agent</h3>
            <p>Provides supporting evidence and confidence scores.</p>
          </article>
          <article className="agent-card">
            <Terminal size={20} />
            <h3>Memory Agent</h3>
            <p>Learns from past interactions and human feedback.</p>
          </article>
        </div>
      </section>

      <section className="section section-grid" id="knowledge">
        <div className="section-intro">
          <p className="eyebrow">Enterprise Knowledge</p>
          <h2>All business signals in one enterprise memory.</h2>
        </div>
        <div className="knowledge-grid">
          <div className="source-card">
            <Mail size={18} />
            <h4>Emails</h4>
          </div>
          <div className="source-card">
            <MessageCircle size={18} />
            <h4>Meeting Transcripts</h4>
          </div>
          <div className="source-card">
            <ClipboardList size={18} />
            <h4>CRM Notes</h4>
          </div>
          <div className="source-card">
            <FileText size={18} />
            <h4>Contracts</h4>
          </div>
          <div className="source-card">
            <Shield size={18} />
            <h4>Support Tickets</h4>
          </div>
          <div className="source-card">
            <BookOpen size={18} />
            <h4>Playbooks</h4>
          </div>
          <div className="source-card">
            <BookOpen size={18} />
            <h4>Product Documentation</h4>
          </div>
          <div className="source-card">
            <ShieldCheck size={18} />
            <h4>FAQs</h4>
          </div>
          <div className="source-card">
            <Layers size={18} />
            <h4>Policies</h4>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-intro">
          <p className="eyebrow">Platform Features</p>
          <h2>Designed for enterprise customer success.</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <Sparkles size={22} />
            <h3>Dynamic Planner-Based Orchestration</h3>
            <p>Agent workflow adapts to every customer signal and business priority.</p>
          </article>
          <article className="feature-card">
            <Layers size={22} />
            <h3>Enterprise Knowledge Retrieval (RAG)</h3>
            <p>Finds and cites the right enterprise playbooks and policies instantly.</p>
          </article>
          <article className="feature-card">
            <ShieldCheck size={22} />
            <h3>Business Reasoning</h3>
            <p>Resolves risk, renewal, and upsell decisions with multi-agent logic.</p>
          </article>
          <article className="feature-card">
            <Activity size={22} />
            <h3>Explainable AI</h3>
            <p>Recommendations come with evidence, confidence, and action context.</p>
          </article>
          <article className="feature-card">
            <CheckCircle size={22} />
            <h3>Human-in-the-Loop Review</h3>
            <p>Customer success managers keep control with approval and feedback.</p>
          </article>
          <article className="feature-card">
            <Database size={22} />
            <h3>Shared Memory</h3>
            <p>Continuous learning from interactions, outcomes, and human updates.</p>
          </article>
        </div>
      </section>

      <section className="section stats-section">
        <div className="section-intro">
          <p className="eyebrow">Business Impact</p>
          <h2>Transform customer success outcomes with agentic intelligence.</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>30%</h3>
            <p>Reduction in Customer Churn</p>
          </div>
          <div className="stat-card">
            <h3>25%</h3>
            <p>Higher Renewal Success</p>
          </div>
          <div className="stat-card">
            <h3>40%</h3>
            <p>Faster Decision Making</p>
          </div>
          <div className="stat-card">
            <h3>35%</h3>
            <p>Increase in Customer Success Productivity</p>
          </div>
        </div>
      </section>

      <section className="section" id="technology">
        <div className="section-intro">
          <p className="eyebrow">Technology Stack</p>
          <h2>Built with modern AI and enterprise tooling.</h2>
        </div>
        <div className="tech-grid">
          <div className="tech-card">React</div>
          <div className="tech-card">Node.js</div>
          <div className="tech-card">Express</div>
          <div className="tech-card">MongoDB</div>
          <div className="tech-card">Gemini AI</div>
          <div className="tech-card">LangChain</div>
          <div className="tech-card">RAG</div>
          <div className="tech-card">Multi-Agent Architecture</div>
        </div>
      </section>

      <section className="section compare-section">
        <div className="section-intro">
          <p className="eyebrow">Why RenewAI?</p>
          <h2>RenewAI is more than a chatbot or simple knowledge retrieval product.</h2>
        </div>
        <div className="comparison-table">
          <div className="table-column">
            <h4>Traditional Chatbot</h4>
            <ul>
              <li>Answers questions</li>
              <li>No planning</li>
              <li>No reasoning</li>
              <li>No memory</li>
              <li>No explainability</li>
            </ul>
          </div>
          <div className="table-column highlight">
            <h4>RenewAI</h4>
            <ul>
              <li>Planner-based orchestration</li>
              <li>Multi-agent reasoning</li>
              <li>Enterprise knowledge retrieval</li>
              <li>Explainable recommendations</li>
              <li>Human approval</li>
              <li>Continuous learning</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section workflow-preview">
        <div className="section-intro">
          <p className="eyebrow">Live AI Workflow Preview</p>
          <h2>See the agent execution flow in action.</h2>
        </div>
        <div className="terminal-card">
          <div className="terminal-row">
            <span>Planner Agent</span>
            <strong>✓</strong>
          </div>
          <div className="terminal-row">
            <span>Customer Health Agent Invoked</span>
            <strong>✓</strong>
          </div>
          <div className="terminal-row">
            <span>Knowledge Agent</span>
            <strong>✓ Retrieved 3 Relevant Playbooks</strong>
          </div>
          <div className="terminal-row">
            <span>Business Reasoning Agent</span>
            <strong>✓ Churn Risk Detected</strong>
          </div>
          <div className="terminal-row">
            <span>Recommendation Agent</span>
            <strong>✓ Generated 5 Next Best Actions</strong>
          </div>
          <div className="terminal-row pending">
            <span>Human Review</span>
            <strong>⏳ Waiting for Approval</strong>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="cta-card">
          <h2>Ready to Transform Customer Success?</h2>
          <p>
            Analyze customer interactions, retrieve enterprise knowledge and generate explainable Next Best Actions using
            Agentic AI.
          </p>
          <Link className="btn btn-primary btn-lg" to="/dashboard">
            Launch Dashboard
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div>
          <strong>RenewAI</strong>
          <p>Agentic Customer Success & Contract Intelligence Platform</p>
          <p>Hackathon Project</p>
        </div>
        <div>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
          <p>Team Members: Product, Engineering, AI</p>
        </div>
        <div>
          <p>© 2026 RenewAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
