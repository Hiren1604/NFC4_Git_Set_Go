import { useState } from "react";
import { ArrowRight, Check, CreditCard, Receipt, RotateCcw, ShieldCheck } from "lucide-react";

export function PaymentCards({ admin }: { admin: boolean }) {
  const [paid, setPaid] = useState(false);
  return <div className="payment-collage restored-payment-cards" data-view={admin ? 'admin' : 'resident'} data-paid={paid}>
    <div className="ledger-card"><div><span>SOCIETY TREASURY</span><CreditCard size={19} /></div><span>{admin ? 'MONTHLY COLLECTIONS' : 'MONTHLY MAINTENANCE'}</span><strong>{admin ? paid ? '₹4,85,500' : '₹4,82,000' : '₹3,500'}</strong><div className="ledger-progress"><i style={{ width: admin ? paid ? '93%' : '92%' : paid ? '100%' : '0%' }} /></div><small>{admin ? paid ? '139 payments recorded' : '138 payments recorded' : 'November / Flat A-204'}</small><div className="ledger-bottom"><span>GREENWOOD RESIDENCES</span><span>•• 204</span></div></div>
    <div className="receipt-card"><div className="receipt-stamp">{paid ? <Check size={22} /> : <Receipt size={22} />}</div><span>{paid ? 'PAYMENT RECEIVED' : 'PAYMENT PREVIEW'}</span><h3>{paid ? "You're all settled." : 'One payment. Everything updated.'}</h3><div><span>Maintenance</span><b>₹3,500.00</b></div><div><span>{paid ? 'Receipt' : 'Household'}</span><b>{paid ? '#SH-204-1106' : 'Flat A-204'}</b></div><div className="receipt-dashes" /><button className="receipt-demo-action" onClick={() => setPaid(!paid)}>{paid ? 'Replay demo' : admin ? 'Record sample payment' : 'Preview payment'}{paid ? <RotateCcw size={13} /> : <ArrowRight size={13} />}</button></div>
    <div className="payment-note" key={String(paid)}><ShieldCheck size={20} /><div><b>{paid ? 'Receipt saved. Ledger updated.' : 'One less thing on your mind.'}</b><span>{paid ? 'Resident and admin see the same record.' : 'Paid. Recorded. Easy to find.'}</span></div></div><span className="collage-caption">INTERACTIVE DEMO / NO REAL PAYMENT</span>
  </div>;
}
