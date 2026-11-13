// POST {adminPassword, code} -> setzt Code zurück auf unused (z.B. wenn Käufer aus Versehen auf Fertig getippt hat)
import { getStore } from '@netlify/blobs';
export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ok:false}), {status:405});
  try {
    const { adminPassword, code } = await req.json();
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ok:false, error:'Falsches Master-Passwort.'}), {status:401, headers:{'Content-Type':'application/json'}});
    }
    const clean = String(code||'').trim().toUpperCase();
    const store = getStore('codes');
    const raw = await store.get(clean, {type:'json'});
    if (!raw) return new Response(JSON.stringify({ok:false, error:'Code nicht gefunden.'}), {headers:{'Content-Type':'application/json'}});
    await store.setJSON(clean, {...raw, status:'unused', sessionId:'', usedAt:'', consumedAt:''});
    return new Response(JSON.stringify({ok:true, code:clean}), {headers:{'Content-Type':'application/json'}});
  } catch(e) { return new Response(JSON.stringify({ok:false, error:'Server-Fehler.'}), {status:500}); }
};
