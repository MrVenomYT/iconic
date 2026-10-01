let allPlugins = [];
let currentCategory = 'all';
let aiCharactersList = [];
let activeCharacter = null;

async function loadStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    const prefixEl = document.getElementById('statPrefix');
    if (prefixEl) prefixEl.textContent = data.prefix;
    const cmdEl = document.getElementById('statCommands');
    if (cmdEl) cmdEl.textContent = data.commandsLoaded;
    const pingEl = document.getElementById('statPing');
    if (pingEl) pingEl.textContent = data.ping + 'ms';
    const plgEl = document.getElementById('statPlugins');
    if (plgEl) plgEl.textContent = data.pluginsEnabled;
    const titleEl = document.getElementById('botHeaderTitle');
    if (titleEl) titleEl.textContent = data.botName + ' Bot is Operational';
    const subEl = document.getElementById('botHeaderSub');
    if (subEl) subEl.textContent = data.commandsLoaded + ' commands loaded and ready for interaction.';
  } catch (e) {
    console.error('Failed to load status', e);
  }
}

async function loadPlugins() {
  try {
    const res = await fetch('/api/plugins');
    allPlugins = await res.json();
    renderPlugins();
  } catch (e) {
    console.error('Failed to load plugins', e);
  }
}

async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    const cfg = await res.json();
    const pInput = document.getElementById('configPrefix');
    if (pInput) pInput.value = cfg.prefix || '!';
    const sInput = document.getElementById('configServerId');
    if (sInput) sInput.value = cfg.serverId || '';
    const oInput = document.getElementById('configOwnerId');
    if (oInput) oInput.value = cfg.ownerId || '';
    const mInput = document.getElementById('configModlog');
    if (mInput) mInput.value = cfg.modlogChannel || 'general-log';
    const tInput = document.getElementById('configToken');
    if (tInput && cfg.token) tInput.value = cfg.token;
  } catch (e) {
    console.error('Failed to load config', e);
  }
}

async function loadLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.members.forEach((m) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #232c3d';
      tr.innerHTML = `
        <td style="padding: 12px 14px; font-weight: 700; color: #94a3b8;">#${m.rank}</td>
        <td style="padding: 12px 14px; display: flex; align-items: center; gap: 10px;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">${m.avatar}</div>
          <span style="font-weight: 600; color: #ffffff;">${m.name}</span>
        </td>
        <td style="padding: 12px 14px; color: #60a5fa; font-weight: 700;">Level ${m.level}</td>
        <td style="padding: 12px 14px; color: #e2e8f0;">${m.xp.toLocaleString()} XP</td>
        <td style="padding: 12px 14px; color: #94a3b8;">${m.messages.toLocaleString()} msgs</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Failed to load leaderboard', e);
  }
}

async function loadAICharacters() {
  try {
    const res = await fetch('/api/characters');
    aiCharactersList = await res.json();
    const grid = document.getElementById('charactersGrid');
    if (!grid) return;
    grid.innerHTML = '';
    aiCharactersList.forEach((char) => {
      const card = document.createElement('div');
      card.style.background = '#181d2a';
      card.style.border = '1px solid #242c3d';
      card.style.borderRadius = '10px';
      card.style.padding = '14px';
      card.style.cursor = 'pointer';
      card.onclick = () => selectCharacter(char.id);
      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #0284c7; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">${char.name[0]}</div>
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #fff;">${char.name}</div>
            <div style="font-size: 11px; color: #64748b;">${char.universe} &bull; ${char.downloads} adds</div>
          </div>
        </div>
        <div style="font-size: 12px; color: #94a3b8; line-height: 1.4;">${char.role}</div>
      `;
      grid.appendChild(card);
    });
    if (aiCharactersList.length > 0) {
      selectCharacter(aiCharactersList[0].id);
    }
  } catch (e) {
    console.error('Failed to load AI characters', e);
  }
}

