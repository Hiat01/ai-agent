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
    function done() { shareBtn.textContent = '✓ Copied!'; setTimeout(function () { shareBtn.textContent = '🔗 Share'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
    } else { window.prompt('Copy this link:', url); }
  });

  /* ---------- Settings: key stored ONLY in localStorage ---------- */
  var LS_KEY = 'aiagent_api_key', LS_EP = 'aiagent_endpoint', LS_MODEL = 'aiagent_model';
  var chatHistory = [];
  try {
    if (localStorage.getItem(LS_EP)) $('apiEndpoint').value = localStorage.getItem(LS_EP);
    if (localStorage.getItem(LS_MODEL)) $('apiModel').value = localStorage.getItem(LS_MODEL);
    if (localStorage.getItem(LS_KEY)) {
      $('apiKey').value = localStorage.getItem(LS_KEY);
      $('keyStatus').textContent = 'Key status: ✓ Saved (in this browser only)';
      $('noKeyNotice').style.display = 'none';
    }
  } catch (e) { /* localStorage unavailable — continue without saving */ }

  function getKey() { try { return ($('apiKey').value || '').trim(); } catch (e) { return ''; } }
  function updateNoKeyNotice() {
    $('noKeyNotice').style.display = getKey() ? 'none' : 'block';
  }

  $('saveKeyBtn').addEventListener('click', function () {
    var k = getKey();
    if (!k) { $('keyStatus').textContent = 'Key status: please enter a key first'; return; }
    try {
      localStorage.setItem(LS_KEY, k);
      localStorage.setItem(LS_EP, $('apiEndpoint').value.trim());
      localStorage.setItem(LS_MODEL, $('apiModel').value.trim());
    } catch (e) {
      $('keyStatus').textContent = 'Key status: browser refused to save — the key works only for this session';
      return;
    }
    $('keyStatus').textContent = 'Key status: ✓ Saved (in this browser only)';
    updateNoKeyNotice();
  });
  $('clearKeyBtn').addEventListener('click', function () {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    $('apiKey').value = '';
    $('keyStatus').textContent = 'Key status: deleted';
    updateNoKeyNotice();
  });

  async function callAI(userText) {
    var key = getKey();
    var endpoint = ($('apiEndpoint').value || '').trim() || 'https://openrouter.ai/api/v1/chat/completions';
    var model = ($('apiModel').value || '').trim() || 'meta-llama/llama-3.3-70b-instruct:free';
    if (!key) return null;
    var messages = [{ role: 'system', content: 'You are a helpful assistant. Answer in English. Keep answers clear and short.' }];
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
    return out || '(empty reply)';
  }

  async function sendChat(text) {
    var input = (text || $('chatInput').value || '').trim();
    if (!input) return;
    addMsg(input, 'user');
    chatHistory.push({ role: 'user', content: input });
    $('chatInput').value = '';
    $('aiStatus').textContent = 'AI is replying…';
    if (!getKey()) {
      addMsg('⚠️ No API key yet, so the AI cannot reply. Add your key in Settings.\n\nOffline help: try the "Offline Summary" or "Offline Post Template" button.', 'sys');
      $('aiStatus').textContent = 'No key — use the offline helpers';
      return;
    }
    try {
      var reply = await callAI(input);
      addMsg(reply, 'ai');
      chatHistory.push({ role: 'assistant', content: reply });
      $('aiStatus').textContent = '';
    } catch (e) {
      addMsg('❌ Could not reach the AI: ' + e.message + '\n\nCheck: (1) Is the key correct? (2) Are the endpoint and model name correct? (3) Are you online?', 'sys');
      $('aiStatus').textContent = 'Error — check the message above';
    }
  }
  $('sendBtn').addEventListener('click', function () { sendChat(); });
  $('chatInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  });
  $('testKeyBtn').addEventListener('click', async function () {
    if (!getKey()) { $('keyStatus').textContent = 'Key status: please enter a key first'; return; }
    $('keyStatus').textContent = 'Testing…';
    try {
      var r = await callAI('Hello — reply with one short English greeting.');
      $('keyStatus').textContent = '✓ Key works: ' + String(r).slice(0, 80);
    } catch (e) { $('keyStatus').textContent = '❌ Key test failed: ' + e.message.slice(0, 200); }
  });
  $('clearChatBtn').addEventListener('click', function () {
    $('chatLog').innerHTML = ''; chatHistory = [];
    addMsg('Chat cleared. How can I help?', 'ai');
  });
  document.querySelectorAll('#quickActions .chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var action = chip.getAttribute('data-prompt');
      var topic = ($('chatInput').value || '').trim();
      sendChat(topic ? action + ': ' + topic : action + ' — topic: ' + (topic || ''));
    });
  });

  /* ---------- Offline helpers — no network, no key needed ---------- */
  function offlineSummary() {
    var text = ($('chatInput').value || '').trim();
    if (!text) { addMsg('Offline summary: type some text in the box first.', 'sys'); return; }
    var sentences = text.split(/(?<=[.!?])\s+/).filter(function (s) { return s.trim().length > 1; });
    if (sentences.length <= 3) { addMsg('📝 Summary (offline):\n' + text, 'ai'); return; }
    var scored = sentences.map(function (s) {
      var words = s.trim().split(/\s+/).length;
      var score = Math.min(words, 25);
      if (/important|key|result|decide|first|next/i.test(s)) score += 5;
      return { s: s.trim(), score: score };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    var top = scored.slice(0, 3).map(function (x) { return '• ' + x.s; }).join('\n');
    addMsg('📝 Summary (offline — computed on this device only):\n' + top, 'ai');
  }
  function offlinePost() {
    var topic = ($('chatInput').value || '').trim() || "Today's good news";
    var tpl = '📣 ' + topic + '\n\nI want to share something about ' + topic + ' today.\nWhat do you think? Tell me in the comments 👇\n\n#AI #News #Update';
    addMsg('📣 Post Template (offline):\n' + tpl, 'ai');
  }
  $('offlineSummaryBtn').addEventListener('click', offlineSummary);
  $('offlinePostBtn').addEventListener('click', offlinePost);

  updateNoKeyNotice();
})();
