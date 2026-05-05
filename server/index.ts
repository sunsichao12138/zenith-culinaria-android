import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

const { default: app } = await import("./app.js");

const PORT = process.env.SERVER_PORT || 3001;

app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │  🍳 Zenith Culinaria API Server        │
  │  Running on http://localhost:${PORT}      │
  │  Press Ctrl+C to stop                   │
  └─────────────────────────────────────────┘
  `);
});
