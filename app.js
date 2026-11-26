/* AI Agent — standalone, all client-side. No hardcoded API keys. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function addMsg(text, who) {
    var log = $('chatLog'); if (!log) return;
    var d = document.createElement('div');
    d.className = 'msg ' + (who || 'ai');
    d.textContent = text;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }

  /* ---------- Share ---------- */
  var shareBtn = $('shareBtn');
  if (shareBtn) shareBtn.addEventListener('click', function () {
    var url = window.location.href;
    function done() { shareBtn.textContent = '✓ ကူးပြီးပြီ / Copied!'; setTimeout(function () { shareBtn.textContent = '🔗 Share / မျှဝေမယ်'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { window.prompt('ဒီ link ကို ကူးပါ:', url); });
    } else { window.prompt('ဒီ link ကို ကူးပါ:', url); }
  });

  /* ---------- Settings: key stored ONLY in localStorage ---------- */
  var LS_KEY = 'aiagent_api_key', LS_EP = 'aiagent_endpoint', LS_MODEL = 'aiagent_model';
  var chatHistory = [];
  try {
    if (localStorage.getItem(LS_EP)) $('apiEndpoint').value = localStorage.getItem(LS_EP);
    if (localStorage.getItem(LS_MODEL)) $('apiModel').value = localStorage.getItem(LS_MODEL);
    if (localStorage.getItem(LS_KEY)) {
      $('apiKey').value = localStorage.getItem(LS_KEY);
      $('keyStatus').textContent = 'Key အခြေအနေ: ✓ သိမ်းထားပြီးပါပြီ (ဒီ browser ထဲမှာပဲ)';
      $('noKeyNotice').style.display = 'none';
    }
  } catch (e) { /* localStorage unavailable — continue without saving */ }

  function getKey() { try { return ($('apiKey').value || '').trim(); } catch (e) { return ''; } }
  function updateNoKeyNotice() {
    $('noKeyNotice').style.display = getKey() ? 'none' : 'block';
  }

  $('saveKeyBtn').addEventListener('click', function () {
    var k = getKey();
    if (!k) { $('keyStatus').textContent = 'Key အခြေအနေ: Key အရင် ရိုက်ထည့်ပါ'; return; }
    try {
      localStorage.setItem(LS_KEY, k);
      localStorage.setItem(LS_EP, $('apiEndpoint').value.trim());
      localStorage.setItem(LS_MODEL, $('apiModel').value.trim());
    } catch (e) {
      $('keyStatus').textContent = 'Key အခြေအနေ: browser က သိမ်းခွင့် မပေးပါ — ဒီ session မှာပဲ သုံးလို့ရပါတယ်';
      return;
    }
    $('keyStatus').textContent = 'Key အခြေအနေ: ✓ သိမ်းပြီးပါပြီ (ဒီ browser ထဲမှာပဲ)';
    updateNoKeyNotice();
  });
  $('clearKeyBtn').addEventListener('click', function () {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    $('apiKey').value = '';
    $('keyStatus').textContent = 'Key အခြေအနေ: ဖျက်ပြီးပါပြီ';
    updateNoKeyNotice();
  });

  async function callAI(userText) {
    var key = getKey();
    var endpoint = ($('apiEndpoint').value || '').trim() || 'https://openrouter.ai/api/v1/chat/completions';
    var model = ($('apiModel').value || '').trim() || 'meta-llama/llama-3.3-70b-instruct:free';
    if (!key) return null;
    var messages = [{ role: 'system', content: 'You are a helpful assistant. Answer in Burmese unless the user asks in English. Keep answers clear and short.' }];
    chatHistory.slice(-10).forEach(function (m) { messages.push(m); });
    messages.push({ role: 'user', content: userText });
    var res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model: model, messages: messages })
    });
    if (!res.ok) {
      var t = ''; try { t = await res.text(); } catch (e) {}
      throw new Error('API error ' + res.status + ': ' + t.slice(0, 200));
    }
    var data = await res.json();
    var out = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return out || '(အဖြေ ဗလာ ဖြစ်နေပါတယ်)';
  }

  async function sendChat(text) {
    var input = (text || $('chatInput').value || '').trim();
    if (!input) return;
    addMsg(input, 'user');
    chatHistory.push({ role: 'user', content: input });
    $('chatInput').value = '';
    $('aiStatus').textContent = 'AI ဖြေနေပါတယ်…';
    if (!getKey()) {
      addMsg('⚠️ API Key မရှိသေးလို့ AI အဖြေ မရသေးပါ။ Settings မှာ ကိုယ့် key ထည့်ပါ။\n\nOffline အကူအညီ: "Offline အကျဉ်းချုပ်" ဒါမှမဟုတ် "Offline Post Template" ခလုတ်ကို သုံးကြည့်ပါ။', 'sys');
      $('aiStatus').textContent = 'Key မရှိပါ — offline helper သုံးပါ';
      return;
    }
    try {
      var reply = await callAI(input);
      addMsg(reply, 'ai');
      chatHistory.push({ role: 'assistant', content: reply });
      $('aiStatus').textContent = '';
    } catch (e) {
      addMsg('❌ AI ခေါ်တာ မအောင်မြင်ပါ: ' + e.message + '\n\nစစ်ပါ: (1) Key မှန်လား (2) Endpoint / Model နာမည် မှန်လား (3) Internet ရှိလား', 'sys');
      $('aiStatus').textContent = 'Error — အပေါ်က အကြောင်းကို စစ်ပါ';
    }
  }
  $('sendBtn').addEventListener('click', function () { sendChat(); });
  $('chatInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  });
  $('testKeyBtn').addEventListener('click', async function () {
    if (!getKey()) { $('keyStatus').textContent = 'Key အခြေအနေ: Key အရင် ရိုက်ထည့်ပါ'; return; }
    $('keyStatus').textContent = 'စမ်းနေပါတယ်…';
    try {
      var r = await callAI('Hello — reply with one short Burmese greeting.');
      $('keyStatus').textContent = '✓ Key အလုပ်လုပ်ပါတယ်: ' + String(r).slice(0, 80);
    } catch (e) { $('keyStatus').textContent = '❌ Key စမ်းတာ မအောင်ပါ: ' + e.message.slice(0, 200); }
  });
  $('clearChatBtn').addEventListener('click', function () {
    $('chatLog').innerHTML = ''; chatHistory = [];
    addMsg('Chat ရှင်းပြီးပါပြီ။ ဘာကူညီပေးရမလဲ?', 'ai');
  });
  document.querySelectorAll('#quickActions .chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var action = chip.getAttribute('data-prompt');
      var topic = ($('chatInput').value || '').trim();
      sendChat(topic ? action + ': ' + topic : action + ' — အကြောင်းအရာ: ' + (topic || ''));
    });
  });

  /* ---------- Offline helpers — no network, no key needed ---------- */
  function offlineSummary() {
    var text = ($('chatInput').value || '').trim();
    if (!text) { addMsg('Offline အကျဉ်းချုပ်: အရင် အပေါ်က စာရိုက်ထည့်ပါ။', 'sys'); return; }
    var sentences = text.split(/(?<=[.!?။])\s+/).filter(function (s) { return s.trim().length > 1; });
    if (sentences.length <= 3) { addMsg('📝 အကျဉ်းချုပ် (offline):\n' + text, 'ai'); return; }
    var scored = sentences.map(function (s) {
      var words = s.trim().split(/\s+/).length;
      var score = Math.min(words, 25);
      if (/အရေးကြီး|အဓိက|ရလဒ်|ဆုံးဖြတ်|ပထမ|နောက်/i.test(s)) score += 5;
      return { s: s.trim(), score: score };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    var top = scored.slice(0, 3).map(function (x) { return '• ' + x.s; }).join('\n');
    addMsg('📝 အကျဉ်းချုပ် (offline — စက်ထဲမှာပဲ တွက်ထားတာ):\n' + top, 'ai');
  }
  function offlinePost() {
    var topic = ($('chatInput').value || '').trim() || 'ဒီနေ့ရဲ့ သတင်းကောင်း';
    var tpl = '📣 ' + topic + '\n\nဒီနေ့ ' + topic + ' အကြောင်း ပြောပြချင်ပါတယ်။\nသင်ရော ဘယ်လိုထင်လဲ? Comment မှာ ပြောပြပေးပါ 👇\n\n#Myanmar #News #Update';
    addMsg('📣 Post Template (offline):\n' + tpl, 'ai');
  }
  $('offlineSummaryBtn').addEventListener('click', offlineSummary);
  $('offlinePostBtn').addEventListener('click', offlinePost);

  updateNoKeyNotice();
})();
