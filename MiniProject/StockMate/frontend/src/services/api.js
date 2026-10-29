const BASE=(import.meta.env.VITE_API_URL||'http://localhost:5000/api').replace(/\/$/,'');
export async function api(path,options={}){let response;try{response=await fetch(`${BASE}${path}`,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});}catch{throw new Error('Cannot reach the API. Make sure the backend is running.');}const data=await response.json().catch(()=>({message:'The server returned an unreadable response.'}));if(!response.ok)throw new Error(data.message||`Request failed (${response.status})`);return data;}
export const jsonBody=data=>({method:'POST',body:JSON.stringify(data)});export const putBody=data=>({method:'PUT',body:JSON.stringify(data)});
export const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(Number(n)||0);
export const dateTime=d=>d?new Date(d).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}):'—';
export const statusOf=p=>p.quantity===0?'Out of stock':p.quantity<=p.minimumStock?'Low stock':'In stock';
