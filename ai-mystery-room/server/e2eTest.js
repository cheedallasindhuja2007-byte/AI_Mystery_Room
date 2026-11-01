// server/e2eTest.js
const assert = require('assert');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const app = require('./app');

async function runE2E() {
  console.log('🚀 Initiating Full End-to-End Live Integration Test...\n');

  // Step 1: Connect to DB and start temporary server on port 5099
  const PORT = 5099;
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas.');

  const server = app.listen(PORT);
  console.log(`✅ Temporary API test server listening on http://localhost:${PORT}`);

  try {
    const baseUrl = `http://localhost:${PORT}/api`;

    // Step 2: Health check
    console.log('\n--- 1. Testing Health Endpoint ---');
    const healthRes = await fetch(`${baseUrl}/health`).then((r) => r.json());
    assert.strictEqual(healthRes.status, 'ok');
    console.log('✅ Health check passed.');

    // Step 3: Test Real Mystery Generation with Google Gemini
    console.log('\n--- 2. Testing Mystery Generation with Google Gemini ---');
    console.log('Calling POST /api/mysteries/generate with prompt scenario...');
    const generatePayload = {
      scenario: 'A priceless emerald brooch was stolen from Lady Pemberton during a grand masked ball at midnight.',
      category: 'theft',
      difficulty: 'medium',
    };

    const genStartTime = Date.now();
    const genRes = await fetch(`${baseUrl}/mysteries/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generatePayload),
    }).then((r) => r.json());

    const genDuration = ((Date.now() - genStartTime) / 1000).toFixed(1);
    assert.strictEqual(genRes.success, true, `Generation failed: ${genRes.message}`);
    const mystery = genRes.data;
    console.log(`✅ Mystery generated in ${genDuration}s: "${mystery.title}"`);
    console.log(`   - Category: ${mystery.category}`);
    console.log(`   - Suspects count: ${mystery.suspects.length}`);
    console.log(`   - Evidence count: ${mystery.evidence.length}`);
    console.log(`   - Timeline events: ${mystery.timeline.length}`);

    // Verify secret solution is NOT in the public response
    assert.strictEqual(mystery.solution, undefined, 'CRITICAL: solution must be hidden from client!');
    console.log('🔒 Verified: Solution is completely sanitized from API response.');

    const mysteryId = mystery._id;

    // Step 4: Fetch mystery by ID
    console.log('\n--- 3. Testing GET /api/mysteries/:id ---');
    const fetchRes = await fetch(`${baseUrl}/mysteries/${mysteryId}`).then((r) => r.json());
    assert.strictEqual(fetchRes.success, true);
    assert.strictEqual(fetchRes.data.solution, undefined, 'CRITICAL: solution must remain hidden!');
    console.log('✅ Retrieved public mystery dossier successfully.');

    // Step 5: Test Fetching a Specific Evidence Item
    console.log('\n--- 4. Testing GET /api/mysteries/:id/evidence/:evidenceId ---');
    const firstEvidence = mystery.evidence[0];
    const evidenceRes = await fetch(`${baseUrl}/mysteries/${mysteryId}/evidence/${firstEvidence.id}`).then((r) =>
      r.json()
    );
    assert.strictEqual(evidenceRes.success, true);
    assert.strictEqual(evidenceRes.data.id, firstEvidence.id);
    console.log(`✅ Retrieved evidence "${evidenceRes.data.title}" (${evidenceRes.data.type}).`);

    // Step 6: Test Submitting Accusation
    console.log('\n--- 5. Testing POST /api/mysteries/:id/submit ---');
    const accusedSuspectId = mystery.suspects[0].id;
    console.log(`Submitting accusation against suspect: ${accusedSuspectId} (${mystery.suspects[0].name})...`);

    const submitRes = await fetch(`${baseUrl}/mysteries/${mysteryId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedSuspectId: accusedSuspectId }),
    }).then((r) => r.json());

    assert.strictEqual(submitRes.success, true);
    const evaluation = submitRes.data;
    console.log(`✅ Verdict received: ${submitRes.message}`);
    console.log(`   - isCorrect: ${evaluation.isCorrect}`);
    console.log(`   - Actual Culprit: ${evaluation.actualCulpritName} (ID: ${evaluation.actualCulpritId})`);
    console.log(`   - True Motive: ${evaluation.motive}`);
    console.log(`   - Key Clues: ${evaluation.keyEvidenceIds.join(', ')}`);
    console.log(`   - Misleading Clues: ${evaluation.misleadingClues.length} clues explained`);

    // Step 7: Clean up test document from MongoDB
    const MysteryModel = require('./models/Mystery');
    await MysteryModel.findByIdAndDelete(mysteryId);
    console.log('\n🧹 Cleaned up test mystery record from MongoDB.');

    console.log('\n======================================================');
    console.log('🎉 LIVE END-TO-END VERIFICATION COMPLETED 100% SUCCESSFULLY!');
    console.log('======================================================\n');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runE2E().catch((err) => {
  console.error('❌ E2E Test Failure:', err);
  process.exit(1);
});

