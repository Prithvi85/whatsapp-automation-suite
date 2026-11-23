const https = require('https');
const fs = require('fs');
const path = require('path');

const token = process.env.META_WHATSAPP_TOKEN;
const phoneId = process.env.PHONE_NUMBER_ID;

const contacts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'contacts.json'), 'utf8')
);

console.log('--- Meta WhatsApp Cloud API Payload Preparation ---');

contacts.forEach((contact) => {
  const payload = {
    messaging_product: 'whatsapp',
    to: contact.clean_phone,
    type: 'text',
    text: {
      preview_url: false,
      body: contact.default_message,
    },
  };

  console.log(`\nPrepared payload for ${contact.name} (${contact.phone}):`);
  console.log(JSON.stringify(payload, null, 2));

  if (token && phoneId) {
    const postData = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: 'graph.facebook.com',
        port: 443,
        path: `/v21.0/${phoneId}/messages`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => console.log(`Response for ${contact.clean_phone}:`, data));
      }
    );
    req.on('error', (err) => console.error(`Error sending to ${contact.clean_phone}:`, err));
    req.write(postData);
    req.end();
  }
});
