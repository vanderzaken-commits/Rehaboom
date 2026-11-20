/* Portal keys stay on the devices; the server receives AES-GCM ciphertext. */
window.CareCrypto=(()=>{
 const bytes=hex=>new Uint8Array(hex.match(/../g).map(x=>parseInt(x,16)));
 const base64=b=>{let s='';for(const n of new Uint8Array(b))s+=String.fromCharCode(n);return btoa(s);};
 const unbase64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 const random=(n=32)=>Array.from(crypto.getRandomValues(new Uint8Array(n)),b=>b.toString(16).padStart(2,'0')).join('');
 const key=hex=>crypto.subtle.importKey('raw',bytes(hex),'AES-GCM',false,['encrypt','decrypt']);
 async function encrypt(value,secret){const iv=crypto.getRandomValues(new Uint8Array(12));const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(secret),new TextEncoder().encode(JSON.stringify(value)));return {v:1,iv:base64(iv),data:base64(data)};}
 async function decrypt(envelope,secret){if(envelope?.v!==1)throw new Error('Onbekend gegevensformaat');const data=await crypto.subtle.decrypt({name:'AES-GCM',iv:unbase64(envelope.iv)},await key(secret),unbase64(envelope.data));return JSON.parse(new TextDecoder().decode(data));}
 function parse(code){const m=/^rbp1_([a-f0-9]{64})_([a-f0-9]{64})$/.exec(code.trim());if(!m)throw new Error('Vul de volledige portaalcode in');return {token:m[1],key:m[2]};}
 return {random,encrypt,decrypt,parse};
})();
