export default function handler(req, res) {
  const { name } = req.body;

  const payload = {
    name,
    exp: Date.now() + 15 * 60 * 1000
  };

  const encoded = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64");

  res.json({
    data: encoded
  });
}
