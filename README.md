# Multi-Brand WhatsApp Integration & Automation Suite

An enterprise-grade WhatsApp Integration and Conversational Automation Suite engineered specifically for:
1. **Ritika Jaiswal Fashion** (`www.ritikajaiswalfashion.com`) &bull; WhatsApp: **`+91923759949`**
2. **PS DigiLabs** (`www.psdigilabs.in`) &bull; WhatsApp: **`+916289482083`**
3. **Creative Monks** (`www.creativemonks.in`) &bull; WhatsApp: **`+917003797652`** (Weddings) & **`+919038516799`** (Commercial & Support)

---

## 🌟 Architecture Overview

```
                                      ┌────────────────────────────────────────────────┐
                                      │              Meta WhatsApp Cloud API           │
                                      │                (Graph API v21.0)               │
                                      └──────────────────────┬─────────────────────────┘
                                                             │ Webhooks / Inbound
                                                             ▼
┌─────────────────────────────────┐        ┌────────────────────────────────────────────────┐
│  Client Websites (Embeds)       │        │  Multi-Tenant WhatsApp Automation Server       │
│                                 │        │  (Node.js / Express on Port 3000)              │
│ • ritikajaiswalfashion.com      │        │                                                │
│ • psdigilabs.in                 ├───────►│  • Webhook Verification & Event Ingestion      │
│ • creativemonks.in              │        │  • Smart Chatbot Intent Engine                 │
│                                 │        │  • Persistent CRM Lead Logger (JSON/CSV)       │
│ - Floating Chat Widget          │        │  • Live Interactive Web Simulator Testbench    │
│ - Product Sizing Trigger        │        └──────────────────────┬─────────────────────────┘
│ - Project Quote Modal           │                               │
│ - Dual-Line Department Switcher │                               ▼
└─────────────────────────────────┘        ┌────────────────────────────────────────────────┐
                                           │  Brand-Specific Automation Flows               │
                                           │  • ritikaJaiswalFlow.js (Couture & Atelier)    │
                                           │  • psDigiLabsFlow.js (Tech & Performance)      │
                                           │  • creativeMonksFlow.js (Dual Line Studio)     │
                                           └────────────────────────────────────────────────┘
```

---

## 🚀 Key Capabilities by Brand

### 1. Ritika Jaiswal Fashion (`www.ritikajaiswalfashion.com`)
- **Primary WhatsApp:** `+91 92375 9949`
- **Branding:** Luxury Champagne Gold theme (`#B89058`) & VIP Atelier Concierge.
- **Automated Flows:**
  - 👗 **Digital Lookbook & Catalog:** Direct links to bridal lehengas, reception gowns, and couture collections.
  - 📅 **Flagship Atelier Appointment Booking:** Pre-screens preferred dates and bridal occasions for private trials at 12B Camac Street, Kolkata.
  - ✨ **Bespoke Bridal Sizing & Custom Orders:** 4–8 week lead time guidance, custom color palettes, and swatch consultation.
  - 📦 **Order Tracking Desk:** Real-time stitching and courier dispatch updates.
  - 👩‍💼 **Personal Stylist Escalation:** Direct handoff to Camac Street head stylist.
  - 🛍️ **Product Page Trigger:** Injects "Inquire Custom Sizing on WhatsApp" directly beneath "Add to Cart" on Shopify / WooCommerce.

### 2. PS DigiLabs (`www.psdigilabs.in`)
- **Primary WhatsApp:** `+91 62894 82083`
- **Branding:** Electric Tech Blue (`#0066FF`) & Fast-Response IT Concierge.
- **Automated Flows:**
  - 💻 **Services Menu:** Custom Web (React/Next.js), Mobile Apps (React Native/Flutter), SEO, and WhatsApp API bots.
  - 📊 **Complimentary Technical Audit:** Collects website URL and performance goals to deliver a 24-hr Core Web Vitals & SEO audit.
  - 💰 **Instant Project Estimator:** Ingestion form calculating budget and scope brackets.
  - 📞 **Strategy Discovery Call:** Calendly link and callback slot reservation.
  - 👨‍💻 **Direct Connect with Tech Lead:** Dispatches alert to engineering lead at `+91 62894 82083`.

