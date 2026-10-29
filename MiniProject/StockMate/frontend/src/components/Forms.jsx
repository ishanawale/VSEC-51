import React,{useEffect,useState} from 'react';
import {api,jsonBody,putBody} from '../services/api';
import {Field,Modal} from './UI';
export const CATEGORIES=['Electronics','Stationery','Furniture','Cleaning Supplies','Equipment','Other'];
export function ProductForm({product,onSaved,onClose}){const [form,setForm]=useState({productId:'',name:'',category:'Electronics',description:'',price:'',quantity:'0',minimumStock:'5',supplier:'',...product});
const [error,setError]=useState('');const [busy,setBusy]=useState(false);
const change=e=>setForm({...form,[e.target.name]:e.target.value});
async function submit(e){e.preventDefault();setError('');
    if(!form.productId.trim()||!form.name.trim()||!form.category)return setError('Product ID, name and category are required.');
    if(form.price===''||!Number.isFinite(Number(form.price))||Number(form.price)<0)return setError('Price must be a non-negative number.');
    for(const k of ['quantity','minimumStock'])
        if(!/^\d+$/.test(String(form[k]))||Number(form[k])<0)return setError(`${k==='quantity'?'Quantity':'Minimum stock'} must be a non-negative whole number.`);
    setBusy(true);try{const body={...form,productId:form.productId.trim().toUpperCase(),price:Number(form.price),quantity:Number(form.quantity),minimumStock:Number(form.minimumStock)};
    const result=product?await api(`/products/${product._id}`,putBody(body)):await api('/products',jsonBody(body));onSaved(result);}catch(e){setError(e.message);}finally{setBusy(false);}}
return <form onSubmit={submit} className="form-grid">
    <Field label="Product ID *">
        <input name="productId" value={form.productId} onChange={change} placeholder="e.g. P009" required/>
        </Field>
        <Field label="Product name *">
            <input name="name" value={form.name} onChange={change} placeholder="Product name" required/>
            </Field>
            <Field label="Category *">
                <select name="category" value={form.category} onChange={change}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></Field><Field label="Unit price (₹) *">
                    <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={change} required/>
                    </Field>
                    <Field label="Current quantity *">
                        <input type="number" min="0" step="1" name="quantity" value={form.quantity} onChange={change} required/>
                        </Field>
                        <Field label="Minimum stock *">
                            <input type="number" min="0" step="1" name="minimumStock" value={form.minimumStock} onChange={change} required/></Field><Field label="Supplier">
                                <input name="supplier" value={form.supplier} onChange={change} placeholder="Supplier name"/>
                                </Field>
                                <Field label="Description">
                                    <input name="description" value={form.description} onChange={change} placeholder="Optional notes"/>
                                    </Field>{error&&<div className="form-error full">{error}</div>}<div className="form-actions full">
                                        <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
                                        <button className="btn primary" disabled={busy}>{busy?'Saving…':product?'Save changes':'Add product'}</button></div></form>}
export function StockForm({type,products,onSaved,onClose}){const [productId,setProductId]=useState('');
    const [quantity,setQuantity]=useState('1');const [reason,setReason]=useState(type==='IN'?'New Purchase':'Sale');
    const [notes,setNotes]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
    const selected=products.find(p=>p._id===productId);
useEffect(()=>{if(products.length&&!productId)setProductId(products[0]._id)},[products,productId]);
async function submit(e){e.preventDefault();
    setError('');
    if(!productId)return setError('Select a product.');
    if(!/^\d+$/.test(quantity)||Number(quantity)<=0)return setError('Quantity must be a positive whole number.');
    if(type==='OUT'&&selected&&Number(quantity)>selected.quantity)return setError(`Only ${selected.quantity} units are available.`);
    setBusy(true);
    try{await api(`/stock/${type==='IN'?'in':'out'}`,jsonBody({productId,quantity:Number(quantity),reason,notes}));
    onSaved();}catch(e){setError(e.message);}finally{setBusy(false);}}
const reasons=type==='IN'?['New Purchase','Return','Adjustment']:['Sale','Internal Use','Damaged Goods','Adjustment'];
const reset=()=>{setQuantity('1');setReason(type==='IN'?'New Purchase':'Sale');
    setNotes('');
    setError('');
    if(products.length)setProductId(products[0]._id);onClose?.()};
    return <form onSubmit={submit} className="form-grid">
        <Field label="Product">
            <select value={productId} onChange={e=>setProductId(e.target.value)} required>{products.map(p=><option value={p._id} key={p._id}>{p.productId} · {p.name} ({p.quantity} in stock)</option>)}
            </select>
            </Field>
            <Field label="Quantity">
                <input type="number" min="1" step="1" value={quantity} onChange={e=>setQuantity(e.target.value)} required/>
            </Field>
            <Field label="Reason">
                <select value={reason} onChange={e=>setReason(e.target.value)}>{reasons.map(x=><option key={x}>{x}</option>)}</select>
            </Field>
            <Field label="Notes (optional)">
                <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add a note"/>
                </Field>{selected&&<div className="stock-preview full">
                    <span>Current stock</span>
                    <strong>{selected.quantity} units</strong>
                    <span>After transaction</span>
                    <strong>{Math.max(0,selected.quantity+(type==='IN'?1:-1)*Math.max(0,Number(quantity)||0))} units</strong>
                    </div>}{error&&<div className="form-error full">{error}</div>}<div className="form-actions full">
                        <button type="button" className="btn secondary" onClick={reset}>Reset form</button>
                        <button className="btn primary" disabled={busy||!products.length}>{busy?'Processing…':type==='IN'?'Record stock in':'Record stock out'}</button>
                        </div></form>}
export function ProductModal({product,onSaved,onClose}){return <Modal title={product?'Edit product':'Add a product'} onClose={onClose}>
    <ProductForm product={product} onSaved={onSaved} onClose={onClose}/></Modal>}
