// Runs on Back4App, not in the browser. Deploy with `b4a deploy` from backend/,
// or upload cloud/ by hand in the dashboard (Cloud Code → Upload, then Deploy).

// Secrets are set on the server, never in the repository. In the Back4App
// dashboard: App Settings → Environment Variables → Add variable,
// with Key DEEPL_KEY and your DeepL key as the Value, then Save changes.
const DEEPL_KEY = process.env.DEEPL_KEY;

// Parse keeps one beforeSave per class, so everything that must happen
// before a TodoItem is saved goes in this one function.
Parse.Cloud.beforeSave("TodoItem", async (request) => {
  const todo = request.object;
  const text = todo.get("text");

  // 1. Refuse what the form would refuse, whoever sends the request.
  if (!text || text.trim().length === 0) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "A to-do needs a text");
  }
  if (text.length > 200) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "A to-do can be at most 200 characters");
  }

  // 2. Translate to Danish, but only when the text is new or changed:
  //    ticking a to-do off saves it too, and that should not cost a translation.
  if (!todo.dirty("text")) return;

  try {
    todo.set("textDanish", await translateToDanish(text));
  } catch (error) {
    // A to-do without its translation is better than a to-do that was not saved.
    console.error("Translation failed:", error.message);
  }
});

async function translateToDanish(text) {
  if (!DEEPL_KEY) {
    throw new Error("DEEPL_KEY is not set in the server's environment variables");
  }
  // free keys end in ":fx" and only work on the free host; paid keys on the other
  const host = DEEPL_KEY.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  const response = await fetch(`https://${host}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: [text], target_lang: "DA" }),
  });
  if (!response.ok) {
    throw new Error(`DeepL answered ${response.status}`);
  }
  const { translations } = await response.json();
  return translations[0].text;
}
