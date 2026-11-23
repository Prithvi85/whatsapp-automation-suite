const fs = require('fs');
const path = require('path');

const contactsPath = path.join(__dirname, '..', 'data', 'contacts.json');
const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));

console.log('====================================================');
console.log('       WhatsApp Multi-Brand Outreach Dispatcher     ');
console.log('====================================================\n');

contacts.forEach((item, idx) => {
  const encoded = encodeURIComponent(item.default_message);
  const waUrl = `https://wa.me/${item.clean_phone}?text=${encoded}`;
  console.log(`[${idx + 1}] ${item.name} (${item.category})`);
  console.log(`    Phone  : ${item.phone}`);
  console.log(`    Site   : ${item.website}`);
  console.log(`    Direct : ${waUrl}\n`);
});
