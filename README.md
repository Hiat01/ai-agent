# 🤖 AI Agent — အခမဲ့ AI စကားပြော Tool

Free AI Agent chat tool — standalone, one tool only. No server, no login, no payment.

အခမဲ့ AI Agent tool တစ်ခုတည်းပါ။ Server မလို၊ Login မလို၊ ငွေမပေးရပါ။

## ဘာလုပ်ပေးလဲ — What it does

- 💬 **Chat** — AI နဲ့ စကားပြောလို့ရပါတယ် (စာရိုက်မေးရုံ)
- 📣 **Facebook post ရေးပေးပါ** — post ရေးခိုင်းလို့ရပါတယ်
- 📝 **စာအကျဉ်းချုပ်ပေးပါ** — စာရှည်ကို အကျဉ်းချုပ်ခိုင်းလို့ရပါတယ်
- 🌐 **မြန်မာ-အင်္ဂလိပ် ဘာသာပြန်ပါ** — ဘာသာပြန်ခိုင်းလို့ရပါတယ်
- 💡 **caption / idea ထုတ်ပေးပါ** — caption နဲ့ idea ထုတ်ခိုင်းလို့ရပါတယ်
- 📝 **Offline အကျဉ်းချုပ်** — Key မရှိရင်တောင် စက်ထဲမှာပဲ အဓိက စာကြောင်း ၃ ကြောင်း ထုတ်ပေးပါတယ်
- 📣 **Offline Post Template** — Key မရှိရင် post template ထုတ်ပေးပါတယ်

## ဘယ်လိုသုံးမလဲ — How to use

1. ဒီ folder (`index.html`, `style.css`, `app.js`) ကို browser မှာ ဖွင့်ပါ — ဒါမှမဟုတ် GitHub Pages မှာ တင်ပြီး link ကနေ ဖွင့်ပါ။
2. **Settings** ကို ဖွင့်ပါ။
3. ကိုယ့်ရဲ့ **OpenAI-compatible API key** ကို ထည့်ပါ — OpenRouter (free model) ဒါမှမဟုတ် FreeModel က key သုံးလို့ရပါတယ်။
   - Endpoint (default): `https://openrouter.ai/api/v1/chat/completions`
   - Model (default): `meta-llama/llama-3.3-70b-instruct:free`
   - FreeModel သုံးရင် endpoint နဲ့ model နာမည်ကို FreeModel ကပေးတဲ့ အတိုင်း လဲပါ။
4. **Key သိမ်းမယ်** ကို နှိပ်ပါ — key ကို ဒီ browser ရဲ့ localStorage ထဲမှာပဲ သိမ်းပါတယ်။
5. **စမ်းကြည့်မယ်** နဲ့ key အလုပ်လုပ်လား စစ်ပါ။
6. စာရိုက်မေးပါ၊ ဒါမှမဟုတ် အပေါ်က quick-action ခလုတ်တွေကို နှိပ်ပါ။

Key မရှိရင် AI အဖြေ မရပါ — ဒါပေမယ့် Offline အကျဉ်းချုပ်နဲ့ Post Template ကို သုံးလို့ရပါတယ်။

## GitHub Pages မှာ အခမဲ့ တင်နည်း — Deploy free on GitHub Pages

1. GitHub မှာ repo အသစ် ဖွင့်ပါ (ဥပမာ `ai-agent`)၊ Public ထား။
2. ဒီ folder ထဲက `index.html`, `style.css`, `app.js`, `README.md` တို့ကို repo ထဲ တင်ပါ။
3. GitHub repo → **Settings → Pages** → **Build and deployment → Source: Deploy from a branch** → Branch: `main`, Folder: `/ (root)` → **Save**။
4. ခဏစောင့်ပြီး Pages က ပေးတဲ့ link (`https://<username>.github.io/ai-agent/`) ကနေ ဖွင့်သုံးပါ။

## Privacy — လုံခြုံမှု

- 🔒 API key ကို **browser localStorage ထဲမှာပဲ** သိမ်းပါတယ် — code ထဲမှာ key မရှိဘူး၊ server ကို key မပို့ဘူး။
- 🔒 စာတွေ၊ chat history တွေက ဒီ စက်ထဲမှာပဲ — server မရှိလို့ ဘယ်မှ မရောက်ဘူး။
- 🔒 AI သုံးရင်တော့ ကိုယ်ရွေးတဲ့ API endpoint ကိုပဲ စာပို့ပါတယ် (OpenRouter / FreeModel)။
- ⚠️ Password, wallet seed phrase, bank အချက်အလက်တွေ ဘယ်တော့မှ ဒီ chat ထဲ မရိုက်ပါနဲ့။
- Key ကို ဖျက်ချင်ရင် **Key ဖျက်မယ်** ကို နှိပ်ပါ။

## Files

- `index.html` — page
- `style.css` — design
- `app.js` — chat + settings + offline helpers (client-side only)
- `README.md` — ဒီဖိုင်
