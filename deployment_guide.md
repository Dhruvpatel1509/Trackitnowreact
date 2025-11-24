# Deploying Trackit to Vercel (Free)

Since this is a **Vite + React** app, the best place to deploy it for free is **Vercel**.

## Prerequisites
1.  A **GitHub** account.
2.  A **Vercel** account (you can sign up with GitHub).

## Step 1: Push to GitHub
You need to push your code to a GitHub repository.

1.  Initialize Git (if not already done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Link and push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy on Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and select `frontend` (since your React app is in a subfolder).
5.  Click **Deploy**.

## Step 3: Environment Variables (Optional but Recommended)
If you want to keep your Supabase keys safe (instead of hardcoding them in `supabase.js`):
1.  In Vercel, go to **Settings** -> **Environment Variables**.
2.  Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3.  Update your `src/lib/supabase.js` to use `import.meta.env.VITE_SUPABASE_URL`.

For now, since the keys are already in the code, **Step 2 is enough to get it online!** 🚀

hello
how are ya?
badhu barabar
alles gut
first test