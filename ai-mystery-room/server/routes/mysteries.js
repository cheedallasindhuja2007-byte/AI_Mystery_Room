// server/routes/mysteries.js
const express = require('express');
const router = express.Router();
const mysteryController = require('../controllers/mysteryController');
const asyncHandler = require('../middleware/asyncHandler');
const {
  generateMysteryValidator,
  mysteryIdValidator,
  evidenceIdValidator,
  submitValidator,
  validate,
} = require('../validators/mysteryValidators');

// GET /api/mysteries - List recent cases
router.get('/', asyncHandler(mysteryController.listMysteries));

// POST /api/mysteries/generate - Generate a new case
router.post(
  '/generate',
  generateMysteryValidator,
  validate,
  asyncHandler(mysteryController.generateMystery)
);

// GET /api/mysteries/:id - Get mystery details (omits solution)
router.get(
  '/:id',
  mysteryIdValidator,
  validate,
  asyncHandler(mysteryController.getMystery)
);

// GET /api/mysteries/:id/evidence/:evidenceId - Inspect specific evidence
router.get(
  '/:id/evidence/:evidenceId',
  mysteryIdValidator,
  evidenceIdValidator,
  validate,
  asyncHandler(mysteryController.getEvidence)
);

// POST /api/mysteries/:id/submit - Submit final accusation
router.post(
  '/:id/submit',
  mysteryIdValidator,
  submitValidator,
  validate,
  asyncHandler(mysteryController.submitAnswer)
);

// GET /api/mysteries/:id/result - Retrieve resolved solution
router.get(
  '/:id/result',
  mysteryIdValidator,
  validate,
  asyncHandler(mysteryController.getResult)
);

module.exports = router;
