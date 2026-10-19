import React, { useEffect, useState } from 'react';
import { Truck, Loader2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

const inputCls =
  'w-full px-3 py-2 border border-[#E3D6BC] dark:border-[#4A3E2E] bg-transparent text-[#3B2B1E] dark:text-[#F3ECDD] rounded-[2px] focus:border-[#8A6238] transition-colors';

export const AdminShipping: React.FC = () => {
  const { showToast } = useToast();
  const [fee, setFee] = useState('');
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getShippingSettings()
      .then((s) => {
        setFee(String(s.fee));
        setThreshold(s.freeShippingThreshold == null ? '' : String(s.freeShippingThreshold));
      })
      .catch(() => {
        setLoadFailed(true);
        showToast('Could not load shipping settings', 'error');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const feeNum = Number(fee);
    const thrNum = threshold.trim() === '' ? null : Number(threshold);
    if (fee.trim() === '' || !(feeNum >= 0) || (thrNum !== null && !(thrNum >= 0))) {
      showToast('Enter amounts of 0 or more', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.updateShippingSettings({ fee: feeNum, freeShippingThreshold: thrNum });
      showToast('Shipping settings saved');
    } catch (err: any) {
      showToast(err?.message || 'Could not save shipping settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const feeNum = Number(fee) || 0;
  const thrNum = threshold.trim() === '' ? null : Number(threshold);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-[#E3D6BC] dark:border-[#4A3E2E] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#8A6238] dark:text-[#D9AE6B] font-semibold">Store settings</span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#3B2B1E] dark:text-[#F3ECDD] mt-1">Shipping fee</h1>
      </div>

      <form onSubmit={save} className="border border-[#E3D6BC] dark:border-[#4A3E2E] bg-[#FFFFFF] dark:bg-[#2A231B] p-6 space-y-5">
        <div>
          <label htmlFor="ship-fee" className="block font-semibold mb-1 text-[#3B2B1E] dark:text-[#F3ECDD]">Shipping fee ($)</label>
          <input id="ship-fee" type="number" min="0" step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} disabled={loading} className={inputCls} />
          <p className="text-xs text-[#65513F] dark:text-[#A99A82] mt-1">Charged on every order below the free-shipping amount. 0 means shipping is free.</p>
        </div>

        <div>
          <label htmlFor="ship-free" className="block font-semibold mb-1 text-[#3B2B1E] dark:text-[#F3ECDD]">Free shipping from ($)</label>
          <input id="ship-free" type="number" min="0" step="0.01" value={threshold} onChange={(e) => setThreshold(e.target.value)} disabled={loading} placeholder="Leave empty to always charge shipping" className={inputCls} />
        </div>

        <div className="flex items-start gap-3 p-3 bg-[#FAF6EC] dark:bg-[#231D16] text-[#65513F] dark:text-[#A99A82]">
          <Truck className="w-5 h-5 shrink-0 mt-0.5 text-[#8A6238]" />
          <p>
            {feeNum === 0
              ? 'Customers currently pay nothing for shipping.'
              : thrNum === null
                ? `Every order pays $${feeNum.toFixed(2)} shipping.`
                : `Orders under $${thrNum.toFixed(2)} pay $${feeNum.toFixed(2)} shipping; larger orders ship free.`}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || saving || loadFailed}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3B2B1E] dark:bg-[#8A6238] text-[#FAF6EC] hover:bg-[#8A6238] disabled:opacity-60 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer btn-press rounded-[2px]"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
        </button>
      </form>
    </div>
  );
};