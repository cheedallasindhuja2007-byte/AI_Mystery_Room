// server/controllers/mysteryController.js
const Mystery = require('../models/Mystery');
const geminiService = require('../services/geminiService');

// Helper to format unified API responses
const success = (data, message = 'Request successful') => ({ success: true, data, message });
const error = (msg, code = 'ERROR') => ({ success: false, message: msg, code });

/**
 * POST /api/mysteries/generate
 * Generates an entire mystery using Gemini and stores it in MongoDB
 * Omits confidential solution before returning to client
 */
async function generateMystery(req, res) {
  const { scenario, category, difficulty } = req.body;

  const geminiResult = await geminiService.generateMystery({
    scenario,
    category: category || 'general',
    difficulty: difficulty || 'medium',
  });

  if (!geminiResult.success) {
    return res.status(502).json(error(geminiResult.error || 'Gemini generation failed', 'GEMINI_ERROR'));
  }

  const mystery = new Mystery(geminiResult.data);
  await mystery.save();

  // Strip solution from response for anti-spoil guarantee
  const { solution, ...publicData } = mystery.toObject();
  res.status(201).json(success(publicData, 'Mystery investigation successfully generated'));
}

/**
 * GET /api/mysteries
 * Retrieves list of recent investigations (summarized, without solutions)
 */
async function listMysteries(req, res) {
  const mysteries = await Mystery.find()
    .select('-solution')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  res.json(success(mysteries, 'Mysteries retrieved'));
}

/**
 * GET /api/mysteries/:id
 * Retrieves full mystery dossier (omitting solution)
 */
async function getMystery(req, res) {
  const mystery = await Mystery.findById(req.params.id).lean();
  if (!mystery) {
    return res.status(404).json(error('Mystery not found', 'NOT_FOUND'));
  }

  const { solution, ...publicData } = mystery;
  res.json(success(publicData, 'Mystery dossier retrieved'));
}

/**
 * GET /api/mysteries/:id/evidence/:evidenceId
 * Retrieves specific piece of evidence from mystery
 */
async function getEvidence(req, res) {
  const mystery = await Mystery.findById(req.params.id).lean();
  if (!mystery) {
    return res.status(404).json(error('Mystery not found', 'NOT_FOUND'));
  }

  const evidenceItem = (mystery.evidence || []).find(e => e.id === req.params.evidenceId);
  if (!evidenceItem) {
    return res.status(404).json(error('Evidence not found', 'NOT_FOUND'));
  }

  res.json(success(evidenceItem, 'Evidence retrieved'));
}

/**
 * POST /api/mysteries/:id/submit
 * Submits the user's selected suspect and evaluates against the stored solution
 */
async function submitAnswer(req, res) {
  const mystery = await Mystery.findById(req.params.id);
  if (!mystery) {
    return res.status(404).json(error('Mystery not found', 'NOT_FOUND'));
  }

  const { selectedSuspectId } = req.body;
  const isCorrect = selectedSuspectId === mystery.solution.culpritId;

  // Find culprit and selected suspect objects for detailed feedback
  const actualCulprit = (mystery.suspects || []).find(s => s.id === mystery.solution.culpritId);
  const accusedSuspect = (mystery.suspects || []).find(s => s.id === selectedSuspectId);

  const evaluation = {
    isCorrect,
    selectedSuspectId,
    selectedSuspectName: accusedSuspect ? accusedSuspect.name : 'Unknown',
    actualCulpritId: mystery.solution.culpritId,
    actualCulpritName: actualCulprit ? actualCulprit.name : 'Unknown',
    actualCulpritRole: actualCulprit ? actualCulprit.occupation : '',
    motive: mystery.solution.motive,
    explanation: mystery.solution.explanation,
    keyEvidenceIds: mystery.solution.keyEvidenceIds || [],
    misleadingClues: mystery.solution.misleadingClues || [],
  };

  res.json(
    success(
      evaluation,
      isCorrect
        ? 'Case Solved! Your deduction was spot on.'
        : 'Case Unsolved! The accused suspect was innocent.'
    )
  );
}

/**
 * GET /api/mysteries/:id/result
 * Retrieves the full solution after submission
 */
async function getResult(req, res) {
  const mystery = await Mystery.findById(req.params.id).lean();
  if (!mystery) {
    return res.status(404).json(error('Mystery not found', 'NOT_FOUND'));
  }

  const actualCulprit = (mystery.suspects || []).find(s => s.id === mystery.solution.culpritId);

  const result = {
    ...mystery.solution,
    culpritName: actualCulprit ? actualCulprit.name : 'Unknown',
  };

  res.json(success(result, 'Investigation resolution retrieved'));
}

module.exports = {
  generateMystery,
  listMysteries,
  getMystery,
  getEvidence,
  submitAnswer,
  getResult,
};
