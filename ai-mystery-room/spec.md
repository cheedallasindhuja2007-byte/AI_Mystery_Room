# AI MYSTERY ROOM
## Master Software Requirements & Technical Specification
**Document Type:** Single Source of Truth (SSOT)  
**Version:** 1.0  
**Project Status:** Initial Development  
**Technology Stack:** MERN  
**AI Provider:** Google Gemini  
**Development Tools:** OpenAI Codex / Google Antigravity  
**Target Audience:** Beginners, developers, AI coding agents

---

# 1. PROJECT OVERVIEW

## 1.1 Project Name
AI Mystery Room

## 1.2 Project Description

AI Mystery Room is an AI-powered interactive mystery-solving web application.

The user provides a short scenario, story, or fictional situation. Based on this input, the application generates a complete fictional investigation in which a crime or mysterious incident has occurred.

The AI acts as a mystery creator and investigation designer. It creates:
- A fictional incident.
- A list of suspects.
- A culprit responsible for the incident.
- Background information about the suspects.
- Evidence and clues.
- Fake WhatsApp conversations.
- AI-generated images.
- Fictional CCTV recordings or video evidence.
- Statements and other investigation materials.

The user acts as an investigator.

The user explores the available evidence, connects the clues, identifies contradictions, and finally selects the person they believe is responsible.

The application evaluates the user's selection against the actual culprit stored in the generated mystery.

The application then reveals the correct answer and explains the reasoning behind it.

## 1.3 Core Idea

**User creates a story → AI creates a mystery → User investigates evidence → User identifies the culprit → AI Mystery Room reveals the truth.**

## 1.4 Example Scenario

User input:

"A businessman was found dead in his office at midnight. Three employees had access to his office, and everyone claims they were somewhere else."

The AI generates:

**Incident:** A fictional businessman is found dead in his office.

**Suspects:**
1. Rahul – Personal assistant.
2. Meera – Business partner.
3. Arjun – Security guard.

**Evidence:**
1. WhatsApp conversation between Rahul and Meera.
2. CCTV footage showing someone entering the office.
3. A photograph of a broken watch.
4. A statement from the security guard.
5. An office access log.

**Actual Culprit:** One of the three suspects.

The user investigates the available evidence and submits a final answer.

The application reveals:
- Whether the user's answer is correct.
- Who the actual culprit is.
- The motive.
- How the evidence connects.
- Which clues exposed the culprit.
- An explanation of the complete mystery.

**Important:** The culprit and the actual solution must be determined before the user starts investigating. They must never change based on the user's guesses.

---

# 2. PROJECT OBJECTIVES

The primary objectives are:

1. Create an interactive mystery-solving experience.
2. Use Gemini to generate unique fictional investigations.
3. Generate logically consistent suspects, evidence, and solutions.
4. Provide multiple evidence formats to make investigations engaging.
5. Allow users to explore evidence independently.
6. Evaluate the user's final culprit selection.
7. Explain the solution in a beginner-friendly and understandable way.
8. Keep the application modular, maintainable, and scalable.

## 2.1 Target Users

- People interested in detective stories.
- Mystery and puzzle enthusiasts.
- Casual gamers.
- Users interested in AI-generated interactive experiences.

## 2.2 Project Scope

The first version will focus on a single-player mystery-solving experience.

The application must prioritize:
- Mystery generation.
- Evidence consistency.
- Investigation interface.
- Culprit selection.
- Solution revelation.

Multiplayer, social features, and competitive leaderboards are not part of the initial version.

---

# 3. TECHNOLOGY STACK

## 3.1 Frontend

| Technology | Purpose |
|---|---|
| React.js | Building the user interface |
| Vite | Frontend development server and build tool |
| JavaScript | Application logic |
| CSS | Styling |
| React Router | Page navigation |
| Axios | API communication |

Use plain JavaScript for the initial version. Do not introduce TypeScript unless explicitly approved.

## 3.2 Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend API framework |
| MongoDB | Database |
| Mongoose | Database models and validation |
| Gemini API | AI mystery generation |

## 3.3 AI Integration

**AI Provider:** Google Gemini.

Gemini will be responsible for generating:
- Mystery scenarios.
- Suspect profiles.
- Motives.
- Timelines.
- Evidence descriptions.
- WhatsApp conversations.
- Investigation statements.
- Evidence relationships.
- Final explanations.

