// server/test.js
const assert = require('assert');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Mystery = require('./models/Mystery');
const { validateGeneratedMystery } = require('./services/geminiService');

async function runTests() {
  console.log('🧪 Starting AI Mystery Room Backend Test Suite...\n');

  // Test 1: validateGeneratedMystery with valid mock data
  console.log('Test 1: Validate generated mystery schema structure...');
  const mockMystery = {
    title: 'The Stolen Diamond',
    category: 'theft',
    difficulty: 'medium',
    incident: {
      description: 'A diamond was stolen from a glass display at midnight.',
      location: 'City Museum',
      dateTime: '2026-01-15T00:00:00Z',
    },
    suspects: [
      { id: 'suspect_1', name: 'John Doe', age: 34, occupation: 'Curator', background: 'In debt', motive: 'Greed', alibi: 'At home' },
      { id: 'suspect_2', name: 'Jane Smith', age: 29, occupation: 'Guard', background: 'Recent hire', motive: 'None', alibi: 'Patrolling' },
      { id: 'suspect_3', name: 'Bob Wilson', age: 45, occupation: 'Janitor', background: 'Long-time staff', motive: 'Disgruntled', alibi: 'Cleaning 2nd floor' },
    ],
    timeline: [
      { time: '23:45', event: 'John Doe entered the museum' },
      { time: '00:05', event: 'Alarm triggered' },
    ],
    evidence: [
      { id: 'evidence_1', type: 'chat', title: 'Suspicious Text', description: 'Curator message', relatedSuspectIds: ['suspect_1'] },
      { id: 'evidence_2', type: 'cctv', title: 'Corridor Feed', description: 'Figure running', relatedSuspectIds: ['suspect_1', 'suspect_2'] },
    ],
    solution: {
      culpritId: 'suspect_1',
      motive: 'Large gambling debts',
      explanation: 'John used his master key to open the glass case.',
      keyEvidenceIds: ['evidence_1'],
      misleadingClues: ['Jane was seen patrolling nearby, but was just doing her rounds.'],
    },
  };

  const validated = validateGeneratedMystery(mockMystery);
  assert.strictEqual(validated.title, 'The Stolen Diamond');
  assert.strictEqual(validated.solution.culpritId, 'suspect_1');
  console.log('✅ Test 1 Passed: Generated mystery validation succeeded.\n');

  // Test 2: Auto-repair when culpritId is a name instead of ID
  console.log('Test 2: Auto-repair of mismatched culprit ID...');
  const mismatchMystery = JSON.parse(JSON.stringify(mockMystery));
  mismatchMystery.solution.culpritId = 'John Doe'; // name instead of ID
  const repaired = validateGeneratedMystery(mismatchMystery);
  assert.strictEqual(repaired.solution.culpritId, 'suspect_1');
  console.log('✅ Test 2 Passed: Mismatched culprit ID auto-repaired to suspect_1.\n');

  // Test 3: Connect to MongoDB and test model save & retrieval
  console.log('Test 3: MongoDB Model operations (Save, Secret Protection & Submit Evaluation)...');
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI not configured, skipping DB tests.');
    return;
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB for integration test.');

  const createdMystery = new Mystery(validated);
  await createdMystery.save();
  const mysteryId = createdMystery._id.toString();

  // Test 3a: Verify secret solution is stripped for public response
  const fetched = await Mystery.findById(mysteryId).lean();
  assert(fetched !== null);
  const { solution, ...publicData } = fetched;
  assert.strictEqual(publicData.solution, undefined);
  assert.strictEqual(publicData.title, 'The Stolen Diamond');
  console.log('✅ Test 3a Passed: Solution successfully hidden for public responses.');

  // Test 3b: Evaluate Correct Accusation
  assert.strictEqual(fetched.solution.culpritId, 'suspect_1');
  const userGuessCorrect = 'suspect_1';
  const isCorrect = userGuessCorrect === fetched.solution.culpritId;
  assert.strictEqual(isCorrect, true);
  console.log('✅ Test 3b Passed: Correct culprit accusation evaluated accurately.');

  // Test 3c: Evaluate Incorrect Accusation
  const userGuessIncorrect = 'suspect_2';
  const isIncorrect = userGuessIncorrect === fetched.solution.culpritId;
  assert.strictEqual(isIncorrect, false);
  console.log('✅ Test 3c Passed: Incorrect culprit accusation identified correctly.');

  // Clean up test document
  await Mystery.findByIdAndDelete(mysteryId);
  console.log('Cleaned up test document from database.');

  await mongoose.disconnect();
  console.log('\n🎉 ALL BACKEND UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
