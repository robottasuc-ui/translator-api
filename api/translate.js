export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  const { text, source, target } = req.body;

  if (!text || !target) {
    return res
      .status(400)
      .json({ error: "Введите текст и язык перевода" });
  }

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single" +
      `?client=gtx&sl=${source || "auto"}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const r = await fetch(url);
    const data = await r.json();

    const translatedText = data[0]
      .map(item => item[0])
      .join("");

    return res.status(200).json({ translatedText });
  } catch (e) {
    return res.status(500).json({
      error: "Ошибка соединения. Попробуйте позже"
    });
  }
}
