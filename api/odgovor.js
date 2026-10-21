export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Napačna metoda' });
  const { imeFirme, tekstOcene } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Manjka AI ključ.' });

  const navodilo = `Dobil si spletno oceno za podjetje "${imeFirme}". Besedilo ocene je: "${tekstOcene}". Napiši kratek, prijazen in profesionalen odgovor v slovenščini, ki ga bo lastnik podjetja objavil kot odgovor stranki na Googlu.`;

  try {
    const response = await fetch(`https://googleapis.com{apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: navodilo }] }] })
    });
    const data = await response.json();
    const aiTekst = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ reply: aiTekst });
  } catch (error) {
    return res.status(500).json({ error: 'Napaka pri klicu AI.' });
  }
}
