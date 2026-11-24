'use client';
import { useEffect, useState } from 'react';
import { supabase, slugify } from '../../lib/supabase';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [cred, setCred] = useState({ email: '', password: '' });
  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [f, setF] = useState({ title: '', summary: '', body: '', category_id: '', region: 'World', sponsored: false });
  const [msg, setMsg] = useState('');

  const loadCats = async () => {
    const { data } = await supabase.from('categories').select('*').order('id');
    setCats(data || []);
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    loadCats();
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword(cred);
    setMsg(error ? error.message : '');
  };
  const addCat = async () => {
    if (!newCat.trim()) return;
    const { error } = await supabase.from('categories').insert({ name: newCat.trim(), slug: slugify(newCat) });
    setMsg(error ? error.message : 'Category added.');
    setNewCat(''); loadCats();
  };
  const publish = async () => {
    if (!f.title.trim()) return setMsg('Add a title.');
    const slug = slugify(f.title) + '-' + Date.now().toString(36);
    const { error } = await supabase.from('posts').insert({ ...f, slug, category_id: f.category_id || null });
    setMsg(error ? error.message : 'Published.');
    if (!error) setF({ ...f, title: '', summary: '', body: '' });
  };

  if (!user) return (
    <div className="box" style={{ maxWidth: 400, margin: '30px auto' }}>
      <h2>Admin sign in</h2>
      <input placeholder="Email" type="email" onChange={(e) => setCred({ ...cred, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setCred({ ...cred, password: e.target.value })} />
      <button onClick={signIn}>Sign in</button>
      <p>{msg}</p>
    </div>
  );
  return (
    <div className="box" style={{ maxWidth: 700, margin: '20px auto' }}>
      <h2>Dashboard</h2>
      <h3 style={{ marginTop: 16 }}>New category</h3>
      <input value={newCat} placeholder="e.g. Food, Tech, Culture" onChange={(e) => setNewCat(e.target.value)} />
      <button onClick={addCat}>Add category</button>
      <h3 style={{ marginTop: 20 }}>New post</h3>
      <input placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <select value={f.category_id} onChange={(e) => setF({ ...f, category_id: e.target.value })}>
        <option value="">No category</option>
        {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select value={f.region} onChange={(e) => setF({ ...f, region: e.target.value })}>
        {['Nigeria', 'Africa', 'World'].map((r) => <option key={r}>{r}</option>)}
      </select>
      <textarea rows={2} placeholder="Summary" value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} />
      <textarea rows={8} placeholder="Story (blank line between paragraphs)" value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
      <label><input type="checkbox" style={{ width: 'auto' }} checked={f.sponsored} onChange={(e) => setF({ ...f, sponsored: e.target.checked })} /> Sponsored post</label>
      <div style={{ marginTop: 10 }}><button onClick={publish}>Publish</button> <button onClick={() => supabase.auth.signOut()} style={{ background: 'var(--mut)' }}>Sign out</button></div>
      <p>{msg}</p>
    </div>
  );
}
