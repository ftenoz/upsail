# Project Brief: Maritime Expert Marketplace MVP

## Executive Summary
A lean, web-based B2B marketplace for the maritime industry that matches shipping companies with vetted independent experts (surveyors, inspectors, auditors, technical specialists) for short-term assignments. The platform replaces ad-hoc networking and WhatsApp/phone-based sourcing with a simple, trusted matching and messaging flow. Target users are shipping companies that need fast access to qualified specialists and maritime professionals seeking short-term, high-skill engagements. The value proposition is speed-to-first-conversation in a trust-oriented, minimal interface that feels like a professional tool, not a consumer marketplace.

## Problem Statement
Maritime companies need short-term access to qualified independent experts (surveyors, inspectors, auditors, technical specialists), but the current hiring flow is fragmented and opaque. Work is sourced via personal networks, WhatsApp groups, and phone calls, which makes it slow to identify available experts, hard to compare qualifications, and risky for corporate teams that require clarity and accountability. Existing generic freelancer platforms don’t fit the domain’s trust, certification, and professional expectations, leaving companies without a reliable, low-friction way to initiate qualified conversations quickly. The urgency is practical: when a ship or port operation needs inspection or specialist input, delays have real operational and financial impact, and teams default to informal channels that don’t scale.

## Proposed Solution
Build a focused, web-based marketplace for maritime professionals that provides a clean, trusted flow: companies post short-term roles; freelancers apply with verified professional profiles; companies shortlist or reject; both parties can message directly. The platform is intentionally narrow (no payments, subscriptions, or ratings) to keep it low-risk and fast to launch, while still enabling visibility, matching, and conversation. Differentiation comes from domain specificity—certifications, availability, location, and maritime-relevant skills—plus a professional, trust-oriented UX that feels like a private LinkedIn plus job board plus inbox. This constrained scope reduces friction for corporate users and accelerates time-to-first-conversation, which is the MVP’s only success objective.

## Target Users

### Primary User Segment: Shipping Company Ops / Technical Managers
Demographic/Firmographic: Mid-size to large shipping companies, vessel operators, or maritime service providers with recurring inspection/survey needs.

Behaviors/Workflows: Source experts through personal networks and informal channels; rely on trusted referrals and rapid outreach; manage multiple concurrent operational tasks.

Needs/Pain Points: Fast access to qualified specialists; confidence in certifications and credibility; minimal procurement friction; clarity on role boundaries and no implied guarantees.

Goals: Initiate a qualified conversation quickly, reduce search time, and avoid perceived risk when engaging independent experts.

### Secondary User Segment: Independent Maritime Experts
Demographic/Firmographic: Freelance surveyors, inspectors, auditors, and technical specialists with certifications, regional availability, and a reputation-based practice.

Behaviors/Workflows: Win work through referrals and network reputation; maintain CVs and certifications; respond quickly to urgent needs.

Needs/Pain Points: Visibility to legitimate companies; clear, professional roles; low time cost to apply; ability to control availability and scope.

Goals: Get discovered for relevant short-term jobs and convert into direct conversations without platform friction.

## Goals & Success Metrics

### Business Objectives
- Validate demand by enabling real company posting and expert engagement within 30 days
- Reduce sourcing friction vs. ad-hoc networking for at least one real job cycle
- Establish a trust-oriented presence that feels safe for corporate users

### User Success Metrics
- Company can create a job post and receive at least one qualified application
- Freelancer can create a profile and apply to a relevant job in under 10 minutes
- At least one company–freelancer conversation initiated through the platform

### Key Performance Indicators (KPIs)
- Job Posts Created (30 days): >= 1
- Qualified Applications per Job: >= 1
- Conversations Started: >= 1
- Time-to-First-Conversation: <= 7 days

## MVP Scope

### Core Features (Must Have)
- **Landing page:** Clear, trust-oriented explanation of purpose, roles, and disclaimers to reduce perceived risk.
- **Authentication:** Simple login/signup for companies and freelancers with role clarity.
- **Freelancer profile:** Skills, certifications, location, availability, LinkedIn, and professional summary.
- **Company profile:** Organization details, point of contact, and context for postings.
- **Job posting:** Short-term role creation with requirements, location, duration, and timing.
- **Job browsing & filtering:** Basic search by role/skill/location/availability.
- **Apply to job:** Simple application workflow with profile and short note.
- **Shortlist / reject:** Company-side triage of applicants.
- **1-to-1 messaging:** Secure, in-platform conversation to initiate engagement.
- **Basic admin controls:** Remove user or job for safety and compliance.

