import { v4 as uuidv4 } from "uuid";

export default function handler(req, res) {
  const { data } = req.query;

  if (!data) {
    return res.status(400).send("Invalid link");
  }

  let decoded;

  try {
    decoded = JSON.parse(
      Buffer.from(data, "base64").toString()
    );
  } catch {
    return res.status(400).send("Corrupted data");
  }

  if (Date.now() > decoded.exp) {
    return res.status(410).send("Link đã hết hạn");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>

<key>PayloadDisplayName</key>
<string>Locket User 15s - ${decoded.name}</string>

<key>PayloadIdentifier</key>
<string>com.nextdns.profile.${decoded.name}</string>

<key>PayloadUUID</key>
<string>${uuidv4()}</string>

<key>PayloadType</key>
<string>Configuration</string>

<key>PayloadContent</key>
<array>
<dict>

<key>DNSSettings</key>
<dict>
<key>DNSProtocol</key>
<string>HTTPS</string>
<key>ServerURL</key>
<string>https://dns.nextdns.io/aa5bc2/</string>
</dict>

<key>PayloadType</key>
<string>com.apple.dnsSettings.managed</string>

</dict>
</array>

</dict>
</plist>`;

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=config.mobileconfig"
  );
  res.setHeader("Content-Type", "application/xml");

  res.send(xml);
}