Gemini must return structured JSON rather than unstructured paragraphs wherever possible.

## 3.4 AI-Generated Media

The application will support different types of evidence.

| Evidence type | Generation method |
|---|---|
| WhatsApp chats | Gemini-generated structured text |
| Written statements | Gemini-generated text |
| Investigation reports | Gemini-generated text |
| Photographs | AI image-generation service |
| CCTV recordings | AI video-generation service or generated video assets |
| Audio recordings | AI audio-generation service, if introduced later |

Gemini is the primary reasoning and story-generation provider. Image and video generation capabilities must be treated as separate provider integrations unless the selected Gemini model and API explicitly support the required media generation.

Do not assume that the text-generation API automatically generates images or videos.

For the MVP, text-based evidence and image evidence take priority. CCTV video can initially be represented using a fictional recording interface with generated still frames and timestamps.

---

# 4. APPLICATION WORKFLOW

## 4.1 Complete User Journey

1. User visits the website.
2. User lands on the homepage.
3. User clicks "Create Mystery".
4. User enters a scenario or story.
5. User selects mystery difficulty.
6. User selects the mystery category.
7. User clicks "Generate Mystery".
8. Frontend sends the input to the backend.
9. Backend validates the request.
10. Backend sends the generation instructions to Gemini.
11. Gemini generates the complete investigation.
12. Backend validates the generated JSON.
13. Backend stores the mystery in MongoDB.
14. User is redirected to the investigation room.
15. User explores suspects and evidence.
16. User reviews all available clues.
17. User selects the suspected culprit.
18. User submits the final answer.
19. Backend compares the selection against the stored culprit.
20. User sees the result and final explanation.

## 4.2 Application Flow Diagram

User Input  
↓  
Frontend (React)  
↓  
Express Backend  
↓  
Input Validation  
↓  
Gemini API  
↓  
Structured Mystery Generation  
↓  
Output Validation  
↓  
MongoDB Storage  
↓  
Investigation Room  
↓  
Evidence Exploration  
↓  
Culprit Selection  
↓  
Answer Validation  
↓  
Final Solution Reveal

---

# 5. FUNCTIONAL REQUIREMENTS

## FR-001: Homepage

The homepage must contain:
- Application name and branding.
- Short description of the game.
- Create Mystery button.
- Explanation of how the application works.
- Attractive mystery-themed design.

The interface should be simple and beginner-friendly for users.

## FR-002: Mystery Creation

The user must be able to provide:

1. Scenario or story.
2. Mystery category.
3. Difficulty level.

Example:

Scenario: A valuable diamond disappears from a museum.

Category:
- Murder Mystery.
- Theft.
- Missing Person.
- Suspicious Incident.
- General Mystery.

Difficulty:
- Easy.
- Medium.
- Hard.

The user must be able to generate a mystery from this input.

Validation:
- Scenario cannot be empty.
- Scenario must have a configurable minimum and maximum length.
- Category must be from the supported categories.
- Difficulty must be from the supported levels.

Initial recommended scenario length: 30–2,000 characters.

## FR-003: AI Mystery Generation

The backend must send the scenario to Gemini with a structured generation prompt.

Gemini must generate:

- Mystery title.
- Incident description.
- Location.
- Date and time.
- Suspects.
- Suspect profiles.
- Motives.
- Timeline.
- Actual culprit.
- Evidence.
- Evidence descriptions.
- Clue relationships.
- Contradictions.
- Final explanation.

The mystery must contain one definitive culprit in the initial version.

The generated mystery must be internally consistent.

The culprit must be selected during generation and stored securely before investigation begins.

## FR-004: Suspect Management

Each mystery must contain 3–5 suspects.

Each suspect must have:

- Unique ID.
- Full name.
- Age.
- Occupation.
- Background.
- Relationship with the victim or incident.
- Possible motive.
- Alibi.
- Personality description.

The actual culprit must be one of the generated suspects.

The user must be able to open and explore each suspect profile.

## FR-005: Evidence Generation

Each mystery must contain approximately 5–8 pieces of evidence.

Evidence must support the investigation and help users identify the culprit.

Supported evidence categories:

