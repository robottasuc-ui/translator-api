export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { text, source, target } = req.body;
  if (!text || !target)
    return res.status(400).json({ error: "Missing data" });

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single" +
      `?client=gtx&sl=${source || "auto"}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const r = await fetch(url);
    const data = await r.json();

    let variants = data[0]
      .map(item => item[0])
      .filter(Boolean);

    // убираем формализм
    const blacklist = [
      "Greetings",
      "Salutations",
      "Good day"
    ];

    variants = variants.filter(v => !blacklist.includes(v));

    // самый естественный перевод
    const translatedText =
      variants.sort((a, b) => a.length - b.length)[0];

    res.status(200).json({ translatedText });

  } catch (e) {
    res.status(500).json({ error: "Translation error" });
  }
}
