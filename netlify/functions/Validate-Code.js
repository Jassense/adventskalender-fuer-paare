// POST {code, sessionId} -> {ok:true} oder {ok:false, error}
// Status in Netlify Blobs: unused / in-use (mit sessionId) / used
import { getStore } from '@netlify/blobs';
export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ok:false, error:'Nur POST erlaubt.'}), {status:405, headers:{'Content-Type':'application/json'}});
  try {
    const { code, sessionId } = await req.json();
    const clean = String(code||'').trim().toUpperCase();
    if (!clean) return new Response(JSON.stringify({ok:false, error:'Bitte gib deinen Code ein.'}), {headers:{'Content-Type':'application/json'}});
    const store = getStore('codes');
    const raw = await store.get(clean, {type:'json'});
    if (!raw) return new Response(JSON.stringify({ok:false, error:'Code nicht gefunden. Bitte prüfe deinen Code.'}), {headers:{'Content-Type':'application/json'}});
    if (raw.status === 'used') return new Response(JSON.stringify({ok:false, error:'Dieser Code wurde schon benutzt. Bitte kaufe einen eigenen Code bei Etsy.'}), {headers:{'Content-Type':'application/json'}});
    if (raw.status === 'in-use' && raw.sessionId && raw.sessionId !== sessionId) {
      return new Response(JSON.stringify({ok:false, error:'Dieser Code wird gerade auf einem anderen Gerät benutzt.'}), {headers:{'Content-Type':'application/json'}});
    }
    // Erster Aufruf: als in-use markieren, mit dieser Session
    if (raw.status === 'unused') {
      await store.setJSON(clean, {...raw, status:'in-use', sessionId: sessionId||'', usedAt: new Date().toISOString()});
    }
    return new Response(JSON.stringify({ok:true}), {headers:{'Content-Type':'application/json'}});
  } catch(e) {
    return new Response(JSON.stringify({ok:false, error:'Server-Fehler. Bitte Seite neu laden und nochmal versuchen.'}), {status:500, headers:{'Content-Type':'application/json'}});
  }
};
