// POST {adminPassword, code?} -> erstellt einen neuen Code, Status unused
// Admin-Passwort steht als Netlify Env-Variable ADMIN_PASSWORD
import { getStore } from '@netlify/blobs';
export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ok:false}), {status:405});
  try {
    const { adminPassword, code } = await req.json();
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ok:false, error:'Falsches Master-Passwort.'}), {status:401, headers:{'Content-Type':'application/json'}});
    }
    const store = getStore('codes');
    let clean = String(code||'').trim().toUpperCase();
    if (!clean) {
      // Zufalls-Code: PAAR-XXXX
      const n = Math.floor(1000 + Math.random()*9000);
      clean = 'PAAR-' + n;
    }
    const exists = await store.get(clean, {type:'json'});
    if (exists) return new Response(JSON.stringify({ok:false, error:'Code existiert schon. Bitte anderen Code wählen.'}), {headers:{'Content-Type':'application/json'}});
    await store.setJSON(clean, {code:clean, status:'unused', createdAt:new Date().toISOString()});
    return new Response(JSON.stringify({ok:true, code:clean}), {headers:{'Content-Type':'application/json'}});
  } catch(e) { return new Response(JSON.stringify({ok:false, error:'Server-Fehler.'}), {status:500}); }
};
