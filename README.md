# 🤖 AI Agent — Free AI Chat Tool

Free AI Agent chat tool — standalone, one tool only. No server, no login, no payment.

## What it does

- 💬 **Chat** — talk to the AI (just type a message)
- 📣 **Write a Facebook post** — ask it to write a post
- 📝 **Summarize this text** — summarize long text
- 🌐 **Translate Myanmar-English** — translate between Myanmar and English
- 💡 **Generate caption / idea** — generate captions and ideas
- 📝 **Offline Summary** — without a key, it picks the top 3 key sentences on your device
- 📣 **Offline Post Template** — without a key, it gives you a post template

## How to use

1. Open `index.html` in a browser — or host it on GitHub Pages and open it from the link.
2. Open **Settings**.
3. Add your own **OpenAI-compatible API key** — use an OpenRouter (free model) or FreeModel key.
   - Endpoint (default): `https://openrouter.ai/api/v1/chat/completions`
   - Model (default): `meta-llama/llama-3.3-70b-instruct:free`
   - If you use FreeModel, change the endpoint and model name to the ones FreeModel gives you.
4. Click **Save Key** — the key is stored only in this browser's localStorage.
5. Click **Test Key** to check whether the key works.
6. Type a message, or tap one of the quick-action buttons above the chat.

Without a key, the AI cannot reply — but the Offline Summary and Post Template still work.

## Deploy free on GitHub Pages

1. Create a new repo on GitHub (e.g. `ai-agent`), set it to Public.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repo.
3. GitHub repo → **Settings → Pages** → **Build and deployment → Source: Deploy from a branch** → Branch: `main`, Folder: `/ (root)` → **Save**.
4. Wait a moment, then open the site from the Pages link (`https://<username>.github.io/ai-agent/`).

## Privacy

- 🔒 Your API key is stored **only in browser localStorage** — it is not in the code, and it is not sent to any server.
- 🔒 Your messages and chat history stay on this device — there is no server, so they go nowhere.
- 🔒 When you use the AI, your message goes only to the API endpoint you chose (OpenRouter / FreeModel).
- ⚠️ Never type your password, wallet seed phrase, or bank details into this chat.
- To delete the key, click **Delete Key**.

## Files

- `index.html` — page
- `style.css` — design
- `app.js` — chat + settings + offline helpers (client-side only)
- `README.md` — this file
