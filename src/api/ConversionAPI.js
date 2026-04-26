const apiKey = ""; 
const BASE_MODEL = "gemini-2.5-flash-preview-09-2025";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${BASE_MODEL}:generateContent?key=${apiKey}`;

// Helper for exponential backoff retry logic
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) {
        console.error("Fetch failed after multiple retries:", error);
        throw error;
      }
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Performs currency conversion using Google Search grounding.
 */
export async function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount.toString();

  const userQuery = `What is ${amount} ${fromCurrency} converted to ${toCurrency}? Provide only the final numerical result.`;
  const systemPrompt = "You are a specialized financial calculator. Respond with ONLY the numerical result, formatted to two decimal places, without any currency symbols or extra text.";

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    tools: [{ "google_search": {} }], 
    systemInstruction: { parts: [{ text: systemPrompt }] },
    config: { maxOutputTokens: 50, temperature: 0.1 }
  };

  try {
    const response = await fetchWithRetry(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const resultText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (resultText) {
      const numericResult = parseFloat(resultText.replace(/[^\d.-]/g, ''));
      return isNaN(numericResult) ? "Error: Parse" : numericResult.toFixed(2);
    }
    return "Error: No Result";
  } catch (error) {
    return "API Error";
  }
}

/**
 * Performs number base conversion using the LLM.
 */
export async function convertBase(numberString, fromBase, toBase) {
  if (fromBase === toBase) return numberString;
  if (!numberString) return "0";

  const userQuery = `Convert the number '${numberString}' from base ${fromBase} to base ${toBase}. Respond with ONLY the converted number string.`;
  const systemPrompt = "You are a dedicated number system converter. Your response must contain ONLY the converted number string. Do not include any explanation, context, or surrounding text.";

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    config: { maxOutputTokens: 50, temperature: 0.1 }
  };

  try {
    const response = await fetchWithRetry(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const resultText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    return resultText ? resultText.trim() : "Error: No Result";
  } catch (error) {
    return "API Error";
  }
}
