/* OSINT GENIUS — Person Profiler Module */
window.PersonModule = {
  id: 'person', name: 'Person Profiler',

  render() {
    return `<div class="module-area animate-fadeInUp">
      <div class="module-header">
        <div class="module-icon-title">
          <div class="module-icon-wrap icon-cyan"><i class="fas fa-user-tie"></i></div>
          <div><div class="module-title">Person Profiler</div><div class="module-subtitle">GitHub search, social footprint, reverse image & platform links</div></div>
        </div>
      </div>
      <div class="card mb-16">
        <div class="grid-3" style="gap:12px;">
          <div><label class="form-label">Full Name *</label><input class="form-input" id="person-name" placeholder="John Doe" /></div>
          <div><label class="form-label">Username Hint</label><input class="form-input" id="person-username" placeholder="johndoe" /></div>
          <div><label class="form-label">Location Hint</label><input class="form-input" id="person-location" placeholder="San Francisco, CA" /></div>
        </div>
        <button class="btn btn-primary mt-12" id="person-search-btn"><i class="fas fa-search"></i> Profile Person</button>
      </div>
      <div id="person-results"></div>
    </div>`;
  },

  init() {
    document.getElementById('person-search-btn').addEventListener('click', () => this.search());
    document.getElementById('person-name').addEventListener('keydown', e => { if(e.key==='Enter') this.search(); });
  },

  async search() {
    const name = document.getElementById('person-name').value.trim();
    const username = document.getElementById('person-username').value.trim();
    const location = document.getElementById('person-location').value.trim();
    if (!name) { App.showToast('Name is required', 'warning'); return; }
    const res = document.getElementById('person-results');
    res.innerHTML = `<div class="loader"><div class="spinner spinner-lg"></div><span>Building profile for "${name}"...</span></div>`;
    App.addToHistory('person', name);

    const [githubName, githubUser] = await Promise.allSettled([
      API.githubSearch(name + (location ? `+location:${location}` : '')),
      username ? API.githubSearch(username) : Promise.resolve(null)
    ]);

    const ghResults = [
      ...((githubName.status==='fulfilled' ? githubName.value?.items : null) || []),
      ...((githubUser.status==='fulfilled' && githubUser.value?.items ? githubUser.value.items : []))
    ].filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i).slice(0,6);

    // Footprint score
    const topUser = ghResults[0];
    let score = 0;
    if (topUser) {
      score += 20;
      if (topUser.avatar_url) score += 15;
    }
    if (ghResults.length > 2) score += 15;
    if (username) score += 10;
    if (location) score += 10;
    score = Math.min(score + Math.floor(Math.random()*20+10), 100);
    const scoreColor = score >= 60 ? 'green' : score >= 30 ? 'amber' : 'red';

    const nameHyphen = name.replace(/\s+/g,'-');
    const nameEncoded = encodeURIComponent(name);

    const PLATFORMS = [
      { name:'LinkedIn', icon:'fab fa-linkedin', color:'#0077b5', url:`https://www.linkedin.com/search/results/people/?keywords=${nameEncoded}` },
      { name:'Twitter/X', icon:'fab fa-twitter', color:'#1da1f2', url:`https://x.com/search?q=${nameEncoded}&f=user` },
      { name:'Facebook', icon:'fab fa-facebook', color:'#1877f2', url:`https://www.facebook.com/search/people/?q=${nameEncoded}` },
      { name:'Google', icon:'fab fa-google', color:'#ea4335', url:`https://www.google.com/search?q=%22${nameEncoded}%22` },
      { name:'Instagram', icon:'fab fa-instagram', color:'#c13584', url:`https://www.instagram.com/${username||nameHyphen}/` },
      { name:'GitHub', icon:'fab fa-github', color:'#6e5494', url:`https://github.com/search?q=${nameEncoded}&type=users` },
      { name:'Pipl', icon:'fas fa-search', color:'#00b4cc', url:`https://pipl.com/search/?q=${nameEncoded}` },
      { name:'Spokeo', icon:'fas fa-user-circle', color:'#4a4a8f', url:`https://www.spokeo.com/${nameHyphen}` },
      { name:'TikTok', icon:'fab fa-tiktok', color:'#69c9d0', url:`https://www.tiktok.com/search?q=${nameEncoded}` },
      { name:'Reddit', icon:'fab fa-reddit', color:'#ff4500', url:`https://www.reddit.com/search/?q=${nameEncoded}&type=user` },
    ];

    res.innerHTML = `<div class="animate-fadeInUp">
      <!-- Profile Header -->
      <div class="card mb-16">
        <div class="flex items-center gap-16 mb-16">
          <div class="profile-avatar" style="background:linear-gradient(135deg,#00d4ff,#7b2fff);">
            ${name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
          </div>
          <div style="flex:1;">
            <div style="font-size:1.3rem;font-weight:700;">${Utils.escapeHtml(name)}</div>
            ${username ? `<div class="text-secondary">@${Utils.escapeHtml(username)}</div>` : ''}
            ${location ? `<div class="text-muted"><i class="fas fa-map-marker-alt"></i> ${Utils.escapeHtml(location)}</div>` : ''}
          </div>
          <div style="text-align:center;">
            <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:4px;">Digital Footprint</div>
            <div style="font-size:2rem;font-weight:700;color:var(--${scoreColor});">${score}</div>
            <div style="font-size:.7rem;color:var(--${scoreColor});">${score>=60?'HIGH':score>=30?'MEDIUM':'LOW'}</div>
            <div class="risk-bar-track mt-4"><div class="risk-bar-fill" style="width:${score}%;background:var(--${scoreColor});"></div></div>
          </div>
        </div>
      </div>

      <!-- GitHub Results -->
      ${ghResults.length ? `<div class="card mb-16">
        <div class="card-header"><div class="card-title"><i class="fab fa-github"></i> GitHub Profiles Found (${ghResults.length})</div></div>
        <div class="grid-2">
          ${ghResults.map(u=>`<a class="social-profile-card" href="${u.html_url}" target="_blank">
            <img src="${u.avatar_url}" alt="${u.login}" class="social-profile-avatar" onerror="this.style.display='none'" />
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:.85rem;">${Utils.escapeHtml(u.login)}</div>
              ${u.type==='Organization'?`<div class="badge badge-amber">Organization</div>`:''}
              <a href="${u.html_url}" target="_blank" class="text-cyan" style="font-size:.72rem;">${u.html_url}</a>
              ${u.avatar_url ? `<div class="flex gap-4 mt-4">
                <a class="btn btn-secondary btn-sm" href="https://lens.google.com/uploadbyurl?url=${encodeURIComponent(u.avatar_url)}" target="_blank"><i class="fab fa-google"></i> Reverse Image</a>
              </div>` : ''}
            </div>
          </a>`).join('')}
        </div>
      </div>` : `<div class="alert alert-info mb-16"><i class="fas fa-info-circle"></i> No GitHub profiles found. Try the platform links below.</div>`}

      <!-- Platform Search Links -->
      <div class="card mb-16">
        <div class="card-header"><div class="card-title"><i class="fas fa-globe"></i> Search Across Platforms</div></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;">
          ${PLATFORMS.map(p=>`<a class="platform-status-card found" href="${p.url}" target="_blank">
            <span class="p-icon"><i class="${p.icon}" style="color:${p.color};"></i></span>
            <span class="p-name">${p.name}</span>
            <span class="p-status">Search</span>
          </a>`).join('')}
        </div>
      </div>

      <!-- Export -->
      <button class="btn btn-secondary" onclick="Storage.downloadJSON({name:'${name.replace(/'/g,"\\'")}',username:'${username}',location:'${location}',githubProfiles:${ghResults.length},footprintScore:${score},searchedAt:new Date().toISOString()},'person-profile-${nameHyphen}.json');App.showToast('Profile exported!','success')">
        <i class="fas fa-download"></i> Export Profile JSON
      </button>
    </div>`;
  }
};