1. Chat conversations.
2. Photographs.
3. CCTV recordings.
4. Written statements.
5. Documents.
6. Timeline records.

Each evidence item must include:

- Unique evidence ID.
- Evidence title.
- Evidence type.
- Description.
- Content or media reference.
- Timestamp, if applicable.
- Related suspect IDs.
- Investigation relevance.

Not every piece of evidence should directly reveal the culprit.

Some evidence should be misleading but logically explainable.

## FR-006: Investigation Room

The investigation room is the primary gameplay interface.

It must display:

- Mystery title.
- Incident overview.
- Suspect list.
- Evidence collection.
- Investigation timeline.
- Investigation progress.
- Culprit selection section.

The user should be able to switch between different evidence categories without losing investigation progress.

## FR-007: Evidence Viewer

When a user selects an evidence item, the application must display its details.

Examples:

**WhatsApp Evidence**
- Chat interface.
- Sender names.
- Message timestamps.
- Message content.

**Image Evidence**
- Image preview.
- Description.
- Capture time, if applicable.

**CCTV Evidence**
- Recording-style interface.
- Camera location.
- Timestamp.
- Video or generated still frames.

**Document Evidence**
- Document preview.
- Relevant text.
- Associated metadata.

All evidence must be fictional and generated for the mystery.

## FR-008: Culprit Selection

The user must be able to select one suspect as the culprit.

The application must:
- Display all available suspects.
- Allow selection of one suspect.
- Require confirmation before submission.
- Prevent multiple final submissions.
- Validate the selected suspect ID.

## FR-009: Result Evaluation

The backend compares the selected suspect ID with the actual culprit ID stored in the database.

The application must display:

- Correct or incorrect result.
- Actual culprit's name.
- Culprit's motive.
- Explanation of the incident.
- Evidence that revealed the truth.
- Explanation of misleading clues.
- Complete investigation timeline.

The result must be based on the stored solution, not a newly generated Gemini response.

Gemini may optionally assist in presenting an explanation, but it must never determine the correctness of the answer.

## FR-010: Mystery Completion

After submission:
- Mark the mystery as completed.
- Store the user's selected suspect.
- Store the result.
- Display the solution.
- Prevent answer modification.

The user may return to review the mystery and its evidence.

---

# 6. AI GENERATION SPECIFICATION

This is one of the most important sections of the entire project.

The quality of the application depends on the logical consistency of the mysteries generated by Gemini.

## 6.1 Gemini's Responsibility

Gemini acts as a mystery architect.

It must create the entire investigation as one logically connected system.

The AI must not generate unrelated suspects, random evidence, and an arbitrary culprit.

Every important clue must have a purpose.

## 6.2 Mystery Generation Rules

The following rules are mandatory:

1. Every mystery must have exactly one culprit.
2. The culprit must belong to the generated suspect list.
3. Every suspect must have a believable motive or reason for being investigated.
4. The actual culprit must have a logically supported motive.
5. The timeline must be consistent.
6. Evidence timestamps must not contradict the timeline without an intentional explanation.
7. At least two independent clues should support the final solution.
8. Misleading clues must have an explainable interpretation.
9. The final explanation must account for the important evidence.
10. No evidence should contradict the actual solution accidentally.
11. The solution must be determined before the user begins investigating.
12. The user must not receive the culprit ID or solution through frontend API responses before submission.

## 6.3 Generation Strategy

Use a single structured generation request for the initial MVP.

The AI should generate the mystery, suspects, solution, and evidence together.

This reduces:
- API calls.
- Token consumption.
- Implementation complexity.
- Risk of inconsistent generated content.

Do not generate each suspect or evidence item through separate Gemini calls in the MVP.

## 6.4 Gemini Output Structure

The expected response should follow this structure:

