## 🎥 Walkthrough Video

[![Watch the demo](https://img.youtube.com/vi/01eX5l9Kbr8/0.jpg)](https://youtu.be/01eX5l9Kbr8)

👉 Click the image above to watch the full project walkthrough.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

the problem/blunder which i did while working on assigment and how i tackle them 

1) Runtime Error: Cannot read properties of undefined (reading 'auth')

Error !
Cannot read properties of undefined (reading 'auth')

Cause

supabase was undefined because:
I didn’t create the Supabase client properly

fix : NEXT_PUBLIC_ prefix missing

2) Wrong Redirect URL (supabase.co repeated twice)

i feel this is the biggest blunder which i did and takes hour to decode ,

the fix : https://xxxx.supabase.co/auth/v1/callback

3) Realtime Not Updating (Needed Refresh)
Issue:
Bookmarks were not updating in real-time; I had to refresh manually.

Cause
Realtime was NOT enabled for the table in Supabase.

Fix
Enabled realtime for the bookmarks table using:

alter publication supabase_realtime add table public.bookmarks;
