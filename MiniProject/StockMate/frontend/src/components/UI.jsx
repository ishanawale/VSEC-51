import React from 'react';
import {PackageOpen,LoaderCircle,AlertTriangle,X} from 'lucide-react';
export function Spinner(){return <div className="spinner-wrap"><LoaderCircle className="spin" size={22}/><span>Loading…</span></div>}
export function EmptyState({title='Nothing here yet',text='Records will appear here once you add them.'}){return <div className="empty"><PackageOpen size={30}/><strong>{title}</strong><span>{text}</span></div>}
export function Badge({children,tone='neutral'}){return <span className={`badge ${tone}`}>{children}</span>}
export function Modal({title,onClose,children}){return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="modal"><header className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={19}/></button></header>{children}</section></div>}
export function Confirm({title='Delete this record?',text='This action cannot be undone.',onCancel,onConfirm}){return <div className="modal-backdrop"><section className="modal confirm"><div className="confirm-icon"><AlertTriangle/></div><h2>{title}</h2><p>{text}</p><div className="actions"><button className="btn secondary" onClick={onCancel}>Cancel</button><button className="btn danger" onClick={onConfirm}>Delete</button></div></section></div>}
export function Field({label,children,error}){return <label className="field"><span>{label}</span>{children}{error&&<small className="field-error">{error}</small>}</label>}
export function PageTitle({eyebrow,title,description,action}){return <div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>}