```json
{
  "title": "The Midnight Mystery",
  "category": "murder",
  "difficulty": "medium",
  "incident": {
    "description": "Incident description",
    "location": "Office",
    "dateTime": "2026-01-15T23:00:00Z"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Rahul",
      "age": 32,
      "occupation": "Assistant",
      "background": "Background details",
      "motive": "Possible motive",
      "alibi": "Claimed alibi"
    }
  ],
  "timeline": [
    {
      "time": "22:00",
      "event": "Someone entered the office"
    }
  ],
  "evidence": [
    {
      "id": "evidence_1",
      "type": "chat",
      "title": "Suspicious WhatsApp Chat",
      "description": "A conversation between two suspects",
      "content": {
        "messages": [
          {
            "sender": "Rahul",
            "time": "21:30",
            "message": "We need to talk."
          }
        ]
      },
      "relatedSuspectIds": ["suspect_1"],
      "relevance": "Reveals a timeline inconsistency"
    }
  ],
  "solution": {
    "culpritId": "suspect_1",
    "motive": "Actual motive",
    "explanation": "Complete explanation",
    "keyEvidenceIds": ["evidence_1"],
    "misleadingClues": [
      "Explanation of misleading evidence"
    ]
  }
}
```

This is a conceptual schema. The final implementation must define and validate a complete JSON Schema or equivalent Mongoose validation rules.

The backend must reject malformed or incomplete AI responses.

Do not trust the AI response blindly.

## 6.5 AI Validation

After Gemini generates a mystery, the backend must validate:

- Required fields exist.
- All IDs are unique.
- Suspects count is within limits.
- Evidence count is within limits.
- Culprit ID matches a suspect ID.
- All related suspect IDs exist.
- All key evidence IDs exist.
- The JSON structure is valid.
- All required explanation fields exist.

If validation fails, allow a limited retry.

Recommended maximum: one repair attempt.

If the response remains invalid, return a user-friendly error rather than storing incomplete data.

---

# 7. TOKEN OPTIMIZATION STRATEGY

**This section is mandatory for all AI coding agents working on the project.**

The project must be developed with awareness of Codex and Antigravity context-window limits, token consumption, and usage limits.

The goal is to avoid repeatedly sending large amounts of unnecessary information to coding agents.

## 7.1 Core Principle

Do not make Codex or Antigravity read the complete master specification every time they perform a small task.

Instead, use a layered documentation system.

### Documentation Hierarchy

| File | Purpose |
|---|---|
| AGENTS.md | Permanent instructions for coding agents |
| SPEC.md | Master project specification |
| ARCHITECTURE.md | System architecture |
| API.md | API contracts |
| AI_RULES.md | Gemini generation rules |
| DATA_MODELS.md | Database schemas |
| TASKS.md | Development progress |
| DECISIONS.md | Approved technical decisions |

`AGENTS.md` must be short and act as the entry point.

Other documents must contain the detailed requirements.

## 7.2 Token-Efficient Agent Instructions

Every coding agent must follow these rules:

1. Read AGENTS.md first.
2. Read only the documentation relevant to the assigned task.
3. Inspect existing code before making changes.
4. Never read the entire repository unnecessarily.
5. Avoid rewriting working files without a reason.
6. Do not regenerate existing components unnecessarily.
7. Do not repeat entire files when only a small modification is required.
8. Do not introduce unnecessary libraries.
9. Do not perform unrelated refactoring.
10. Summarize only the important changes.
11. Update TASKS.md after completing a task.
12. If requirements are unclear, ask for clarification instead of inventing functionality.

## 7.3 Recommended Task Execution

Bad approach:

"Build the entire AI Mystery Room application."

This is too broad. It can lead to:
- Large context consumption.
- Inconsistent code.
- Unnecessary file modifications.
- Difficult debugging.
- Poor architecture.

Recommended approach:

Task 1: Create the React application structure.

Task 2: Implement the homepage.

Task 3: Implement the mystery creation form.

Task 4: Set up the Express backend.

Task 5: Connect MongoDB.

Task 6: Create the mystery generation API.

Task 7: Integrate Gemini.

Task 8: Implement AI response validation.

Task 9: Create the investigation room.

Task 10: Implement suspect and evidence viewers.

Task 11: Implement culprit selection.

Task 12: Implement solution revelation.

Task 13: Perform end-to-end testing.

Each task must be completed and verified before moving to the next dependent task.

## 7.4 Token Budget Policy

Actual token limits vary depending on the selected coding model, subscription, context window, and tool configuration.

Therefore, the following values are internal planning targets, not guaranteed product limits.

Recommended planning budget per coding task:

| Activity | Target budget |
|---|---:|
| Reading relevant instructions | 1,000–2,000 tokens |
| Task description | 300–600 tokens |
| Code implementation | 3,000–6,000 tokens |
| Testing and debugging | 1,000–2,000 tokens |
| Final summary | 200–400 tokens |

