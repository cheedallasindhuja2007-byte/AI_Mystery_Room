// client/src/services/api.js
// Automatically use VITE_API_BASE_URL if defined;
// In production builds without explicit URL, use relative '/api' (for single-domain hosting);
// In local development, fall back to 'http://localhost:5000/api'.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data.data;
}

export const api = {
  /**
   * Generate a new mystery with Gemini
   */
  async generateMystery({ scenario, category, difficulty }) {
    const response = await fetch(`${API_BASE_URL}/mysteries/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, category, difficulty }),
    });
    return handleResponse(response);
  },

  /**
   * Fetch a full mystery dossier (omits confidential solution)
   */
  async getMystery(id) {
    const response = await fetch(`${API_BASE_URL}/mysteries/${id}`);
    return handleResponse(response);
  },

  /**
   * List recent mysteries
   */
  async listMysteries() {
    const response = await fetch(`${API_BASE_URL}/mysteries`);
    return handleResponse(response);
  },

  /**
   * Fetch specific evidence item
   */
  async getEvidence(mysteryId, evidenceId) {
    const response = await fetch(`${API_BASE_URL}/mysteries/${mysteryId}/evidence/${evidenceId}`);
    return handleResponse(response);
  },

  /**
   * Submit accusation against a suspect
   */
  async submitAnswer(mysteryId, selectedSuspectId) {
    const response = await fetch(`${API_BASE_URL}/mysteries/${mysteryId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedSuspectId }),
    });
    return handleResponse(response);
  },

  /**
   * Get final solution post-submission
   */
  async getResult(mysteryId) {
    const response = await fetch(`${API_BASE_URL}/mysteries/${mysteryId}/result`);
    return handleResponse(response);
  },
};
