// POST {adminPassword} -> listet alle Codes mit Status
import { getStore } from '@netlify/blobs';
export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ok:false}), {status:405});
  try {
    const { adminPassword } = await req.json();
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ok:false, error:'Falsches Master-Passwort.'}), {status:401, headers:{'Content-Type':'application/json'}});
    }
    const store = getStore('codes');
    const list = await store.list();
    let codes = [];
    for (const k of list.blobs) {
      const v = await store.get(k.key, {type:'json'});
      if (v) codes.push(v);
    }
    codes.sort((a,b)=> (b.createdAt||'').localeCompare(a.createdAt||''));
    return new Response(JSON.stringify({ok:true, codes}), {headers:{'Content-Type':'application/json'}});
  } catch(e) { return new Response(JSON.stringify({ok:false, error:'Server-Fehler.'}), {status:500}); }
};