### Out of Scope for MVP
- Payments, escrow, subscriptions, commissions
- Ratings or public reviews
- Mobile app
- AI-based matching
- Automated verification or guarantees
- Any onboarding that implies platform liability

### MVP Success Criteria
Success is achieved if, within 30 days, at least one real company posts a job, at least one qualified freelancer applies, and at least one conversation starts on-platform.

## Post-MVP Vision

### Phase 2 Features
Once the MVP validates real conversations, potential next priorities could include lightweight verification workflows, richer profile signaling (certifications validation or endorsements), and improved search/matching filters tailored to maritime job types.

### Long-term Vision
A trusted, industry-standard hiring interface for maritime specialists—reducing reliance on private networks while preserving professional credibility and control for both sides.

### Expansion Opportunities
Adjacent maritime roles and geographies, partner integrations for compliance/certification registries, and deeper collaboration tooling once trust and demand are proven.

## Technical Considerations

### Platform Requirements
- **Target Platforms:** Web (desktop-first), responsive for mobile browsers
- **Browser/OS Support:** Modern evergreen browsers; no legacy support required for MVP
- **Performance Requirements:** Fast initial load and page transitions; prioritize reliability over animations

### Technology Preferences
- **Frontend:** Next.js
- **Backend:** NestJS (REST)
- **Database:** PostgreSQL
- **Hosting/Infrastructure:** Simple production-ready deployment optimized for fast iteration

### Architecture Considerations
- **Repository Structure:** Clear separation of frontend/back-end; keep simple
- **Service Architecture:** Monolithic API for MVP; avoid microservices
- **Integration Requirements:** None for MVP beyond basic email/notifications if needed
- **Security/Compliance:** JWT auth, clear role boundaries, and explicit disclaimers to limit implied liability

## Constraints & Assumptions

### Constraints
- **Budget:** Lean MVP build; prioritize speed over completeness
- **Timeline:** 30-day validation window for first real conversation
- **Resources:** Small team, likely founder-led with manual operations
- **Technical:** No payments, subscriptions, ratings, or AI matching

### Key Assumptions
- Companies are willing to post a job publicly (or semi-publicly) if the platform feels trustworthy
- Experts will create a profile and apply without guaranteed payment flows
- A simple messaging system is sufficient to initiate real conversations
- Manual verification and admin moderation are acceptable early on
- The platform can gain initial trust without ratings or platform guarantees

## Risks & Open Questions

### Key Risks
- **Trust gap:** Corporate users may still prefer known networks if the platform feels unproven.
- **Cold-start supply:** Insufficient experts early on could limit meaningful matches.
- **Perceived liability:** Users may assume the platform guarantees quality or outcomes.
- **Thin engagement:** One-off posting without repeat use could stall validation.
- **Manual ops load:** Founder effort for verification and moderation could bottleneck.

### Open Questions
- What minimum level of verification is required to feel credible?
- Should job posts be public, semi-public, or invite-only in the MVP?
- What information must appear in a freelancer profile to trigger trust?
- What are the minimum legal disclaimers needed to reduce liability?
- How will messaging and contact exchange be handled safely?

### Areas Needing Further Research
- Maritime hiring norms across regions (EU/US/Asia)
- Compliance or legal considerations for maritime staffing platforms
- Typical timelines and urgency patterns for inspections/surveys
- Channels to seed initial expert supply

## Appendices

### C. References
- TBD (add links to any research, competitive analysis, or stakeholder notes as they become available)

## Next Steps

### Immediate Actions
1. Confirm MVP scope and disclaimers to avoid implied guarantees
2. Define minimal verification signals for freelancers (certifications, LinkedIn, availability)
3. Create initial landing page copy emphasizing trust and professional use
4. Build core flows: profiles, job posting, applications, messaging
5. Seed pilot users (at least one company + one expert) within 30 days

### PM Handoff
This Project Brief provides the full context for the maritime marketplace MVP. Please start in "PRD Generation Mode," review the brief thoroughly, and work with the user to create the PRD section by section per the template, asking for any needed clarification or suggesting improvements.

