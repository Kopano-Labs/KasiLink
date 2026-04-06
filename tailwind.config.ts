// Tailwind v4: theme tokens (colors, fonts, radius) are now declared
// via @theme in app/globals.css — not here.
// This file is kept only for editor tooling that reads it.
// The `content` array is also no longer required in v4 (auto-detected),
// but listed here for reference.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode via data-theme attribute (not class) — handled in CSS
};

export default config;
