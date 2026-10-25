// Local stand-in for the mail provider, used only by the e2e suite.
// POST /emails   records the message (500 if the text contains FORCE_FAIL)
// GET  /received returns everything recorded so far
import { createServer } from "node:http";

const received = [];

createServer((req, res) => {
  const send = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  };

  if (req.method === "GET" && req.url === "/health")
    return send(200, { ok: true });
  if (req.method === "GET" && req.url === "/received")
    return send(200, received);

  if (req.method === "POST" && req.url === "/emails") {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      const body = JSON.parse(raw || "{}");
      if (req.headers.authorization !== "Bearer e2e-key") {
        return send(401, { error: "bad key" });
      }
      if (String(body.text).includes("FORCE_FAIL")) {
        return send(500, { error: "simulated provider failure" });
      }
      received.push(body);
      send(200, { id: `fake-${received.length}` });
    });
    return;
  }
  send(404, { error: "not found" });
}).listen(4010, () => console.log("fake mail server on :4010"));
