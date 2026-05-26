/**
 * Vercel serverless function: proxies file uploads to catbox.moe.
 * Running server-side means no CORS restrictions apply.
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // Read raw body so we can forward the multipart data unchanged
    const chunks = [];
    await new Promise((resolve, reject) => {
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });
    const rawBody = Buffer.concat(chunks);

    const response = await fetch("https://catbox.moe/user.php", {
      method: "POST",
      headers: { "content-type": req.headers["content-type"] },
      body: rawBody,
    });

    const text = (await response.text()).trim();

    if (!text.startsWith("http")) {
      return res.status(502).send(`Unexpected response from storage: ${text}`);
    }

    res.status(200).send(text);
  } catch (err) {
    res.status(500).send(`Upload error: ${err.message}`);
  }
}

export const config = { api: { bodyParser: false } };