function selectCharacter(id) {
  const char = aiCharactersList.find((c) => c.id === id);
  if (!char) return;
  activeCharacter = char;
  const nameEl = document.getElementById('charChatName');
  if (nameEl) nameEl.textContent = char.name;
  const descEl = document.getElementById('charChatDesc');
  if (descEl) descEl.textContent = char.role;
  const box = document.getElementById('charChatMessages');
  if (box) {
    box.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #0284c7; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">${char.name[0]}</div>
        <div>
          <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px;">${char.name} <span style="background: #5865f2; color: #fff; font-size: 9px; padding: 1px 4px; border-radius: 3px;">BOT</span></div>
          <div style="font-size: 13px; color: #cbd5e1; line-height: 1.45; background: #131722; padding: 8px 12px; border-radius: 8px;">${char.initialGreeting}</div>
        </div>
      </div>
    `;
  }
}

async function sendCharacterMessage() {
  const input = document.getElementById('charInput');
  const text = (input ? input.value : '').trim();
  if (!text || !activeCharacter) return;
  input.value = '';

  const box = document.getElementById('charChatMessages');
  if (box) {
    box.innerHTML += `
      <div style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; justify-content: flex-end;">
        <div style="background: #2563eb; color: #fff; font-size: 13px; padding: 8px 12px; border-radius: 8px; max-width: 80%;">
          ${escapeHtml(text)}
        </div>
      </div>
    `;
    box.scrollTop = box.scrollHeight;
  }

  try {
    const res = await fetch('/api/chat-character', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId: activeCharacter.id, userMessage: text })
    });
    const data = await res.json();
    if (box) {
      box.innerHTML += `
        <div style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #0284c7; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">${data.characterName[0]}</div>
          <div>
            <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px;">${data.characterName} <span style="background: #5865f2; color: #fff; font-size: 9px; padding: 1px 4px; border-radius: 3px;">BOT</span></div>
            <div style="font-size: 13px; color: #cbd5e1; line-height: 1.45; background: #131722; padding: 8px 12px; border-radius: 8px;">${escapeHtml(data.reply)}</div>
          </div>
        </div>
      `;
      box.scrollTop = box.scrollHeight;
    }
  } catch (err) {
    console.error('Chat error', err);
  }
}

function renderPlugins() {
  const container = document.getElementById('pluginsContainer');
  if (!container) return;
  container.innerHTML = '';

  const categories = ['Essentials', 'Server Management', 'Utilities', 'Social Alerts', 'Games & Fun', 'Monetization', 'Web3'];

  categories.forEach((cat) => {
    if (currentCategory !== 'all' && currentCategory !== cat) return;

    const pluginsInCat = allPlugins.filter((p) => p.category === cat);
    if (pluginsInCat.length === 0) return;

    const sectionWrap = document.createElement('div');
    sectionWrap.innerHTML = `<h2 class="section-title">${cat}</h2>`;

    const grid = document.createElement('div');
    grid.className = 'plugins-grid';

    pluginsInCat.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'plugin-card';

      let badgeHtml = p.isNew ? '<div class="badge-new">New</div>' : '';

      let btnHtml = '';
      if (p.enabled) {
        btnHtml = `
          <button class="plugin-btn btn-active" onclick="togglePlugin('${p.id}')">
            <span>Active</span>
          </button>
        `;
      } else {
        btnHtml = `
          <button class="plugin-btn btn-enable" onclick="togglePlugin('${p.id}')">
            <span>+ Enable</span>
          </button>
        `;
      }

      card.innerHTML = `
        <div>
          <div class="plugin-card-top">
            <div class="plugin-icon-wrap">
              <span style="font-weight: 700; font-size: 14px;">${p.name[0]}</span>
            </div>
            ${badgeHtml}
          </div>
          <div class="plugin-name">${p.name}</div>
          <div class="plugin-desc">${p.description}</div>
        </div>
        ${btnHtml}
      `;

      grid.appendChild(card);
    });

    sectionWrap.appendChild(grid);
    container.appendChild(sectionWrap);
  });
}

async function togglePlugin(id) {
  try {
    const res = await fetch(`/api/plugins/${id}/toggle`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      const item = allPlugins.find((p) => p.id === id);
      if (item) item.enabled = data.plugin.enabled;
      renderPlugins();
      loadStatus();
      toast(`${item.name} is now ${item.enabled ? 'Active' : 'Disabled'}`);
    }
  } catch (e) {
    toast('Could not toggle plugin');
  }
}

function setTab(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  renderPlugins();
}

function switchView(viewName) {
  const views = ['pluginsView', 'simulatorView', 'settingsView', 'leaderboardView', 'personalizerView', 'charactersView', 'pricingView', 'welcomeView', 'showcaseView'];
  views.forEach((v) => {
    const el = document.getElementById(v);
    if (el) el.style.display = 'none';
  });

  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  const title = document.getElementById('viewTitle');

  if (viewName === 'plugins') {
    const el = document.getElementById('pluginsView');
    if (el) el.style.display = 'block';
    if (title) title.textContent = 'Plugins';
    const nav = document.getElementById('nav-plugins');
    if (nav) nav.classList.add('active');
  } else if (viewName === 'simulator') {
    const el = document.getElementById('simulatorView');
    if (el) el.style.display = 'flex';
    if (title) title.textContent = 'Command Simulator';
    const nav = document.getElementById('nav-simulator');
    if (nav) nav.classList.add('active');
  } else if (viewName === 'settings') {
    const el = document.getElementById('settingsView');
    if (el) el.style.display = 'block';
    if (title) title.textContent = 'Settings';
    const nav = document.getElementById('nav-settings');
    if (nav) nav.classList.add('active');
  } else if (viewName === 'leaderboard') {
    const el = document.getElementById('leaderboardView');
    if (el) el.style.display = 'block';
    if (title) title.textContent = 'Leaderboard Settings';
    const nav = document.getElementById('nav-leaderboard');
    if (nav) nav.classList.add('active');
    loadLeaderboard();
  } else if (viewName === 'personalizer') {
    const el = document.getElementById('personalizerView');
    if (el) el.style.display = 'block';
    if (title) title.textContent = 'Bot Personalizer';
    const nav = document.getElementById('nav-personalizer');
    if (nav) nav.classList.add('active');
  } else if (viewName === 'characters') {
    const el = document.getElementById('charactersView');
    if (el) el.style.display = 'block';
    if (title) title.textContent = 'AI Characters';
    const nav = document.getElementById('nav-characters');
    if (nav) nav.classList.add('active');
    loadAICharacters();
  } else if (viewName === 'pricing') {
    const el = document.getElementById('pricingView');
    if (el) el.style.display = 'block';
    if (title) title.textContent = 'MEE6 AI Plans and Pricing';
    const nav = document.getElementById('nav-pricing');
    if (nav) nav.classList.add('active');
  } else if (viewName === 'welcome') {
    const el = document.getElementById('welcomeView');
    if (el) el.style.display = 'block';
    if (title) title.textContent = 'Welcome and Goodbye';
    const nav = document.getElementById('nav-welcome');
    if (nav) nav.classList.add('active');
  } else if (viewName === 'showcase') {
    const el = document.getElementById('showcaseView');
    if (el) el.style.display = 'block';
    if (title) title.textContent = 'MEE6 Public Showcase';
  }
}

function toggleProfileMenu() {
  const m = document.getElementById('profileDropdown');
  if (!m) return;
  m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

function handleInputKey(e) {
  if (e.key === 'Enter') submitSimCommand();
}

function executeSimCommand(cmd) {
  const input = document.getElementById('cmdInput');
  if (input) input.value = cmd;
  submitSimCommand();
}

async function submitSimCommand() {
  const input = document.getElementById('cmdInput');
  const text = (input ? input.value : '').trim();
  if (!text) return;
  input.value = '';

  appendUserMessage(text);

  try {
    const res = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commandText: text, author: 'ServerOwner' })
    });
    const data = await res.json();

    if (data.responses && data.responses.length > 0) {
      data.responses.forEach((resp) => appendBotResponse(resp));
    } else if (data.message) {
      appendBotResponse({ type: 'text', content: data.message });
    } else if (data.error) {
      appendBotResponse({ type: 'text', content: data.error });
    }
  } catch (err) {
    appendBotResponse({ type: 'text', content: 'Connection notice: ' + err.message });
  }
}

function appendUserMessage(text) {
  const container = document.getElementById('simMessages');
  if (!container) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const wrap = document.createElement('div');
  wrap.className = 'msg-group';
  wrap.innerHTML = `
    <div class="msg-avatar">U</div>
    <div class="msg-body">
      <div class="msg-meta">
        <span class="msg-author">ServerOwner</span>
        <span class="msg-time">Today at ${timeStr}</span>
      </div>
      <div class="msg-content">${escapeHtml(text)}</div>
    </div>
  `;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}

function appendBotResponse(resp) {
  const container = document.getElementById('simMessages');
  if (!container) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const wrap = document.createElement('div');
  wrap.className = 'msg-group';

  let bodyContent = '';
  if (resp.type === 'text') {
    bodyContent = `<div class="msg-content">${escapeHtml(resp.content || '')}</div>`;
  } else if (resp.type === 'embed' && resp.embed) {
    const emb = resp.embed;
    let fieldsHtml = '';
    if (emb.fields && emb.fields.length > 0) {
      fieldsHtml = emb.fields.map((f) => `
        <div style="margin-top: 6px;">
          <div style="font-size: 11.5px; font-weight: 700; color: #94a3b8;">${escapeHtml(f.name || '')}</div>
          <div style="font-size: 12.5px; color: #e2e8f0;">${escapeHtml(f.value || '')}</div>
        </div>
      `).join('');
    }

    let descHtml = emb.description ? `<div class="embed-desc">${escapeHtml(emb.description)}</div>` : '';
    let titleHtml = emb.title ? `<div class="embed-title">${escapeHtml(emb.title)}</div>` : '';

    bodyContent = `
      <div class="discord-embed">
        ${titleHtml}
        ${descHtml}
        ${fieldsHtml}
      </div>
    `;
  } else {
    bodyContent = `<div class="msg-content">${escapeHtml(resp.content || 'Execution complete')}</div>`;
  }

  wrap.innerHTML = `
    <div class="msg-avatar bot-avatar">I</div>
    <div class="msg-body">
      <div class="msg-meta">
        <span class="msg-author">Iconic</span>
        <span class="bot-tag">BOT</span>
        <span class="msg-time">Today at ${timeStr}</span>
      </div>
      ${bodyContent}
    </div>
  `;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}

function clearSimMessages() {
  const el = document.getElementById('simMessages');
  if (el) el.innerHTML = '';
  toast('Console cleared');
}

async function saveConfiguration() {
  const prefix = document.getElementById('configPrefix')?.value?.trim() || '!';
  const token = document.getElementById('configToken')?.value?.trim() || '';
  const serverId = document.getElementById('configServerId')?.value?.trim() || '';
  const ownerId = document.getElementById('configOwnerId')?.value?.trim() || '';
  const modlogChannel = document.getElementById('configModlog')?.value?.trim() || 'general-log';

  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix, token, serverId, ownerId, modlogChannel })
    });
    const data = await res.json();
    if (data.success) {
      toast('Configuration saved successfully');
      loadStatus();
    }
  } catch (err) {
    toast('Failed to save configuration');
  }
}

function updatePersonalizerPreview() {
  const name = document.getElementById('persNameInput')?.value?.trim() || 'Iconic';
  const status = document.getElementById('persStatusSelect')?.value || 'Online';
  const actType = document.getElementById('persActTypeSelect')?.value || 'Listening to';
  const actText = document.getElementById('persActTextInput')?.value?.trim() || '/help';

  const previewName = document.getElementById('prevBotName');
  if (previewName) previewName.textContent = name;
  const previewAct = document.getElementById('prevBotAct');
  if (previewAct) previewAct.textContent = actType + ' ' + actText;
}

function toast(msg) {
  const t = document.getElementById('toastBox');
  if (!t) return;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 2600);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('profileDropdown');
  const btn = document.querySelector('.user-avatar-btn');
  if (menu && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});

function showLanding() {
  const landing = document.getElementById('landingView');
  const dash = document.getElementById('dashboardApp');
  if (landing) landing.style.display = 'flex';
  if (dash) dash.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDashboard(view = 'plugins') {
  const landing = document.getElementById('landingView');
  const dash = document.getElementById('dashboardApp');
  if (landing) landing.style.display = 'none';
  if (dash) dash.style.display = 'flex';
  switchView(view);
}

function enterDashboard() {
  showDashboard('plugins');
}

function openDiscordInvite() {
  const clientId = '852903626871537685';
  const permissions = '8';
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot%20applications.commands&permissions=${permissions}`;
  window.open(inviteUrl, '_blank');
}

let currentUser = null;

async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (data.authenticated && data.user) {
      currentUser = data.user;
      renderUserSession();
    } else {
      currentUser = null;
      renderGuestSession();
    }
  } catch (err) {
    console.error('Failed to check auth', err);
  }
}