### 3. Creative Monks (`www.creativemonks.in`)
- **WhatsApp Lines:**
  - **Line 1 (`+91 70037 97652`):** Weddings, Pre-Weddings, Candid Photography, Rice Ceremonies (Annaprashan).
  - **Line 2 (`+91 90385 16799`):** Commercial Shoots, Fashion Lookbooks, Album & Video Delivery Status.
- **Branding:** Warm Terracotta Studio theme (`#D9534F`) with dual-agent department switcher.
- **Automated Flows:**
  - 💍 **Wedding & Pre-Wedding Packages:** 4K cinematic film packages, drone coverage, Canvera album details.
  - 📅 **Date Availability Checker:** Immediate screening of event dates, venue city, and ceremony types.
  - 👶 **Rice Ceremony / Baby Milestones:** Specialized celebration photography collections.
  - 🎬 **Commercial Cinematography:** Routed straight to Line 2 for brand briefs and commercial proposals.
  - 🖼️ **Client Deliverables Status:** Instant inquiry desk for RAW selection galleries, teaser edits, and album dispatches.

---

## 💻 Quick Start & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Test Suite
Runs the 16 end-to-end automated conversational verification tests:
```bash
npm test
```

### 3. Start Server & Live Dashboard
```bash
npm start
```
- Open **http://localhost:3000** in your browser.
- Toggle between **Ritika Jaiswal**, **PS DigiLabs**, and **Creative Monks**.
- Experience the live interactive WhatsApp simulator, test button clicks, view real-time captured leads, and copy drop-in embed codes!

---

## 📁 Repository Structure

```
whatsapp-automation-suite/
├── .env.example                  # Environment configuration template
├── package.json                  # NPM scripts & dependencies
├── Dockerfile                    # Production Docker container
├── docker-compose.yml            # Container orchestration
├── README.md                     # Documentation
├── config/
│   └── brands.config.js          # Core brand metadata, numbers, greetings & themes
├── widgets/                      # Embeddable scripts for websites
│   ├── whatsapp-widget.js        # Universal responsive floating chat widget
│   ├── ritika-jaiswal/
│   │   ├── embed-snippet.html    # Drop-in HTML snippet
│   │   └── product-inquiry.js    # E-commerce product page trigger
│   ├── ps-digilabs/
│   │   ├── embed-snippet.html    # Drop-in HTML snippet
│   │   └── quote-calculator.js   # Instant estimate modal
│   └── creative-monks/
│       ├── embed-snippet.html    # Dual-line drop-in snippet
│       └── date-checker.js       # Date availability modal
├── server/
│   ├── index.js                  # Main Express API server
│   ├── routes/
│   │   ├── webhook.js            # Meta Cloud API Webhook (GET verify + POST events)
│   │   ├── leads.js              # Web lead capture & CRM endpoints
│   │   └── brands.js             # Brand metadata & simulator API
│   ├── services/
│   │   ├── whatsappCloudApi.js   # Meta Graph API v21.0 client (buttons, lists, text)
│   │   ├── chatbotEngine.js      # Multi-tenant conversational router & intent resolver
│   │   └── leadStore.js          # Persistent JSON lead logger
│   └── flows/
│       ├── ritikaJaiswalFlow.js  # Bridal couture & Camac Street atelier flow
│       ├── psDigiLabsFlow.js     # Tech stack, SEO audit & quote flow
│       └── creativeMonksFlow.js  # Dual-line wedding vs commercial flow
├── public/                       # Interactive testing & simulator dashboard
│   ├── index.html                # Multi-brand dashboard UI
│   ├── styles.css                # Polished dark-mode UI
│   └── app.js                    # Simulator state & reactive event handlers
├── test/
│   ├── simulate-flows.js         # Automated 16-flow unit test suite
│   └── test-server.js            # End-to-end HTTP integration test
└── deployment/
    └── setup-guide.md            # Step-by-step Meta Developer & Cloud API guide
```