Recommended target: Keep routine tasks around 5,000–10,000 tokens where practical.

Do not force a task into this budget if doing so would compromise correctness.

For large tasks, split them into smaller independent tasks.

## 7.5 Context Management

When an agent approaches its context or usage limit:

1. Stop adding unrelated requirements.
2. Save the current implementation state.
3. Update TASKS.md.
4. Record incomplete work.
5. Record relevant files changed.
6. Record unresolved errors.
7. Start a fresh task or session with the required documentation and a concise handoff.

Never depend on the coding agent remembering decisions from a previous session.

The repository documentation must preserve all important decisions.

## 7.6 Gemini Token Optimization

Gemini API calls must also be optimized.

Rules:

- Use one generation call for the complete mystery initially.
- Keep the input scenario concise.
- Avoid unnecessary repeated instructions.
- Request structured JSON.
- Set configurable output-token limits.
- Avoid regenerating an entire mystery when only a display issue needs fixing.
- Never send frontend UI state to Gemini unnecessarily.
- Never send the complete investigation to Gemini when the backend can answer the question directly.
- Do not use Gemini for basic validation, ID comparison, or database operations.

Keep generation settings in configuration rather than scattering model names and token limits throughout the application.

---

# 8. SYSTEM ARCHITECTURE

## 8.1 Architecture Overview

Use a simple three-layer MERN architecture.

**Frontend Layer**
- React components.
- Pages.
- Forms.
- API services.
- Investigation UI.

**Backend Layer**
- Express routes.
- Controllers.
- Services.
- Middleware.
- Gemini integration.
- Validation.

**Database Layer**
- MongoDB.
- Mongoose models.
- Mystery records.
- User progress.

## 8.2 Backend Architecture Rules

Follow this request flow:

Route → Controller → Service → Model

Responsibilities:

**Routes:** Define API endpoints.

**Controllers:** Receive requests and return responses.

**Services:** Contain business logic.

**Models:** Define MongoDB structures.

**Middleware:** Handle authentication, errors, and validation where applicable.

Do not place all application logic inside route files.

Do not create unnecessary abstraction layers.

---

# 9. DATABASE DESIGN

Use MongoDB with Mongoose.

## 9.1 Mystery Collection

Suggested fields:

- _id
- title
- category
- difficulty
- incident
- suspects
- timeline
- evidence
- solution
- status
- createdAt
- updatedAt

The solution must be stored in the backend database but must not be included in public mystery responses before answer submission.

## 9.2 User Collection

Authentication is not required for the initial MVP.

If accounts are introduced later, use:

- _id
- username
- email
- passwordHash
- createdAt

Never store plaintext passwords.

## 9.3 Investigation Collection

Suggested fields:

- _id
- mysteryId
- userId (optional for anonymous users)
- selectedSuspectId
- isCorrect
- exploredEvidenceIds
- status
- submittedAt

Anonymous users may use a session or secure client identifier.

The backend must control final answer evaluation.

---

# 10. API SPECIFICATION

All backend endpoints should use a common response structure.

Successful response:

```json
{
  "success": true,
  "data": {},
  "message": "Request successful"
}
```

Error response:

```json
{
  "success": false,
  "message": "Something went wrong",
  "code": "ERROR_CODE"
}
```

## 10.1 Required Endpoints

### POST /api/mysteries/generate

Purpose: Generate a mystery.

Request:

```json
{
  "scenario": "A diamond disappears from a museum",
  "category": "theft",
  "difficulty": "medium"
}
```

Response:
- Mystery ID.
- Title.
- Incident overview.
- Suspects.
- Timeline.
- Evidence.

Never return the actual solution.

### GET /api/mysteries/:id

Purpose: Retrieve an existing mystery.

Response:
- Mystery information.
- Suspects.
- Evidence.
- Timeline.
- Current status.

The response must exclude the actual culprit and confidential solution.

### GET /api/mysteries/:id/evidence/:evidenceId

Purpose: Retrieve a specific evidence item.

Validate that the evidence belongs to the requested mystery.

### POST /api/mysteries/:id/submit

Purpose: Submit the user's final culprit selection.

