// server/services/geminiService.js
const { GoogleGenAI } = require('@google/genai');

const SYSTEM_INSTRUCTION = `You are a master crime novelist and forensic mystery architect.
Your job is to generate logically airtight, deeply engaging, and internally consistent detective mysteries based on a user's prompt.

Mandatory Mystery Generation Rules:
1. Exactly ONE definitive culprit from the suspect list.
2. 3 to 5 suspects total. Every suspect must have a believable motive, background, and claimed alibi.
3. 5 to 8 evidence items total spanning multiple types:
   - 'chat': Realistic WhatsApp or messaging conversations with senders, timestamps, and suspicious messages.
   - 'cctv': Surveillance logs or camera stills with camera IDs, timestamps, and observed actions.
   - 'image': Descriptions of visual crime scene items (e.g. dropped items, shattered glass, footprints).
   - 'document': Official logs, keycard swipes, autopsy notes, financial records.
   - 'statement': Sworn witness statements or police interrogations.
4. Internal Consistency: The timeline of events and evidence timestamps must align perfectly.
5. Misleading Clues: Include 1-2 explainable red herrings that seem suspicious at first but have an innocent or secondary explanation.
6. Key Evidence: At least 2 clues must directly expose the actual culprit when pieced together.
7. Return strictly valid JSON adhering to the specified schema. Do not output markdown codeblocks, just raw JSON.`;

const JSON_SCHEMA_PROMPT = `
Output format must be a single JSON object matching this schema:
{
  "title": "string (Compelling Case Title)",
  "category": "string (murder | theft | missing | suspicious | general)",
  "difficulty": "string (easy | medium | hard)",
  "incident": {
    "description": "string (Detailed summary of the incident)",
    "location": "string (Specific crime scene location)",
    "dateTime": "string (ISO or human readable timestamp)"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "string (Full Name)",
      "age": 35,
      "occupation": "string",
      "background": "string (History and context)",
      "motive": "string (Why they might have done it)",
      "alibi": "string (What they claim they were doing)",
      "personality": "string (Demeanor and traits)"
    }
  ],
  "timeline": [
    {
      "time": "string (e.g. 21:30)",
      "event": "string (Verified event description)"
    }
  ],
  "evidence": [
    {
      "id": "evidence_1",
      "type": "string (chat | cctv | image | document | statement)",
      "title": "string (Clue Title)",
      "description": "string (Detective notes on the clue)",
      "content": {
        "text": "string (or description)",
        "messages": [
          { "sender": "string", "time": "string", "message": "string" }
        ],
        "metadata": "string (e.g. camera angle, file source, timestamp)"
      },
      "relatedSuspectIds": ["suspect_1"],
      "relevance": "string",
      "timestamp": "string"
    }
  ],
  "solution": {
    "culpritId": "suspect_1 (Must strictly match an id in suspects)",
    "motive": "string (The genuine real motive of the culprit)",
    "explanation": "string (Full beginner-friendly revelation of how the crime was planned and executed)",
    "keyEvidenceIds": ["evidence_1 (Ids of clues that crack the case)"],
    "misleadingClues": [
      "string (Explanation of why an innocent suspect looked guilty)"
    ]
  }
}
`;

function validateGeneratedMystery(mystery) {
  if (!mystery || typeof mystery !== 'object') {
    throw new Error('Mystery payload is not an object.');
  }

  if (!mystery.title || !mystery.incident || !Array.isArray(mystery.suspects)) {
    throw new Error('Missing core mystery fields: title, incident, or suspects.');
  }

  if (mystery.suspects.length < 3 || mystery.suspects.length > 6) {
    throw new Error(`Expected between 3 and 5 suspects, got ${mystery.suspects.length}`);
  }

  const suspectIds = new Set(mystery.suspects.map(s => s.id));

  if (!mystery.solution || !mystery.solution.culpritId) {
    throw new Error('Missing mystery solution or culpritId.');
  }

  if (!suspectIds.has(mystery.solution.culpritId)) {
    // Attempt auto-repair if culprit matches a suspect's name
    const matchingSuspect = mystery.suspects.find(s => 
      s.name.toLowerCase() === mystery.solution.culpritId.toLowerCase()
    );
    if (matchingSuspect) {
      mystery.solution.culpritId = matchingSuspect.id;
    } else {
      // Pick first suspect if mismatch
      mystery.solution.culpritId = mystery.suspects[0].id;
    }
  }

  if (!Array.isArray(mystery.evidence) || mystery.evidence.length === 0) {
    throw new Error('Mystery must have at least one piece of evidence.');
  }

  const evidenceIds = new Set(mystery.evidence.map(e => e.id));

  // Ensure keyEvidenceIds are valid
  if (Array.isArray(mystery.solution.keyEvidenceIds)) {
    mystery.solution.keyEvidenceIds = mystery.solution.keyEvidenceIds.filter(id => evidenceIds.has(id));
    if (mystery.solution.keyEvidenceIds.length === 0 && mystery.evidence.length > 0) {
      mystery.solution.keyEvidenceIds = [mystery.evidence[0].id];
    }
  } else {
    mystery.solution.keyEvidenceIds = [mystery.evidence[0].id];
  }

  // Ensure relatedSuspectIds are valid
  mystery.evidence.forEach(e => {
    if (Array.isArray(e.relatedSuspectIds)) {
      e.relatedSuspectIds = e.relatedSuspectIds.filter(id => suspectIds.has(id));
    } else {
      e.relatedSuspectIds = [];
    }
  });

  return mystery;
}

/**
 * Generate a complete mystery from scenario using Google Gemini
 */
async function generateMystery({ scenario, category = 'general', difficulty = 'medium' }) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `
Generate a complete investigation for this mystery request:
- Scenario: "${scenario}"
- Category: "${category}"
- Difficulty: "${difficulty}"

${JSON_SCHEMA_PROMPT}
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response received from Gemini.');
    }

    // Clean potential markdown backticks if any
    let cleanedText = rawText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const parsedData = JSON.parse(cleanedText);
    const validatedData = validateGeneratedMystery(parsedData);

    // Normalize category and difficulty
    validatedData.category = category.toLowerCase();
    validatedData.difficulty = difficulty.toLowerCase();

    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    console.error('Gemini Service Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate mystery with Gemini.',
    };
  }
}

module.exports = {
  generateMystery,
  validateGeneratedMystery,
};

