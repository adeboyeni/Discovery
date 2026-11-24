import Link from 'next/link';
import { supabase } from '../lib/supabase';
import AdSlot from '../components/AdSlot';
import Newsletter from '../components/Newsletter';

const REGIONS = ['Nigeria', 'Africa', 'World'];
const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const href = (cat, region) => {
  const p = new URLSearchParams();
  if (cat) p.set('cat', cat);
  if (region) p.set('region', region);
  return p.toString() ? `/?${p}` : '/';
};

export default async function Home({ searchParams }) {
  const { cat, region } = searchParams;
  const { data: cats = [] } = await supabase.from('categories').select('*').order('id');
  let q = supabase.from('posts')
    .select('title,slug,summary,region,sponsored,created_at,categories(name)')
    .eq('published', true).order('created_at', { ascending: false }).limit(30);
  const c = cats.find((x) => x.slug === cat);
  if (c) q = q.eq('category_id', c.id);
  if (REGIONS.includes(region)) q = q.eq('region', region);
  const [{ data: posts = [] }, { data: trending = [] }] = await Promise.all([
    q,
    supabase.from('posts').select('title,slug').eq('published', true).order('views', { ascending: false }).limit(5),
  ]);

  return (
    <>
      <nav className="chips" aria-label="Categories">
        <Link className={'chip' + (!cat ? ' on' : '')} href={href(null, region)}>All</Link>
        {cats.map((x) => <Link key={x.id} className={'chip' + (cat === x.slug ? ' on' : '')} href={href(x.slug, region)}>{x.name}</Link>)}
      </nav>
      <nav className="chips" aria-label="Region">
        {REGIONS.map((r) => <Link key={r} className={'chip' + (region === r ? ' on' : '')} href={href(cat, region === r ? null : r)}>{r}</Link>)}
      </nav>
      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} label="Top banner" />
      {posts.length > 0 && (
        <section className="today">
          <h2>Today’s Discovery</h2>
          <p style={{ opacity: 0.7, marginTop: 4 }}>Three stories worth a minute of your day</p>
          <ol>{posts.slice(0, 3).map((p) => <li key={p.slug}><Link href={`/post/${p.slug}`}>{p.title}</Link></li>)}</ol>
        </section>
      )}
      <div className="grid">
        <main>
          {posts.length === 0 && <div className="post">No stories here yet.</div>}
          {posts.map((p) => (
            <article className="post" key={p.slug}>
              <div className="meta">
                <span className="tag">{p.categories?.name || 'General'}</span>
                {p.sponsored && <span className="tag sp">Sponsored</span>}
                <span>{p.region}</span><span>{fmt(p.created_at)}</span>
              </div>
              <h3><Link href={`/post/${p.slug}`}>{p.title}</Link></h3>
              <p style={{ color: 'var(--mut)', margin: 0 }}>{p.summary}</p>
            </article>
          ))}
        </main>
        <aside>
          <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDE} label="Sidebar" />
          <div className="box">
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Trending now</h3>
            {trending.map((t) => <p key={t.slug} style={{ margin: '0 0 8px' }}><Link href={`/post/${t.slug}`}>{t.title}</Link></p>)}
          </div>
          <Newsletter />
        </aside>
      </div>
    </>
  );
}
