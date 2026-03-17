export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Missing name");
  }

  const payload = {
    name,
    exp: Date.now() + 15 * 60 * 1000
  };

  const encoded = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64");

  res.status(200).json({
    link: `/api/download?data=${encoded}`
  });
}