Request:

```json
{
  "selectedSuspectId": "suspect_1"
}
```

Response:
- Correct/incorrect result.
- Actual culprit.
- Solution explanation.
- Key evidence.
- Motive.

This endpoint is the only normal gameplay endpoint that reveals the solution.

### GET /api/mysteries/:id/result

Purpose: Retrieve the completed result.

Only return the solution if the investigation has already been submitted or completed.

## 10.2 API Security

- Never expose Gemini API keys.
- Never expose the culprit ID before submission.
- Validate all request parameters.
- Sanitize user input.
- Prevent invalid suspect submissions.
- Apply rate limiting to generation endpoints.
- Restrict access to mystery solution fields.
- Handle unauthorized access.
- Do not allow a user to change an already submitted answer.

For anonymous sessions, ensure users cannot access another session's private investigation results merely by guessing an ID.

---

# 11. FRONTEND PAGE STRUCTURE

The initial application should contain the following pages.

## Page 1: Home Page

Components:
- Navbar.
- Hero section.
- Application introduction.
- How it works.
- Create Mystery button.
- Footer.

## Page 2: Create Mystery Page

Components:
- Scenario input.
- Category selection.
- Difficulty selection.
- Generate button.
- Loading state.
- Error message.

## Page 3: Investigation Room

Components:
- Mystery header.
- Incident overview.
- Suspect cards.
- Evidence navigation.
- Evidence viewer.
- Investigation timeline.
- Culprit selection.

## Page 4: Result Page

Components:
- Correct/incorrect result.
- Actual culprit profile.
- Motive.
- Solution explanation.
- Key evidence.
- Final timeline.
- Play Again button.

---

# 12. UI/UX DESIGN GUIDELINES

The design should feel like a digital detective investigation room.

Recommended visual direction:

- Dark-themed interface.
- Charcoal and deep navy backgrounds.
- Muted red accent colors.
- White or light-grey typography.
- Evidence cards.
- Investigation-board-inspired layouts.
- Subtle animations.
- Clear navigation.
- Responsive design.

The design must prioritize readability.

Do not sacrifice usability for decorative effects.

All evidence should be easy to read and interact with.

The application must work on desktop, tablet, and mobile screens.

---

# 13. PROJECT FOLDER STRUCTURE

Use the following structure as the approved starting architecture.

```text
ai-mystery-room/
│
├── AGENTS.md
├── SPEC.md
├── ARCHITECTURE.md
├── API.md
├── AI_RULES.md
├── DATA_MODELS.md
├── TASKS.md
├── DECISIONS.md
├── README.md
├── .gitignore
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

This is the starting structure. Add files only when needed.

Avoid creating empty folders or unnecessary boilerplate.

---

# 14. ENVIRONMENT CONFIGURATION

Use environment variables.

Backend `.env`:

```env
PORT=5000
MONGODB_URI=
GEMINI_API_KEY=
GEMINI_MODEL=
CLIENT_URL=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Rules:

- Never commit `.env`.
- Provide `.env.example`.
- Never expose Gemini credentials through frontend environment variables.
- Validate required environment variables during backend startup.
- Keep model configuration centralized.

---

# 15. ERROR HANDLING

The application must gracefully handle:

| Error | Expected behavior |
|---|---|
| Invalid scenario | Display validation message |
| Gemini API failure | Display retry message |
| Gemini malformed JSON | Validate and retry once |
| MongoDB unavailable | Display service error |
| Mystery not found | Return 404 |
| Invalid suspect ID | Return 400 |
| Already submitted | Prevent resubmission |
| Network interruption | Allow safe retry |
| Rate limit exceeded | Return 429 |

Do not expose internal stack traces or API credentials to the frontend.

---

# 16. SECURITY REQUIREMENTS

1. Store all API keys on the backend.
2. Validate user input.
3. Sanitize generated and user-provided content before rendering.
4. Prevent XSS attacks.
5. Implement API rate limiting.
6. Protect confidential mystery solutions.
7. Validate all MongoDB IDs.
8. Avoid exposing internal server errors.
9. Restrict file uploads if introduced.
10. Ensure generated media is served through controlled URLs.

**Critical security rule:** The actual culprit and solution must never be exposed in the browser's initial mystery API response, HTML, frontend state, or public network payloads.

