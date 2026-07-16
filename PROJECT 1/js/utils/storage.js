/* ================================================================
   OSINT GENIUS - Storage Manager
   ================================================================ */
window.Storage = {
  KEYS: {
    cases: 'osint_cases',
    history: 'osint_history',
    notes: 'osint_notes',
    favorites: 'osint_favorites',
    settings: 'osint_settings'
  },

  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },

  _set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch { return false; }
  },

  // Cases
  getCases() { return this._get(this.KEYS.cases); },
  saveCase(c) {
    const cases = this.getCases();
    c.id = c.id || Date.now().toString();
    c.createdAt = c.createdAt || new Date().toISOString();
    c.updatedAt = new Date().toISOString();
    const idx = cases.findIndex(x => x.id === c.id);
    if (idx >= 0) cases[idx] = c; else cases.unshift(c);
    return this._set(this.KEYS.cases, cases);
  },
  deleteCase(id) {
    const cases = this.getCases().filter(c => c.id !== id);
    return this._set(this.KEYS.cases, cases);
  },

  // History
  getHistory() { return this._get(this.KEYS.history); },
  addHistory(entry) {
    const hist = this.getHistory();
    entry.id = Date.now().toString();
    entry.timestamp = new Date().toISOString();
    hist.unshift(entry);
    if (hist.length > 500) hist.pop();
    return this._set(this.KEYS.history, hist);
  },
  clearHistory() { return this._set(this.KEYS.history, []); },

  // Notes
  getNotes() { return localStorage.getItem(this.KEYS.notes) || ''; },
  saveNotes(text) { localStorage.setItem(this.KEYS.notes, text); },

  // Favorites (dorks, etc.)
  getFavorites(ns = 'default') {
    const all = this._get(this.KEYS.favorites);
    return all.filter(f => f.ns === ns);
  },
  addFavorite(item, ns = 'default') {
    const favs = this._get(this.KEYS.favorites);
    item.ns = ns; item.savedAt = new Date().toISOString();
    favs.unshift(item);
    return this._set(this.KEYS.favorites, favs);
  },
  removeFavorite(id, ns = 'default') {
    const favs = this._get(this.KEYS.favorites).filter(f => !(f.id === id && f.ns === ns));
    return this._set(this.KEYS.favorites, favs);
  },

  // Settings
  getSettings() {
    try { return JSON.parse(localStorage.getItem(this.KEYS.settings)) || {}; }
    catch { return {}; }
  },
  saveSetting(key, val) {
    const s = this.getSettings(); s[key] = val;
    localStorage.setItem(this.KEYS.settings, JSON.stringify(s));
  },

  // Stats
  getStats() {
    const hist = this.getHistory();
    const today = new Date().toDateString();
    const todaySearches = hist.filter(h => new Date(h.timestamp).toDateString() === today).length;
    return {
      totalCases: this.getCases().length,
      searchesToday: todaySearches,
      totalSearches: hist.length,
      modulesActive: 16
    };
  },

  exportAll() {
    return {
      cases: this.getCases(),
      history: this.getHistory(),
      notes: this.getNotes(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  },

  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
