// POST {code, sessionId} -> markiert Code als verbraucht, wenn Session passt
import { getStore } from '@netlify/blobs';
export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ok:false}), {status:405});
  try {
    const { code, sessionId } = await req.json();
    const clean = String(code||'').trim().toUpperCase();
    const store = getStore('codes');
    const raw = await store.get(clean, {type:'json'});
    if (!raw) return new Response(JSON.stringify({ok:false}), {headers:{'Content-Type':'application/json'}});
    // Nur die Session, die den Code benutzt, darf ihn verbrauchen
    if (raw.sessionId && raw.sessionId !== sessionId) return new Response(JSON.stringify({ok:false, error:'Andere Session.'}), {headers:{'Content-Type':'application/json'}});
    await store.setJSON(clean, {...raw, status:'used', consumedAt: new Date().toISOString()});
    return new Response(JSON.stringify({ok:true}), {headers:{'Content-Type':'application/json'}});
  } catch(e) { return new Response(JSON.stringify({ok:false}), {status:500}); }
};
