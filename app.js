// ====== CONFIG ======
const API_URL = '1YWtmI2u2sHdF-Qd-r4zmF19Dm_VQrSoWbilvv5p9nqU'; // Apps Script Web App URL

async function api(action, data = {}) {
  const body = new URLSearchParams({ action, ...data });
  const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { ok:false, error:'Invalid JSON', raw:text }; }
  if (!json.ok) throw new Error(json.error || 'API error'); return json;
}

// ====== AUTH STORAGE ======
function saveToken(t){ localStorage.setItem('sp_token', t); }
function getToken(){ return localStorage.getItem('sp_token'); }
function clearToken(){ localStorage.removeItem('sp_token'); localStorage.removeItem('sp_name'); localStorage.removeItem('sp_role'); localStorage.removeItem('sp_user'); }

// ====== API WRAPPERS ======
async function login(userId, password){
  const r = await api('login', { userId, password });
  saveToken(r.token);
  const p = r.profile || {};
  localStorage.setItem('sp_name', p.Name||'');
  localStorage.setItem('sp_role', p.Role||'');
  localStorage.setItem('sp_user', p.UserID||'');
  return r;
}
async function me(){
  const token = getToken(); if (!token) throw new Error('No token');
  const r = await api('me', { token }); 
  const p = r.profile || {};
  localStorage.setItem('sp_name', p.Name||''); localStorage.setItem('sp_role', p.Role||''); localStorage.setItem('sp_user', p.UserID||'');
  return p;
}
async function fetchCatalog(){
  const token = getToken(); if (!token) throw new Error('No token');
  const r = await api('catalog', { token });
  return r.items || [];
}
async function submitOrder(payload){
  const token = getToken(); if (!token) throw new Error('No token');
  return api('submitorder', { token, ...payload, lines: JSON.stringify(payload.lines) });
}
async function myOrders(){
  const token = getToken(); if (!token) throw new Error('No token');
  const r = await api('myorders', { token }); return r;
}
async function allOrders(){
  const token = getToken(); if (!token) throw new Error('No token');
  const r = await api('allorders', { token }); return r;
}
async function logout(){
  const token = getToken(); if (token) { try { await api('logout', { token }); } catch(e){} }
  clearToken(); window.location.href = 'index.html';
}
