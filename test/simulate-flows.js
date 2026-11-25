/**
 * Automated Verification Script for Multi-Brand WhatsApp Suite
 * Verifies conversational flows for Ritika Jaiswal, PS DigiLabs, and Creative Monks
 */

const chatbotEngine = require('../server/services/chatbotEngine');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting Multi-Brand WhatsApp Automation Flow Tests');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  async function testFlow(name, input, expectedSubstring) {
    total++;
    try {
      const result = await chatbotEngine.processMessage(input);
      let outputText = '';
      if (result.response.type === 'interactive_list') {
        outputText = result.response.body;
      } else {
        outputText = result.response.text || '';
      }

      if (outputText.toLowerCase().includes(expectedSubstring.toLowerCase())) {
        console.log(`✅ [PASS] ${name}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${name}`);
        console.error(`   Expected to contain: "${expectedSubstring}"`);
        console.error(`   Actual output: "${outputText.substring(0, 100)}..."`);
      }
    } catch (e) {
      console.error(`❌ [ERROR] ${name}:`, e.message);
    }
  }

  // 1. Ritika Jaiswal Fashion Tests
  console.log('--- Brand 1: Ritika Jaiswal Fashion (+91923759949) ---');
  await testFlow(
    'Ritika: Default Welcome Greeting',
    { brandId: 'ritika-jaiswal', senderPhone: '91923759949', senderName: 'Priya', isSimulation: true },
    'Ritika Jaiswal Atelier'
  );
  await testFlow(
    'Ritika: Lookbook Request',
    { brandId: 'ritika-jaiswal', buttonPayload: 'MENU_LOOKBOOK', senderPhone: '91923759949', isSimulation: true },
    'Digital Lookbook'
  );
  await testFlow(
    'Ritika: Camac Street Atelier Appointment Booking',
    { brandId: 'ritika-jaiswal', buttonPayload: 'MENU_APPOINTMENT', senderPhone: '91923759949', isSimulation: true },
    '12B Camac Street'
  );
  await testFlow(
    'Ritika: Bespoke Bridal Consultation Inquiry',
    { brandId: 'ritika-jaiswal', messageText: 'Can I customize lehenga sizing and color?', isSimulation: true },
    'Bespoke Bridal Design'
  );
  await testFlow(
    'Ritika: Order Tracking',
    { brandId: 'ritika-jaiswal', messageText: 'Where is my order tracking?', isSimulation: true },
    'Order Tracking'
  );

  // 2. PS DigiLabs Tests
  console.log('\n--- Brand 2: PS DigiLabs (+916289482083) ---');
  await testFlow(
    'PS DigiLabs: Default Greeting',
    { brandId: 'ps-digilabs', senderPhone: '916289482083', senderName: 'Raj', isSimulation: true },
    'PS DigiLabs'
  );
  await testFlow(
    'PS DigiLabs: Services Menu',
    { brandId: 'ps-digilabs', buttonPayload: 'MENU_SERVICES', isSimulation: true },
    'Web & E-Commerce'
  );
  await testFlow(
    'PS DigiLabs: Free Website Audit Request',
    { brandId: 'ps-digilabs', messageText: 'I want a free SEO audit for my site', isSimulation: true },
    'Complimentary Website & SEO Audit'
  );
  await testFlow(
    'PS DigiLabs: Instant Project Quote',
    { brandId: 'ps-digilabs', buttonPayload: 'MENU_QUOTE', isSimulation: true },
    'Instant Project Quotation'
  );
  await testFlow(
    'PS DigiLabs: Strategy Call Booking',
    { brandId: 'ps-digilabs', messageText: 'Can I book a call?', isSimulation: true },
    '15-Minute Technical Strategy Call'
  );

  // 3. Creative Monks Tests
  console.log('\n--- Brand 3: Creative Monks (+917003797652 / +919038516799) ---');
  await testFlow(
    'Creative Monks: Default Dual-Line Menu',
    { brandId: 'creative-monks', senderPhone: '917003797652', senderName: 'Sneha', isSimulation: true },
    'Creative Monks'
  );
  await testFlow(
    'Creative Monks Line 1: Wedding & Pre-Wedding Shoot Flow',
    { brandId: 'creative-monks', buttonPayload: 'MENU_WEDDING', isSimulation: true },
    'Wedding Cinematography & Photography'
  );
  await testFlow(
    'Creative Monks Line 1: Date Availability Check',
    { brandId: 'creative-monks', messageText: 'Is 15th December available for wedding?', isSimulation: true },
    'Date Availability Check'
  );
  await testFlow(
    'Creative Monks Line 1: Rice Ceremony / Family Shoot',
    { brandId: 'creative-monks', buttonPayload: 'MENU_FAMILY', isSimulation: true },
    'Rice Ceremony'
  );
  await testFlow(
    'Creative Monks Line 2: Commercial & Fashion Cinematography',
    { brandId: 'creative-monks', buttonPayload: 'MENU_COMMERCIAL', isSimulation: true },
    '+91 90385 16799'
  );
  await testFlow(
    'Creative Monks Line 2: Album Delivery & Video Edit Status',
    { brandId: 'creative-monks', messageText: 'What is my wedding album delivery status?', isSimulation: true },
    'Album Delivery Status'
  );

  console.log('\n====================================================');
  console.log(`🎉 Test Execution Complete: ${passed}/${total} Flows Passed`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
