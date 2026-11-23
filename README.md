# Multi-Brand WhatsApp Automation & Concierge Suite

A production-engineered WhatsApp automation suite and interactive concierge widget system built with **React**, **Next.js**, and **TypeScript**.

Developed by **[PSDigiLabs](https://www.psdigilabs.in)** across three distinct commercial production platforms:
- **[PSDigiLabs](https://www.psdigilabs.in)** — Digital Product Engineering Studio
- **[Creative Monks](https://www.creativemonks.in)** — Wedding Photography & Cinematography Studio
- **[Ritika Jaiswal Fashion](https://www.ritikajaiswalfashion.com)** — Luxury Bridal & Couture Atelier

---

## Key Features

1. **Brand-Adaptive Concierge UI**
   - Universal component with customizable color schemes, typography, and positioning.
   - Built with accessible dialog semantics, backdrop dismissal, and responsive mobile adaptations.

2. **Automated Topic Routing**
   - Categorized quick-action chips that construct URL-encoded contextual conversation starters.
   - Eliminates cold friction by letting visitors specify project scope in one tap.

3. **Dual Dispatch Infrastructure**
   - Direct web deep-linking via `wa.me` for instant zero-dependency client messaging.
   - Meta WhatsApp Business Cloud API script support for programmatic outreach and lead delivery.

4. **Non-Intrusive Multi-Widget Architecture**
   - Dedicated bottom-left positioning that operates independently from right-aligned chatbots or inquiry launchers.

---

## Live Case Studies

| Client Brand | Industry | Target Number | Interface Strategy | Status |
| :--- | :--- | :--- | :--- | :--- |
| **PSDigiLabs** | Product Engineering | `+91 62894 82083` | Studio Concierge with Web, Mobile, QA & Automation chips | **Live** |
| **Creative Monks** | Wedding Media | `+91 70037 97652` | Editorial Studio Concierge for Weddings, Dates & Shoots | **Live** |
| **Ritika Jaiswal** | Luxury Fashion | `+91 91237 59949` | Atelier Concierge for Bridal, Bespoke & Appointments | **Live** |

---

## Repository Structure

```
whatsapp-automation-suite/
├── components/
│   └── whatsapp-widget.tsx    # Universal React / Next.js Concierge component
├── data/
│   └── contacts.json          # Verified commercial client contact registry
├── scripts/
│   ├── dispatcher.js          # Direct deep-link generation and validation
│   └── cloud-api.js           # Meta WhatsApp Business Cloud API integration
├── package.json
└── README.md
```

---

## Quick Start

### 1. Integrate Component into Next.js

```tsx
import { WhatsAppWidget } from "./components/whatsapp-widget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppWidget
          phoneNumber="916289482083"
          brandTitle="PSDigiLabs Studio"
          brandSubtitle="Typically replies in minutes • Online"
          welcomeMessage="Hi there! 👋 How can we help engineer or automate your digital product?"
          quickTopics={[
            { label: "🌐 Build a Website", message: "Hi PSDigiLabs, I'm looking to build a modern website." },
            { label: "📱 Android App", message: "Hi PSDigiLabs, I have an Android application project in mind." },
            { label: "⚡ Workflow Automation", message: "Hi PSDigiLabs, I'm interested in business automation." }
          ]}
          position="bottom-left"
        />
      </body>
    </html>
  );
}
```

### 2. Run Local Outreach Dispatcher

```bash
node scripts/dispatcher.js
```

### 3. Programmatic Dispatch via Meta Cloud API

```bash
export META_WHATSAPP_TOKEN="your_access_token"
export PHONE_NUMBER_ID="your_phone_id"
node scripts/cloud-api.js
```

---

## Author

**Prithwish Saha**  
Founder & Product Engineer at **[PSDigiLabs](https://www.psdigilabs.in)**  
Email: [contact@psdigilabs.in](mailto:contact@psdigilabs.in)  
GitHub: [@Prithvi85](https://github.com/Prithvi85)
