'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const join = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMsg('Enter a valid email address.');
    const { error } = await supabase.from('subscribers').insert({ email: email.trim().toLowerCase() });
    setMsg(!error || error.code === '23505' ? 'You’re on the list. See you tomorrow.' : 'Something went wrong. Try again.');
    if (!error) setEmail('');
  };
  return (
    <div className="box">
      <h3 style={{ fontSize: 18, marginBottom: 6 }}>Get Today’s Discovery by email</h3>
      <p style={{ margin: '0 0 8px', color: 'var(--mut)', fontSize: 14 }}>One short brief every morning.</p>
      <input type="email" placeholder="you@example.com" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={join} style={{ width: '100%' }}>Subscribe</button>
      <p style={{ fontSize: 13, margin: '8px 0 0' }}>{msg}</p>
    </div>
  );
}