function renderUserSession() {
  const loginBtn = document.getElementById('discordLoginBtn');
  const landingLoginBtn = document.getElementById('landingLoginBtn');
  const userBtn = document.getElementById('userAvatarBtn');
  const userInitial = document.getElementById('userInitial');
  const profileName = document.getElementById('profileUsername');

  if (loginBtn) loginBtn.style.display = 'none';
  if (landingLoginBtn) {
    landingLoginBtn.innerHTML = `<span>Dashboard</span>`;
    landingLoginBtn.onclick = () => showDashboard('plugins');
  }
  if (userBtn) userBtn.style.display = 'flex';
  if (userInitial) userInitial.textContent = currentUser.username ? currentUser.username[0].toUpperCase() : 'U';
  if (profileName) profileName.textContent = currentUser.tag || currentUser.username;
}

function renderGuestSession() {
  const loginBtn = document.getElementById('discordLoginBtn');
  const landingLoginBtn = document.getElementById('landingLoginBtn');
  const userBtn = document.getElementById('userAvatarBtn');
  if (loginBtn) loginBtn.style.display = 'inline-flex';
  if (landingLoginBtn) {
    landingLoginBtn.innerHTML = `<span>Login with Discord</span>`;
    landingLoginBtn.onclick = loginWithDiscord;
  }
  if (userBtn) userBtn.style.display = 'none';
}

