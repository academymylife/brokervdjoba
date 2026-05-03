export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { password, model, max_tokens, system, tools, messages } = req.body;

    const isDemo = password === 'demo';
    if (!isDemo && password !== process.env.APP_PASSWORD) {
      return res.status(401).json({ error: 'Грешна парола' });
    }

    // Retry логика при 529 (Overloaded) и 529 (Too Many Requests)
    const MAX_RETRIES = 3;
    const RETRY_DELAYS = [2000, 4000, 8000]; // 2с, 4с, 8с

    let lastError = null;
    let lastStatus = 500;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {

      // При retry — изчакване преди опит
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt - 1]));
      }

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-beta': 'web-search-2025-03-05'
          },
          body: JSON.stringify({ model, max_tokens, system, tools, messages })
        });

        lastStatus = response.status;

        // Успешен отговор — върни го директно
        if (response.ok) {
          const data = await response.json();
          return res.status(200).json(data);
        }

        // 529 или 529 — retry
        if (response.status === 529 || response.status === 429) {
          const errData = await response.json().catch(() => ({}));
          lastError = errData;
          // Продължи към следващия опит
          continue;
        }

        // Всяка друга грешка — не retry, върни веднага
        const errData = await response.json().catch(() => ({}));
        return res.status(response.status).json(errData);

      } catch (fetchError) {
        // Мрежова грешка — retry
        lastError = { error: fetchError.message };
        continue;
      }
    }

    // Всички опити са изчерпани
    return res.status(lastStatus).json(lastError || { error: 'Overloaded' });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
