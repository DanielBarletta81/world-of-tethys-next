import fs from "node:fs";

function requireEnv(keys) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error("❌ Missing required env vars:");
    missing.forEach((k) => console.error(`- ${k}`));
    process.exit(1);
  }
  console.log("✅ Env vars present");
}

function fileExists(p) {
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing file: ${p}`);
    process.exit(1);
  }
  console.log(`✅ Found ${p}`);
}

async function ping(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 6000);

  try {
    for (const k of ["NEXT_PUBLIC_FIREBASE_API_KEY","NEXT_PUBLIC_FIREBASE_PROJECT_ID","WORDPRESS_API_URL"]) {
  const v = process.env[k];
  console.log(`${k}: ${v ? "(set)" : "(missing)"}`);
}

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: "{ __typename }" }),
      signal: controller.signal
    });

    clearTimeout(t);

    if (!res.ok) {
      console.error(`❌ WORDPRESS_API_URL responded ${res.status} ${res.statusText}`);
      process.exit(1);
    }

    const text = await res.text();
    if (!text.trim().startsWith("{")) {
      console.error("❌ WORDPRESS_API_URL did not return JSON. Is this the WPGraphQL endpoint?");
      process.exit(1);
    }

    console.log("✅ WORDPRESS_API_URL reachable (GraphQL probe ok)");
  } catch (e) {
    console.error("❌ Failed to reach WORDPRESS_API_URL:", e.name === "AbortError" ? "timeout" : e.message);
    process.exit(1);
  }
}

// ---- run checks ----
fileExists(".env.local");

requireEnv([
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "WORDPRESS_API_URL"
]);

await ping(process.env.WORDPRESS_API_URL);

console.log("✅ Doctor check complete.");