---

# 17. TESTING REQUIREMENTS

## 17.1 Frontend Testing

- Homepage renders correctly.
- Scenario form validates input.
- Category selection works.
- Difficulty selection works.
- Evidence viewer displays correct content.
- Suspect selection works.
- Result page displays correctly.

## 17.2 Backend Testing

- Mystery generation endpoint works.
- Invalid requests are rejected.
- Gemini output is validated.
- Invalid AI responses are handled.
- MongoDB persistence works.
- Mystery retrieval works.
- Culprit validation works.
- Solution is not leaked before submission.
- Duplicate submissions are prevented.

## 17.3 AI Testing

Test Gemini using different scenarios.

Check:
- Are the suspects believable?
- Is there exactly one culprit?
- Are the clues connected?
- Are timestamps consistent?
- Can the user reasonably solve the mystery?
- Does the final explanation match the evidence?
- Are misleading clues explainable?

A mystery must pass structural and logical validation before becoming playable.

---

# 18. DEVELOPMENT PHASES

Development must happen in small, manageable phases.

## Phase 1: Project Setup

- Initialize MERN project.
- Configure React and Vite.
- Configure Express.
- Connect MongoDB.
- Configure environment variables.
- Create basic folder structure.

**Completion:** Frontend and backend run successfully.

## Phase 2: Frontend Foundation

- Create homepage.
- Create navigation.
- Create mystery creation page.
- Build reusable components.
- Implement responsive design.

**Completion:** User can enter and submit a scenario to a mock API.

## Phase 3: Backend Foundation

- Create routes.
- Create controllers.
- Create services.
- Create Mongoose models.
- Implement request validation.
- Implement error handling.

**Completion:** Backend APIs work with mock mystery data.

## Phase 4: Gemini Integration

- Configure Gemini SDK.
- Create mystery generation prompt.
- Generate structured JSON.
- Validate Gemini responses.
- Save mysteries in MongoDB.

**Completion:** User can generate and save a mystery.

## Phase 5: Investigation Interface

- Display incident overview.
- Display suspects.
- Display evidence.
- Build WhatsApp evidence viewer.
- Build image evidence viewer.
- Build CCTV-style evidence viewer.
- Display investigation timeline.

**Completion:** User can investigate a generated mystery.

## Phase 6: Answer Submission

- Implement suspect selection.
- Implement answer submission.
- Compare selected suspect with actual culprit.
- Display final solution.
- Store investigation result.

**Completion:** Complete mystery-solving workflow works.

## Phase 7: Testing and Refinement

- Test different scenarios.
- Test AI consistency.
- Fix UI issues.
- Fix backend errors.
- Optimize token consumption.
- Test responsive layouts.
- Update documentation.

**Completion:** MVP is stable and ready for demonstration.

---

# 19. MVP VS FUTURE ENHANCEMENTS

## MVP – Must Have

- Scenario input.
- Mystery generation through Gemini.
- 3–5 suspects.
- 5–8 evidence items.
- Structured investigation.
- WhatsApp-style chat evidence.
- Image evidence support.
- CCTV-style evidence representation.
- Culprit selection.
- Correct/incorrect evaluation.
- Solution reveal.
- MongoDB persistence.
- Responsive design.

## Future Enhancements – Not in MVP

- User registration and login.
- Mystery history.
- User profiles.
- Difficulty-based scoring.
- Leaderboards.
- Multiplayer investigation.
- Collaborative investigation.
- AI-generated real video clips.
- AI-generated voice recordings.
- Hints system.
- Mystery sharing.
- Community-created mysteries.

Do not implement future enhancements unless explicitly approved.

---

# 20. DEFINITION OF DONE

The initial project is considered complete when:

- [ ] MERN application is working.
- [ ] Gemini integration is functional.
- [ ] User can enter a custom scenario.
- [ ] AI generates a complete mystery.
- [ ] Each mystery has one valid culprit.
- [ ] All suspects are displayed.
- [ ] All evidence is accessible.
- [ ] Evidence is logically connected.
- [ ] User can investigate the mystery.
- [ ] User can submit a culprit.
- [ ] Correctness is evaluated by the backend.
- [ ] Final solution is revealed.
- [ ] The solution is protected before submission.
- [ ] Generated mysteries are saved in MongoDB.
- [ ] Error handling works.
- [ ] Security requirements are satisfied.
- [ ] Core tests pass.
- [ ] README documentation is complete.
- [ ] A beginner can explain the architecture and workflow.

