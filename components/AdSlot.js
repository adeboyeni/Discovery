'use client';
import { useEffect } from 'react';
export default function AdSlot({ slot, label = 'Ad space' }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  useEffect(() => {
    if (client && slot) { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {} }
  }, [client, slot]);
  if (!client || !slot) return <div className="ad">{label}: your ad here. <a href="mailto:ads@example.com">Advertise with us</a></div>;
  return (
    <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={client}
      data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
  );
}
