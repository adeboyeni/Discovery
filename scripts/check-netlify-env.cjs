const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length) {
  console.error(`Missing required Netlify build variables: ${missing.join(', ')}.`);
  console.error('Add the Supabase project URL and public anon key to the Builds scope for this deploy context. Do not use a service-role key.');
  process.exitCode = 1;
}
