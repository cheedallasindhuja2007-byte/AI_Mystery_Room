// server/validators/mysteryValidators.js
const mongoose = require('mongoose');

// Helper to accumulate errors in req._validationErrors
function addError(req, field, message) {
  if (!req._validationErrors) {
    req._validationErrors = [];
  }
  req._validationErrors.push({ field, message });
}

const VALID_CATEGORIES = ['murder', 'theft', 'missing', 'suspicious', 'general'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

function generateMysteryValidator(req, res, next) {
  const { scenario, category, difficulty } = req.body || {};

  if (!scenario || typeof scenario !== 'string' || scenario.trim().length < 10) {
    addError(req, 'scenario', 'Scenario must be at least 10 characters long.');
  } else if (scenario.trim().length > 2000) {
    addError(req, 'scenario', 'Scenario must not exceed 2000 characters.');
  }

  if (category && !VALID_CATEGORIES.includes(category.toLowerCase())) {
    addError(req, 'category', `Category must be one of: ${VALID_CATEGORIES.join(', ')}.`);
  }

  if (difficulty && !VALID_DIFFICULTIES.includes(difficulty.toLowerCase())) {
    addError(req, 'difficulty', `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}.`);
  }

  next();
}

function mysteryIdValidator(req, res, next) {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    addError(req, 'id', 'Invalid mystery ID format.');
  }
  next();
}

function evidenceIdValidator(req, res, next) {
  const { evidenceId } = req.params;
  if (!evidenceId || typeof evidenceId !== 'string' || !evidenceId.trim()) {
    addError(req, 'evidenceId', 'Evidence ID is required.');
  }
  next();
}

function submitValidator(req, res, next) {
  const { selectedSuspectId } = req.body || {};
  if (!selectedSuspectId || typeof selectedSuspectId !== 'string' || !selectedSuspectId.trim()) {
    addError(req, 'selectedSuspectId', 'You must select a suspect ID.');
  }
  next();
}

function validate(req, res, next) {
  if (req._validationErrors && req._validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: req._validationErrors.map(e => e.message).join(' '),
      errors: req._validationErrors,
      code: 'VALIDATION_ERROR',
    });
  }
  next();
}

module.exports = {
  generateMysteryValidator,
  mysteryIdValidator,
  evidenceIdValidator,
  submitValidator,
  validate,
};

