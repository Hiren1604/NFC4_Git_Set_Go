import { ArrowRight, CreditCard } from "lucide-react";
import { PaymentCards } from "./PaymentCards";

export function LandingEssentials({ onLogin }: { onLogin: () => void }) {
  return <>
    <section id="treasury-showcase" className="payment-experience"><div className="payment-stage-card">
      <div className="payment-editorial"><span className="section-kicker"><CreditCard size={15} /> PAYMENTS & RECORDS</span><h2>Every payment.<br /><em>Accounted for.</em></h2><p>One payment becomes a receipt, a ledger entry, and one less follow-up. Try the preview and watch the records update.</p><div className="payment-controls"><button className="payment-link" onClick={onLogin}>Open your workspace <ArrowRight size={18} /></button></div></div>
      <PaymentCards admin={false} />
    </div></section>
  </>;
}
