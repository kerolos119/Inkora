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
        <h2 className="font-editorial text-3xl text-[#0D1017] dark:text-[#EBE8E1]">
          No items in reading bag for checkout
        </h2>
        <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] font-body-literary">
          Please select works from our catalog before initiating dispatch.
        </p>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-6 py-2.5 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider font-mono btn-press rounded-[2px]"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!customerInfo.fullName || !customerInfo.email) {
        showToast('Please fill out customer name and email', 'error');
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
        showToast('Please provide street address, city, and postal code', 'error');
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
      showToast('Order confirmed and recorded in dispatch');
    } catch (err: any) {
      showToast(err.message || 'Checkout failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Patron' },
    { num: 2, label: 'Delivery' },
    { num: 3, label: 'Settlement' },
    { num: 4, label: 'Review' },
    { num: 5, label: 'Confirmed' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-ink-fade">
      {/* Editorial Steps Navigation Indicator */}
      <div className="border-b border-[#DFD7C7] dark:border-[#262C3A] pb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#16284F] dark:text-[#4A72B0] font-semibold font-mono block mb-2">
          Dispatch & Acquisition Protocol
        </span>
        <div className="flex items-center justify-between">
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EBE8E1]">
            {step === 5 ? 'Order Dispatch Confirmed' : 'Checkout & Dispatch'}
          </h1>

          {/* Stepper Dots/Numbers */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            {stepsList.map((s, idx) => (
              <React.Fragment key={s.num}>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] transition-colors ${
                    step === s.num
                      ? 'border border-[#16284F] dark:border-[#4A72B0] text-[#16284F] dark:text-[#4A72B0] font-semibold bg-[#EBF0F8] dark:bg-[#1A2333]'
                      : step > s.num
                      ? 'text-[#2A674A]'
                      : 'text-[#5A6273] dark:text-[#8E95A5] opacity-60'
                  }`}
                >
                  <span>{s.num}.</span>
                  <span>{s.label}</span>
                  {step > s.num && <Check className="w-3 h-3 text-[#2A674A]" />}
                </div>
                {idx < stepsList.length - 1 && (
                  <span className="text-[#DFD7C7] dark:text-[#262C3A]">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          Step 5: Order Confirmation / Literary Receipt
         ───────────────────────────────────────────────────────────────── */}
      {step === 5 && createdOrder ? (
        <div className="border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] p-8 sm:p-12 space-y-8 animate-in fade-in rounded-[2px] shadow-2xs">
          <div className="text-center max-w-md mx-auto space-y-3 relative">
            {/* Red Vermilion Ink Seal Stamp in background */}
            <div className="absolute -top-3 right-0 sm:right-6 w-20 h-20 rounded-full border-2 border-dashed border-[#8E1F1F]/60 dark:border-[#D65454]/60 bg-[#8E1F1F]/5 dark:bg-[#D65454]/10 flex flex-col items-center justify-center rotate-12 pointer-events-none select-none seal-pulse shadow-xs">
              <span className="font-mono text-[8px] uppercase tracking-widest text-[#8E1F1F] dark:text-[#D65454] font-bold">INKORA</span>
              <span className="font-quill text-base text-[#8E1F1F] dark:text-[#D65454] -my-1">Sealed</span>
              <span className="font-mono text-[7px] tracking-wider text-[#8E1F1F] dark:text-[#D65454]">VERIFIED</span>
            </div>

            <div className="w-12 h-12 bg-[#2A674A]/10 text-[#2A674A] border border-[#2A674A]/30 flex items-center justify-center mx-auto rounded-[2px]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#0D1017] dark:text-[#EBE8E1]">
              Gratitude for Your Patronage
            </h2>
            <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] leading-relaxed font-body-literary">
              Your order has been recorded in the Inkora registry under reference:
            </p>
            <div className="font-mono text-base font-semibold text-[#16284F] dark:text-[#4A72B0] bg-[#EFEAE0] dark:bg-[#1C202B] py-2 px-4 inline-block border border-[#DFD7C7] dark:border-[#262C3A] rounded-[2px]">
              {createdOrder.orderNumber}
            </div>
            <p className="font-quill text-base text-[#16284F] dark:text-[#4A72B0] pt-1 italic">
              ~ Inscribed &amp; parcelled with acid-free archival care ~
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#DFD7C7] dark:border-[#262C3A] text-xs font-mono">
            <div>
              <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#0D1017] dark:text-[#EBE8E1] mb-2">
                Shipping Destination
              </h4>
              <p className="text-[#5A6273] dark:text-[#8E95A5]">
                {createdOrder.shippingDetails.fullName}<br />
                {createdOrder.shippingDetails.address}<br />
                {createdOrder.shippingDetails.city}, {createdOrder.shippingDetails.postalCode}<br />
                {createdOrder.shippingDetails.country}
              </p>
            </div>

            <div>
              <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#0D1017] dark:text-[#EBE8E1] mb-2">
                Order Financials
              </h4>
              <div className="space-y-1 text-[#5A6273] dark:text-[#8E95A5]">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-[#2A674A]">{createdOrder.status}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#0D1017] dark:text-[#EBE8E1] pt-2 border-t border-[#DFD7C7] dark:border-[#262C3A]">
                  <span>Total Amount:</span>
                  <span>${createdOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Summary in Receipt */}
          <div className="pt-6 border-t border-[#DFD7C7] dark:border-[#262C3A] space-y-3 font-mono">
            <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#0D1017] dark:text-[#EBE8E1]">
              Inscribed Works
            </h4>
            <div className="divide-y divide-[#DFD7C7]/60 dark:divide-[#262C3A]/60">
              {createdOrder.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-editorial text-base font-medium text-[#0D1017] dark:text-[#EBE8E1]">
                      {item.bookTitle}
                    </span>
                    <span className="text-[11px] text-[#5A6273] dark:text-[#8E95A5] ml-2">
                      by {item.authorName} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-[#0D1017] dark:text-[#EBE8E1]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#DFD7C7] dark:border-[#262C3A] font-mono">
            <button
              onClick={() => onNavigate('account:orders')}
              className="px-6 py-3 border border-[#0B0E14] dark:border-[#EBE8E1] text-xs font-semibold uppercase tracking-wider text-[#0D1017] dark:text-[#EBE8E1] hover:bg-[#EFEAE0] dark:hover:bg-[#1C202B] transition-colors rounded-[2px] btn-press"
            >
              View in My Library & Orders
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-6 py-3 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors rounded-[2px] btn-press"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Form by Step */}
          <div className="lg:col-span-7 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] p-6 sm:p-8 space-y-6 rounded-[2px] shadow-2xs">
            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1]">
                  1. Patron Contact Details
                </h3>
                <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] font-body-literary">
                  Where should we transmit digital colophons, shipment tracking, and dispatch notices?
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                      }
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      placeholder="reader@domain.com"
                      className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                      Phone Number (For Carrier Dispatch)
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1]">
                  2. Archival Delivery Destination
                </h3>
                <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] font-body-literary">
                  Provide the street address where your parcels will be carefully received.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                      Street Address & Apartment / Suite
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.address}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, address: e.target.value })
                      }
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingDetails.city}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, city: e.target.value })
                        }
                        placeholder="Portland"
                        className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingDetails.postalCode}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, postalCode: e.target.value })
                        }
                        placeholder="97201"
                        className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.country}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, country: e.target.value })
                      }
                      placeholder="United States"
                      className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold font-mono text-[#0D1017] dark:text-[#EBE8E1] block mb-1">
                      Delivery Courier Instructions (Optional)
                    </label>
                    <textarea
                      value={shippingDetails.notes}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, notes: e.target.value })
                      }
                      placeholder="Leave with reception or library porch..."
                      rows={2}
                      className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs text-[#0D1017] dark:text-[#EBE8E1] focus:outline-hidden rounded-[2px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1]">
                  3. Settlement Method
                </h3>
                <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] font-body-literary">
                  Choose secure card processing or cash settlement upon hand delivery.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-4 border cursor-pointer transition-all rounded-[2px] btn-press ${
                      paymentMethod === 'ONLINE'
                        ? 'border-[#16284F] dark:border-[#4A72B0] bg-[#EBF0F8] dark:bg-[#1A2333]'
                        : 'border-[#DFD7C7] dark:border-[#262C3A]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#16284F] dark:text-[#4A72B0] mb-2" />
                    <span className="font-semibold text-xs text-[#0D1017] dark:text-[#EBE8E1] block font-mono">
                      Credit / Debit Card
                    </span>
                    <span className="text-[10px] text-[#5A6273] dark:text-[#8E95A5]">
                      Instant verified dispatch
                    </span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-4 border cursor-pointer transition-all rounded-[2px] btn-press ${
                      paymentMethod === 'CASH'
                        ? 'border-[#16284F] dark:border-[#4A72B0] bg-[#EBF0F8] dark:bg-[#1A2333]'
                        : 'border-[#DFD7C7] dark:border-[#262C3A]'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#16284F] dark:text-[#4A72B0] mb-2" />
                    <span className="font-semibold text-xs text-[#0D1017] dark:text-[#EBE8E1] block font-mono">
                      Cash on Delivery
                    </span>
                    <span className="text-[10px] text-[#5A6273] dark:text-[#8E95A5]">
                      Settle upon receipt
                    </span>
                  </div>
                </div>

                {paymentMethod === 'ONLINE' && (
                  <div className="space-y-3 pt-3 p-4 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] rounded-[2px]">
                    <div className="flex items-center justify-between text-[11px] text-[#5A6273] dark:text-[#8E95A5] font-mono">
                      <span>Secure Payment Simulation</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2A674A]" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#5A6273] dark:text-[#8E95A5] block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs font-mono text-[#0D1017] dark:text-[#EBE8E1] rounded-[2px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-mono text-[#5A6273] dark:text-[#8E95A5] block mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardExp}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardExp: e.target.value })}
                          className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs font-mono text-[#0D1017] dark:text-[#EBE8E1] rounded-[2px]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono text-[#5A6273] dark:text-[#8E95A5] block mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardCvc}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardCvc: e.target.value })}
                          className="w-full px-3 py-2 border border-[#DFD7C7] dark:border-[#262C3A] bg-transparent text-xs font-mono text-[#0D1017] dark:text-[#EBE8E1] rounded-[2px]"
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
                <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1]">
                  4. Review & Authorize Dispatch
                </h3>
                <p className="text-xs text-[#5A6273] dark:text-[#8E95A5] font-body-literary">
                  Confirm your acquisition details before our binders prepare your shipment.
                </p>

                <div className="p-4 border border-[#DFD7C7] dark:border-[#262C3A] space-y-3 text-xs font-mono rounded-[2px]">
                  <div className="flex justify-between border-b border-[#DFD7C7] dark:border-[#262C3A] pb-2">
                    <span className="text-[#5A6273] dark:text-[#8E95A5]">Recipient</span>
                    <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">{shippingDetails.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#DFD7C7] dark:border-[#262C3A] pb-2">
                    <span className="text-[#5A6273] dark:text-[#8E95A5]">Destination</span>
                    <span className="font-medium text-[#0D1017] dark:text-[#EBE8E1]">
                      {shippingDetails.address}, {shippingDetails.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A6273] dark:text-[#8E95A5]">Settlement</span>
                    <span className="font-medium text-[#16284F] dark:text-[#4A72B0]">{paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[#DFD7C7] dark:border-[#262C3A] font-mono">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="flex items-center gap-1.5 text-xs text-[#5A6273] hover:text-[#0D1017] dark:text-[#8E95A5] dark:hover:text-[#EBE8E1] btn-press"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="text-xs text-[#5A6273] hover:text-[#0D1017] dark:hover:text-[#EBE8E1] btn-press"
                >
                  ← Back to Bag
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold uppercase tracking-wider hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors flex items-center gap-2 cursor-pointer btn-press rounded-[2px]"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="px-8 py-3 bg-[#0B0E14] dark:bg-[#16284F] text-[#F7F4EB] text-xs font-semibold uppercase tracking-widest hover:bg-[#16284F] dark:hover:bg-[#203666] transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 btn-press rounded-[2px]"
                >
                  <span>{submitting ? 'Confirming...' : 'Place Order & Authorize'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 border border-[#DFD7C7] dark:border-[#262C3A] bg-[#FFFFFF] dark:bg-[#151821] p-6 space-y-4 rounded-[2px] shadow-2xs font-mono">
            <h3 className="font-editorial text-2xl text-[#0D1017] dark:text-[#EBE8E1] border-b border-[#DFD7C7] dark:border-[#262C3A] pb-3">
              Items for Dispatch ({cart.items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#DFD7C7]/60 dark:divide-[#262C3A]/60">
              {cart.items.map(({ book, quantity }) => (
                <div key={book.id} className="pt-2 first:pt-0 flex gap-3 text-xs">
                  <img
                    src={book.coverImage}
                    alt={book.bookTitle}
                    className="w-12 h-16 object-cover border border-[#DFD7C7] dark:border-[#262C3A] shrink-0 rounded-[2px]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-editorial text-base font-medium text-[#0D1017] dark:text-[#EBE8E1] truncate">
                      {book.bookTitle}
                    </p>
                    <p className="text-[11px] text-[#5A6273] dark:text-[#8E95A5]">
                      Qty: {quantity} · ${book.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#DFD7C7] dark:border-[#262C3A] pt-3 space-y-1.5 text-xs text-[#5A6273] dark:text-[#8E95A5]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0D1017] dark:text-[#EBE8E1]">
                  ${cart.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Archival Handling</span>
                <span className="font-semibold text-[#0D1017] dark:text-[#EBE8E1]">
                  {cart.shipping === 0 ? 'Complimentary' : `$${cart.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#0D1017] dark:text-[#EBE8E1] pt-2 border-t border-[#DFD7C7] dark:border-[#262C3A]">
                <span>Total Amount</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