---

# 21. CODING AGENT RULES – NON-NEGOTIABLE

These rules apply to Codex, Antigravity, and any other AI coding agent working on this repository.

1. SPEC.md is the single source of truth for product requirements.
2. AGENTS.md is the entry point for development instructions.
3. Never invent additional features.
4. Never change the approved technology stack without permission.
5. Never introduce unnecessary dependencies.
6. Use simple, readable JavaScript.
7. Write beginner-friendly code with meaningful variable names.
8. Keep components and functions small.
9. Follow the approved folder structure.
10. Keep frontend, backend, and AI responsibilities separate.
11. Never expose confidential mystery solutions.
12. Never expose Gemini API keys.
13. Never trust unvalidated Gemini output.
14. Never generate inconsistent evidence intentionally unless the inconsistency is part of the designed mystery.
15. Do not modify unrelated working code.
16. Do not duplicate existing functionality.
17. Test every implemented feature.
18. Update documentation when implementation changes.
19. Update TASKS.md after every completed development task.
20. Explain important implementation decisions in simple language.

## Beginner-Friendly Coding Rule

A beginner should be able to open any important project file and understand:

- What the file does.
- Why it exists.
- What information it receives.
- What information it returns.
- Which other file it communicates with.

Use comments for non-obvious logic, not for every line of code.

Avoid unnecessarily complicated design patterns.

---

# 22. REQUIRED AGENTS.MD CONTENT

The following should be maintained as the short, permanent instruction file for AI coding agents.

```md
# AI Mystery Room - Agent Instructions

## Project
AI Mystery Room is a MERN-based AI mystery-solving
application powered by Google Gemini.

## Source of Truth
- SPEC.md: Product requirements and business rules.
- ARCHITECTURE.md: Technical architecture.
- API.md: API contracts.
- AI_RULES.md: Gemini generation rules.
- DATA_MODELS.md: Database structure.
- TASKS.md: Development progress.
- DECISIONS.md: Approved technical decisions.

## Mandatory Rules
1. Read this file before starting work.
2. Read only relevant documentation for each task.
3. Follow SPEC.md strictly.
4. Do not invent features.
5. Use JavaScript, React, Node, Express and MongoDB.
6. Keep code beginner-friendly.
7. Use small, reusable components.
8. Follow Route -> Controller -> Service -> Model.
9. Never expose the mystery solution before submission.
10. Never expose Gemini API keys.
11. Validate every Gemini response.
12. Avoid unnecessary dependencies.
13. Inspect existing code before editing.
14. Do not modify unrelated files.
15. Test changes before marking tasks complete.
16. Update TASKS.md after completing a task.
17. Document important architectural decisions.
18. Ask before changing approved requirements.

## Token Efficiency
- Never read all documentation unless necessary.
- Never scan the entire repository for a small task.
- Avoid repeated explanations.
- Keep task scope limited.
- Reuse existing components and services.
- Summarize only relevant changes.

## Development Workflow
1. Understand the task.
2. Read relevant specifications.
3. Inspect related code.
4. Implement the smallest complete change.
5. Test the implementation.
6. Update documentation.
7. Report files changed and tests performed.
```

---

# 23. FINAL PROJECT SUCCESS CRITERIA

AI Mystery Room must deliver a complete and enjoyable mystery-solving experience.

The application must not simply generate random text and call it a mystery.

It must create a connected investigation where:

- Every suspect has a believable background.
- Every clue has a purpose.
- The timeline makes sense.
- The culprit has a motive.
- Evidence supports the actual solution.
- Misleading evidence can be explained.
- The user has enough information to solve the mystery.
- The final revelation explains the entire investigation.

**The most important quality metric is logical consistency, not the amount of AI-generated content.**

The application must also remain easy to understand, easy to maintain, and efficient to develop using AI coding agents.

---

**END OF MASTER SPECIFICATION**

**Document Owner:** AI Mystery Room Project  
**Version:** 1.0  
**Authority:** This document is the approved initial baseline. Any requirement changes must be documented and approved before implementation.