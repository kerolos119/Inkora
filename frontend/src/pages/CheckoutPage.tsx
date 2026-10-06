import { t } from '../i18n';
import React, { useState } from 'react';
import {
  Check,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { api } from '../services/api.js';
import { Order, ShippingDetails, PaymentMethod } from '../types/index.js';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.username ? 'Eleanor Vance' : '',
    email: user?.email || 'user@inkora.com',
    phone: user?.phoneNumber || '+1 (555) 234-5678',
  });

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: user?.username ? 'Eleanor Vance' : '',
    email: user?.email || 'user@inkora.com',
    phone: user?.phoneNumber || '+1 (555) 234-5678',
    address: user?.address || '742 Evergreen Terrace, Apt 4B',
    city: 'Portland',
    postalCode: '97201',
    country: 'United States',
    notes: 'Please leave in the reception library box.',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '884',
    cardName: 'Eleanor Vance',
  });

  if (cart.items.length === 0 && step !== 5) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 animate-ink-fade">
        <h2 className="font-editorial text-3xl text-[#3B2B1E] dark:text-[#F3ECDD]">
          {t('co.emptyT')}
        </h2>
        <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-body-literary">
          {t('co.emptyB')}
        </p>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-6 py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider font-mono btn-press rounded-[2px]"
        >
          {t('cart.explore')}
        </button>
      </div>
    );
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!customerInfo.fullName || !customerInfo.email) {
        showToast(t('checkout.needContact'), 'error');
        return;
      }
      setShippingDetails((prev) => ({
        ...prev,
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone,
      }));
      setStep(2);
    } else if (step === 2) {
      if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode) {
        showToast(t('checkout.needAddress'), 'error');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const order = await api.checkout({
        items: cart.items,
        shippingDetails,
        paymentMethod,
        discountCode: 'INKORA10',
      });
      setCreatedOrder(order);
      await refreshCart();
      setStep(5);
      showToast(t('checkout.ok'));
    } catch (err: any) {
      showToast(t('checkout.fail'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: t('co.s1') },
    { num: 2, label: t('co.s2') },
    { num: 3, label: t('co.s3') },
    { num: 4, label: t('co.s4') },
    { num: 5, label: t('co.s5') },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-ink-fade">
      {/* Editorial Steps Navigation Indicator */}
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-6">
        <span className="text-xs tracking-[0.25em] uppercase text-[#8A6238] dark:text-[#D2A560] font-semibold font-mono block mb-2">
          {t('co.title')}
        </span>
        <div className="flex items-center justify-between">
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD]">
            {step === 5 ? 'Order Dispatch Confirmed' : 'Checkout & Dispatch'}
          </h1>

          {/* Stepper Dots/Numbers */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            {stepsList.map((s, idx) => (
              <React.Fragment key={s.num}>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] transition-colors ${
                    step === s.num
                      ? 'border border-[#8A6238] dark:border-[#D2A560] text-[#8A6238] dark:text-[#D2A560] font-semibold bg-[#F6EBD3] dark:bg-[#33281A]'
                      : step > s.num
                      ? 'text-[#2A674A]'
                      : 'text-[#7A6652] dark:text-[#A99A82] opacity-60'
                  }`}
                >
                  <span>{s.num}.</span>
                  <span>{s.label}</span>
                  {step > s.num && <Check className="w-3 h-3 text-[#2A674A]" />}
                </div>
                {idx < stepsList.length - 1 && (
                  <span className="text-[#E3D6BC] dark:text-[#4A3E2E]">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          {t('x.4bf5ad')}
         ───────────────────────────────────────────────────────────────── */}
      {step === 5 && createdOrder ? (
        <div className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-8 sm:p-12 space-y-8 animate-in fade-in rounded-[2px] shadow-2xs">
          <div className="text-center max-w-md mx-auto space-y-3 relative">
            {/* Red Vermilion Ink Seal Stamp in background */}
            <div className="absolute -top-3 end-0 sm:end-6 w-20 h-20 rounded-full border-2 border-dashed border-[#8E1F1F]/60 dark:border-[#D65454]/60 bg-[#8E1F1F]/5 dark:bg-[#D65454]/10 flex flex-col items-center justify-center rotate-12 pointer-events-none select-none seal-pulse shadow-xs">
              <span className="font-mono text-xs uppercase tracking-widest text-[#8E1F1F] dark:text-[#D65454] font-bold">INKORA</span>
              <span className="font-quill text-base text-[#8E1F1F] dark:text-[#D65454] -my-1">Sealed</span>
              <span className="font-mono text-xs tracking-wider text-[#8E1F1F] dark:text-[#D65454]">VERIFIED</span>
            </div>

            <div className="w-12 h-12 bg-[#2A674A]/10 text-[#2A674A] border border-[#2A674A]/30 flex items-center justify-center mx-auto rounded-[2px]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD]">
              {t('co.thanks')}
            </h2>
            <p className="text-xs text-[#7A6652] dark:text-[#A99A82] leading-relaxed font-body-literary">
              {t('co.ref')}
            </p>
            <div className="font-mono text-base font-semibold text-[#8A6238] dark:text-[#D2A560] bg-[#F1E9D6] dark:bg-[#342B21] py-2 px-4 inline-block border border-[#E3D6BC] dark:border-[#4A3E2E] rounded-[2px]">
              {createdOrder.orderNumber}
            </div>
            <p className="font-quill text-base text-[#8A6238] dark:text-[#D2A560] pt-1 italic">
              ~ Inscribed &amp; parcelled with acid-free archival care ~
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E3D6BC] dark:border-[#4A3E2E] text-xs font-mono">
            <div>
              <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#3B2B1E] dark:text-[#F3ECDD] mb-2">
                {t('co.shipTo')}
              </h4>
              <p className="text-[#7A6652] dark:text-[#A99A82]">
                {createdOrder.shippingDetails.fullName}<br />
                {createdOrder.shippingDetails.address}<br />
                {createdOrder.shippingDetails.city}, {createdOrder.shippingDetails.postalCode}<br />
                {createdOrder.shippingDetails.country}
              </p>
            </div>

            <div>
              <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#3B2B1E] dark:text-[#F3ECDD] mb-2">
                {t('co.fin')}
              </h4>
              <div className="space-y-1 text-[#7A6652] dark:text-[#A99A82]">
                <div className="flex justify-between">
                  <span>{t('co.method')}</span>
                  <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('co.statusC')}</span>
                  <span className="font-medium text-[#2A674A]">{createdOrder.status}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] pt-2 border-t border-[#E3D6BC] dark:border-[#4A3E2E]">
                  <span>{t('co.totalC')}</span>
                  <span>${createdOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Summary in Receipt */}
          <div className="pt-6 border-t border-[#E3D6BC] dark:border-[#4A3E2E] space-y-3 font-mono">
            <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#3B2B1E] dark:text-[#F3ECDD]">
              {t('co.items')}
            </h4>
            <div className="divide-y divide-[#E3D6BC]/60 dark:divide-[#4A3E2E]/60">
              {createdOrder.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-editorial text-base font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                      {item.bookTitle}
                    </span>
                    <span className="text-[11px] text-[#7A6652] dark:text-[#A99A82] ms-2">
                      by {item.authorName} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E3D6BC] dark:border-[#4A3E2E] font-mono">
            <button
              onClick={() => onNavigate('account:orders')}
              className="px-6 py-3 border border-[#3B2B1E] dark:border-[#F3ECDD] text-xs font-semibold uppercase tracking-wider text-[#3B2B1E] dark:text-[#F3ECDD] hover:bg-[#F1E9D6] dark:hover:bg-[#342B21] transition-colors rounded-[2px] btn-press"
            >
              {t('co.viewOrders')}
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-6 py-3 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors rounded-[2px] btn-press"
            >
              {t('co.back')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Form by Step */}
          <div className="lg:col-span-7 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 sm:p-8 space-y-6 rounded-[2px] shadow-2xs">
            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                  1. Patron Contact Details
                </h3>
                <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-body-literary">
                  {t('co.h1')}
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                      {t('f.name')}
                    </label>
                    <input
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                      }
                      placeholder={t('ph.name')}
                      className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                      {t('f.email')}
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      placeholder={t('ph.email')}
                      className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                      {t('f.phoneC')}
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      placeholder={t('ph.phone')}
                      className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                  2. Archival Delivery Destination
                </h3>
                <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-body-literary">
                  {t('co.h2')}
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                      {t('x.262d3c')}
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.address}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, address: e.target.value })
                      }
                      placeholder={t('ph.street')}
                      className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                        {t('f.city')}
                      </label>
                      <input
                        type="text"
                        value={shippingDetails.city}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, city: e.target.value })
                        }
                        placeholder={t('ph.city')}
                        className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                        {t('f.zip')}
                      </label>
                      <input
                        type="text"
                        value={shippingDetails.postalCode}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, postalCode: e.target.value })
                        }
                        placeholder={t('ph.zip')}
                        className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                      {t('f.country')}
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.country}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, country: e.target.value })
                      }
                      placeholder={t('ph.country')}
                      className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#3B2B1E] dark:text-[#F3ECDD] block mb-1">
                      {t('f.notes')}
                    </label>
                    <textarea
                      value={shippingDetails.notes}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, notes: e.target.value })
                      }
                      placeholder={t('ph.notes')}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs text-[#3B2B1E] dark:text-[#F3ECDD] focus:outline-hidden rounded-[2px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                  3. Settlement Method
                </h3>
                <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-body-literary">
                  {t('co.h3')}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-4 border cursor-pointer transition-all rounded-[2px] btn-press ${
                      paymentMethod === 'ONLINE'
                        ? 'border-[#8A6238] dark:border-[#D2A560] bg-[#F6EBD3] dark:bg-[#33281A]'
                        : 'border-[#E3D6BC] dark:border-[#4A3E2E]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#8A6238] dark:text-[#D2A560] mb-2" />
                    <span className="font-semibold text-xs text-[#3B2B1E] dark:text-[#F3ECDD] block font-mono">
                      {t('x.0c04a4')}
                    </span>
                    <span className="text-xs text-[#7A6652] dark:text-[#A99A82]">
                      {t('co.card')}
                    </span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-4 border cursor-pointer transition-all rounded-[2px] btn-press ${
                      paymentMethod === 'CASH'
                        ? 'border-[#8A6238] dark:border-[#D2A560] bg-[#F6EBD3] dark:bg-[#33281A]'
                        : 'border-[#E3D6BC] dark:border-[#4A3E2E]'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#8A6238] dark:text-[#D2A560] mb-2" />
                    <span className="font-semibold text-xs text-[#3B2B1E] dark:text-[#F3ECDD] block font-mono">
                      {t('co.cod')}
                    </span>
                    <span className="text-xs text-[#7A6652] dark:text-[#A99A82]">
                      {t('co.codS')}
                    </span>
                  </div>
                </div>

                {paymentMethod === 'ONLINE' && (
                  <div className="space-y-3 pt-3 p-4 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] rounded-[2px]">
                    <div className="flex items-center justify-between text-[11px] text-[#7A6652] dark:text-[#A99A82] font-mono">
                      <span>{t('co.demo')}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2A674A]" />
                    </div>
                    <div>
                      <label className="text-xs uppercase font-mono text-[#7A6652] dark:text-[#A99A82] block mb-1">
                        {t('f.card')}
                      </label>
                      <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs font-mono text-[#3B2B1E] dark:text-[#F3ECDD] rounded-[2px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs uppercase font-mono text-[#7A6652] dark:text-[#A99A82] block mb-1">
                          {t('x.ec67f2')}
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardExp}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardExp: e.target.value })}
                          className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs font-mono text-[#3B2B1E] dark:text-[#F3ECDD] rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-mono text-[#7A6652] dark:text-[#A99A82] block mb-1">
                          {t('x.9dbe75')}
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardCvc}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardCvc: e.target.value })}
                          className="w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-xs font-mono text-[#3B2B1E] dark:text-[#F3ECDD] rounded-[2px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Final Order Review */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD]">
                  4. Review & Authorize Dispatch
                </h3>
                <p className="text-xs text-[#7A6652] dark:text-[#A99A82] font-body-literary">
                  {t('co.h4')}
                </p>

                <div className="p-4 border border-[#E3D6BC] dark:border-[#4A3E2E] space-y-3 text-xs font-mono rounded-[2px]">
                  <div className="flex justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-2">
                    <span className="text-[#7A6652] dark:text-[#A99A82]">{t('co.rcpt')}</span>
                    <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">{shippingDetails.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-2">
                    <span className="text-[#7A6652] dark:text-[#A99A82]">{t('co.shipTo')}</span>
                    <span className="font-medium text-[#3B2B1E] dark:text-[#F3ECDD]">
                      {shippingDetails.address}, {shippingDetails.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6652] dark:text-[#A99A82]">{t('co.s3')}</span>
                    <span className="font-medium text-[#8A6238] dark:text-[#D2A560]">{paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E3D6BC] dark:border-[#4A3E2E] font-mono">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="flex items-center gap-1.5 text-xs text-[#7A6652] hover:text-[#3B2B1E] dark:text-[#A99A82] dark:hover:text-[#F3ECDD] btn-press"
                >
                  <ArrowLeft className="rtl:-scale-x-100 w-3.5 h-3.5" />
                  <span>{t('co.prev')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="text-xs text-[#7A6652] hover:text-[#3B2B1E] dark:hover:text-[#F3ECDD] btn-press"
                >
                  ← Back to Bag
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold uppercase tracking-wider hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors flex items-center gap-2 cursor-pointer btn-press rounded-[2px]"
                >
                  <span>{t('co.next')}</span>
                  <ArrowRight className="rtl:-scale-x-100 w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="px-8 py-3 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] text-xs font-semibold uppercase tracking-widest hover:bg-[#8A6238] dark:hover:bg-[#604626] transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 btn-press rounded-[2px]"
                >
                  <span>{submitting ? t('checkout.placing') : t('checkout.place')}</span>
                  <ArrowRight className="rtl:-scale-x-100 w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 space-y-4 rounded-[2px] shadow-2xs font-mono">
            <h3 className="font-editorial text-2xl text-[#3B2B1E] dark:text-[#F3ECDD] border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-3">
              Items for Dispatch ({cart.items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pe-1 divide-y divide-[#E3D6BC]/60 dark:divide-[#4A3E2E]/60">
              {cart.items.map(({ book, quantity }) => (
                <div key={book.id} className="pt-2 first:pt-0 flex gap-3 text-xs">
                  <img
                    src={book.coverImage}
                    alt={book.bookTitle}
                    className="w-12 h-16 object-cover border border-[#E3D6BC] dark:border-[#4A3E2E] shrink-0 rounded-[2px]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-editorial text-base font-medium text-[#3B2B1E] dark:text-[#F3ECDD] truncate">
                      {book.bookTitle}
                    </p>
                    <p className="text-[11px] text-[#7A6652] dark:text-[#A99A82]">
                      Qty: {quantity} · ${book.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E3D6BC] dark:border-[#4A3E2E] pt-3 space-y-1.5 text-xs text-[#7A6652] dark:text-[#A99A82]">
              <div className="flex justify-between">
                <span>{t('co.sub')}</span>
                <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  ${cart.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('co.handling')}</span>
                <span className="font-semibold text-[#3B2B1E] dark:text-[#F3ECDD]">
                  {cart.shipping === 0 ? 'Complimentary' : `$${cart.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#3B2B1E] dark:text-[#F3ECDD] pt-2 border-t border-[#E3D6BC] dark:border-[#4A3E2E]">
                <span>{t('co.total')}</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