async function loginWithDiscord() {
  try {
    const res = await fetch('/api/auth/url');
    const data = await res.json();
    const authWindow = window.open(
      data.url,
      'discord_oauth_popup',
      'width=580,height=720,menubar=no,toolbar=no'
    );
    if (!authWindow) {
      toast('Please allow popups to connect Discord account.');
    }
  } catch (err) {
    toast('Could not initiate Discord OAuth.');
  }
}

async function loginDemo(username) {
  try {
    const res = await fetch('/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username || 'mrvenomyt' })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      renderUserSession();
      toast(`Signed in as ${currentUser.tag}`);
    }
  } catch (err) {
    toast('Demo login failed');
  }
}

async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    currentUser = null;
    renderGuestSession();
    const menu = document.getElementById('profileDropdown');
    if (menu) menu.style.display = 'none';
    toast('Logged out from Discord');
  } catch (err) {
    toast('Logout notice: ' + err.message);
  }
}

// Listen for OAuth postMessage from popup
window.addEventListener('message', (event) => {
  const origin = event.origin;
  if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    return;
  }
  if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
    if (event.data.user) {
      currentUser = event.data.user;
      renderUserSession();
    } else {
      checkAuth();
    }
    toast('Successfully connected with Discord');
  }
});

function toggleWgSection(secId) {
  const el = document.getElementById(secId);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleWgSectionExplicit(secId, isChecked) {
  const el = document.getElementById(secId);
  if (!el) return;
  el.style.display = isChecked ? 'block' : 'none';
  toast(isChecked ? 'Module enabled' : 'Module disabled');
}

function setWelcomeCardTextColor(color) {
  const title = document.getElementById('cardTitlePreview');
  const sub = document.getElementById('cardSubPreview');
  if (title) title.style.color = color;
  if (sub) sub.style.color = color === '#ffffff' ? '#94a3b8' : color;
  toast('Welcome card text color updated');
}

function setWelcomeCardBgColor(color) {
  const canvas = document.getElementById('liveWelcomeCanvas');
  if (canvas) canvas.style.background = color;
  toast('Welcome card background color updated');
}

function setWelcomeCardOpacity(val) {
  const canvas = document.getElementById('liveWelcomeCanvas');
  if (canvas) canvas.style.opacity = Math.max(0.2, val / 100);
}

function setWelcomeCardFont(font) {
  const canvas = document.getElementById('liveWelcomeCanvas');
  if (canvas) canvas.style.fontFamily = font;
  toast('Welcome card font updated');
}

function toggleWelcomeCard(checked) {
  const wrap = document.getElementById('wgCardCustomizerWrap');
  if (wrap) wrap.style.display = checked ? 'block' : 'none';
  toast('Welcome card ' + (checked ? 'enabled' : 'disabled'));
}

function setJoinMsgTab(type, btn) {
  const parent = btn.parentElement;
  if (parent) {
    parent.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  }
  toast(`Switched to ${type} message editor`);
}

// Initialize on page load
loadStatus();
loadPlugins();
loadConfig();
checkAuth();
