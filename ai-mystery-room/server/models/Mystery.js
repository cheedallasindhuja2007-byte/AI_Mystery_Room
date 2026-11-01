// server/models/Mystery.js
const mongoose = require('mongoose');

const suspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  age: Number,
  occupation: String,
  background: String,
  motive: String,
  alibi: String,
  personality: String,
});

const evidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true }, // e.g., chat, image, cctv, document, statement
  title: String,
  description: String,
  content: mongoose.Schema.Types.Mixed, // can store json, text, or url
  relatedSuspectIds: [String],
  relevance: String,
  timestamp: String, // String allows flexible times e.g. "23:58:12", ISO dates, or "Midnight"
});

const mysterySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  incident: {
    description: String,
    location: String,
    dateTime: String, // Flexible date-time string
  },
  suspects: [suspectSchema],
  timeline: [
    {
      time: String,
      event: String,
    },
  ],
  evidence: [evidenceSchema],
  solution: {
    culpritId: { type: String, required: true },
    motive: String,
    explanation: String,
    keyEvidenceIds: [String],
    misleadingClues: [String],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mystery', mysterySchema);
