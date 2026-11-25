# Meta WhatsApp Business Cloud API & Deployment Setup Guide

This guide details how to set up the official **Meta WhatsApp Cloud API (Graph API v21.0)** for:
1. **Ritika Jaiswal Fashion** (`www.ritikajaiswalfashion.com`) &bull; `+91923759949`
2. **PS DigiLabs** (`www.psdigilabs.in`) &bull; `+916289482083`
3. **Creative Monks** (`www.creativemonks.in`) &bull; `+917003797652`, `+919038516799`

---

## 1. Meta Developer Portal Setup

1. Go to [developers.facebook.com](https://developers.facebook.com/) and log in with your Meta account.
2. Click **My Apps** > **Create App**.
3. Select **Business** as the app type and click **Next**.
4. Enter your app name (e.g. `Unified WhatsApp Automation Hub`) and select your Meta Business Account.
5. In the app dashboard, scroll to **Add products to your app** and locate **WhatsApp**. Click **Set up**.

---

## 2. Connect Your Phone Numbers

In Meta WhatsApp Cloud API, each business phone number is connected to your WhatsApp Business Account (WABA):

1. Under **WhatsApp > API Setup**, scroll down to **Step 5: Add a phone number**.
2. Click **Add phone number**:
   - For **Ritika Jaiswal Fashion**:
     - Business Display Name: `Ritika Jaiswal Atelier`
     - Category: `Apparel & Clothing`
     - Phone: `+91 92375 9949` *(verify OTP via SMS or Voice)*
   - For **PS DigiLabs**:
     - Business Display Name: `PS DigiLabs`
     - Category: `Professional Services / IT`
     - Phone: `+91 62894 82083` *(verify OTP)*
   - For **Creative Monks**:
     - Business Display Name: `Creative Monks Wedding Cinematography`
     - Line 1: `+91 70037 97652`
     - Line 2: `+91 90385 16799` *(Commercial & Post-production)*
3. After verification, note down the generated **Phone Number ID** for each number and paste them into your `.env` file:
   ```env
   RITIKA_PHONE_NUMBER_ID=1029384756...
   PS_PHONE_NUMBER_ID=2039485761...
   CREATIVE_MONKS_PHONE_NUMBER_ID=3049586712...
   ```

---

## 3. Generate a Permanent System User Access Token

Temporary tokens expire in 24 hours. To generate a permanent production token:

1. Go to **Meta Business Suite** > **Business Settings** (`business.facebook.com/settings`).
2. Navigate to **Users > System Users**.
3. Click **Add**, name the user (e.g. `WhatsApp-Automation-Bot`), and set role to **Admin**.
4. Click **Assign Assets**:
   - Under **Apps**, select your app and enable **Full Control**.
   - Under **WhatsApp Accounts**, select your WABA and enable **Full Control**.
5. Click **Generate New Token**:
   - App: Select your app.
   - Token expiration: **Never**.
   - Select required permissions:
     - `whatsapp_business_messaging`
     - `whatsapp_business_management`
6. Copy the generated token and save it into your `.env`:
   ```env
   META_WHATSAPP_ACCESS_TOKEN=EAAG...
   ```

---

## 4. Configure Webhooks

1. In your Meta Developer App, go to **WhatsApp > Configuration**.
2. Under **Webhook**, click **Edit**:
   - **Callback URL**: `https://your-public-domain.com/api/webhook`
   - **Verify Token**: `antigravity_wa_secure_token_2026` (matching your `.env`)
3. Click **Verify and Save**. Meta will send a GET challenge request; your server will auto-verify it with HTTP 200.
4. Under **Webhook fields**, click **Manage** and subscribe to:
   - `messages` (Inbound customer messages & button clicks)
   - `messaging_postbacks`
   - `message_template_status_update`

---

## 5. Website Embedding

Drop the respective integration code snippet into the footer of each website right before `</body>`:

### A. Ritika Jaiswal Fashion (`www.ritikajaiswalfashion.com`)
```html
<script>
  window.WA_BRAND_CONFIG = {
    id: 'ritika-jaiswal',
    name: 'Ritika Jaiswal Atelier',
    tagline: 'Luxury Couture & Bridal • Camac St, Kolkata',
    phone: '91923759949',
    branding: {
      primaryColor: '#B89058',
      avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=120&auto=format&fit=crop&q=80'
    },
    welcomeGreeting: 'Namaste! Welcome to Ritika Jaiswal Atelier. How may our couture team assist your bridal wardrobe today?',
    quickReplies: [
      { title: '👗 View Lookbook & Catalog' },
      { title: '📅 Book Atelier Visit (Camac St)' },
      { title: '✨ Custom Bridal Consultation' },
      { title: '📦 Track My Order' },
      { title: '👩‍💼 Chat with Fashion Stylist' }
    ]
  };
</script>
<script src="https://your-server.com/widgets/whatsapp-widget.js" async></script>
<script src="https://your-server.com/widgets/ritika-jaiswal/product-inquiry.js" async></script>
```

### B. PS DigiLabs (`www.psdigilabs.in`)
```html
<script>
  window.WA_BRAND_CONFIG = {
    id: 'ps-digilabs',
    name: 'PS DigiLabs Tech Concierge',
    tagline: 'Online • Web, App & Performance Lab',
    phone: '916289482083',
    branding: {
      primaryColor: '#0066FF',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80'
    },
    welcomeGreeting: 'Hi there! 👋 Looking to build a website, app, or scale marketing?',
    quickReplies: [
      { title: '💻 Services & Tech Stack' },
      { title: '📊 Free Website / SEO Audit' },
      { title: '💰 Get Instant Project Quote' },
      { title: '📞 Schedule Strategy Call' },
      { title: '👨‍💻 Speak with Tech Lead' }
    ]
  };
</script>
<script src="https://your-server.com/widgets/whatsapp-widget.js" async></script>
<script src="https://your-server.com/widgets/ps-digilabs/quote-calculator.js" async></script>
```

### C. Creative Monks (`www.creativemonks.in`)
```html
<script>
  window.WA_BRAND_CONFIG = {
    id: 'creative-monks',
    name: 'Creative Monks Studio',
    tagline: 'Artisanal Wedding & Commercial Cinematography',
    departments: [
      {
        id: 'wedding-shoots',
        title: '💍 Weddings & Pre-Weddings',
        description: 'Wedding photography, films & rice ceremonies',
        phone: '917003797652',
        displayPhone: '+91 70037 97652'
      },
      {
        id: 'commercial-support',
        title: '🎬 Commercial & Client Support',
        description: 'Brand films, fashion shoots, album & video status',
        phone: '919038516799',
        displayPhone: '+91 90385 16799'
      }
    ],
    branding: {
      primaryColor: '#D9534F',
      avatar: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=120&auto=format&fit=crop&q=80'
    },
    welcomeGreeting: 'Hello! 📸 Choose Wedding Bookings (+91 70037 97652) or Commercial / Client Support (+91 90385 16799).',
    quickReplies: [
      { title: '💍 Wedding & Pre-Wedding Packages' },
      { title: '📅 Check Date Availability' },
      { title: '👶 Rice Ceremony & Baby Shoots' },
      { title: '🎬 Fashion & Commercial Shoots' },
      { title: '🖼️ Album & Video Delivery Status' }
    ]
  };
</script>
<script src="https://your-server.com/widgets/whatsapp-widget.js" async></script>
<script src="https://your-server.com/widgets/creative-monks/date-checker.js" async></script>
```
