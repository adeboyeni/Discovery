# Discovery: start here (no terminal needed)

You only need a browser. Everything below is free. Menu names on these sites change now and then, so look for the closest match.

## Part 1: Database (Supabase, about 10 minutes)
1. Go to supabase.com, sign up, and click New project. Pick any name and a password. Save the password.
2. Open SQL Editor, click New query, paste everything from the file supabase/schema.sql, then click Run.
3. Open Authentication, then Users, then Add user. Enter your email and a password. This is your admin login.
4. In Authentication settings, turn OFF "Allow new users to sign up". This stops strangers from posting.
5. Open Project Settings, then API (or Data API). Copy two things for Part 3: the Project URL and the anon public key.

## Part 2: Put the code on GitHub (about 5 minutes)
1. Go to github.com, sign up, click New repository, name it discovery, and create it.
2. Unzip discovery.zip on your computer.
3. On the new repository page click "uploading an existing file". Drag in everything inside the unzipped folder (including the app, components, lib, public and supabase folders). Click Commit changes.

## Part 3: Free hosting (Netlify, about 5 minutes)
1. Go to netlify.com and sign up with your GitHub account.
2. Click Add new project, then Import an existing project, then GitHub, and choose discovery.
3. Before you click Deploy, open Environment variables and add these two in the Builds scope for production and any deploy previews you use:
   - NEXT_PUBLIC_SUPABASE_URL = the Project URL you copied
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = the anon public key you copied (never use a service-role key)
4. Click Deploy. In a few minutes you get a free address like yourname.netlify.app.
5. Open yourname.netlify.app/admin, sign in, add categories and publish your first post.

Whenever you change a file on GitHub, Netlify updates the site by itself.

## Part 4: Your own domain (needed for ads)
1. Buy a domain. Nigerian registrars such as Whogohost, Truehost and Qservers accept naira. Namecheap works with a dollar card. A .com.ng is usually the cheapest. Check the renewal price before you pay, because the first year is often discounted.
2. In Netlify open Domain management, click Add a domain, and type your domain.
3. Netlify shows DNS settings. Copy them into your registrar's DNS page, or change the nameservers to the ones Netlify gives you. It can take a few hours to start working.

## Part 5: Ads
Google AdSense generally needs your own domain and a site with real posts. Publish 15 to 20 good posts first, then apply. After approval, add these in Netlify under Environment variables, then redeploy:
NEXT_PUBLIC_ADSENSE_CLIENT, NEXT_PUBLIC_AD_SLOT_TOP, NEXT_PUBLIC_AD_SLOT_SIDE, NEXT_PUBLIC_AD_SLOT_ARTICLE
Until then the empty ad boxes say "Advertise with us". You can sell them directly to brands.

## Optional: run on your computer
Copy .env.example to .env.local, fill it in, then run: npm install, then npm run dev.
