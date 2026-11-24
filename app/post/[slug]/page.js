import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import AdSlot from '../../../components/AdSlot';

async function getPost(slug) {
  const { data } = await supabase.from('posts').select('*, categories(name)').eq('slug', slug).maybeSingle();
  return data;
}
export async function generateMetadata({ params }) {
  const p = await getPost(params.slug);
  return p ? { title: `${p.title} – Discovery`, description: p.summary } : {};
}
export default async function Post({ params }) {
  const p = await getPost(params.slug);
  if (!p) notFound();
  await supabase.rpc('increment_views', { p_slug: params.slug });
  const paras = (p.body || p.summary || '').split(/\n\s*\n/);
  return (
    <article className="full">
      <div className="meta">
        <span className="tag">{p.categories?.name || 'General'}</span>
        {p.sponsored && <span className="tag sp">Sponsored</span>}
        <span>{p.region}</span>
        <span>{new Date(p.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</span>
      </div>
      <h1 style={{ margin: '10px 0 16px' }}>{p.title}</h1>
      {paras.map((t, i) => (
        <div key={i}>
          <p>{t}</p>
          {i === 0 && <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE} label="In-article" />}
        </div>
      ))}
    </article>
  );
}
