# Deployment Guide — Henil Patel Portfolio

---

## Option 1: GitHub Pages (Free — Recommended)

### Step 1 — Create GitHub Account
Go to https://github.com → Sign up (free)

### Step 2 — Create Repository
1. Click **New repository**
2. Name it: `henil-patel.github.io` (replace with your username)
3. Set to **Public**
4. Click **Create repository**

### Step 3 — Upload Files
1. Click **uploading an existing file**
2. Drag ALL files from your portfolio folder:
   - `index.html`
   - `assets/` folder (with all subfolders)
   - `admin-guide.md`
3. Click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Source: **Deploy from branch**
3. Branch: **main** → **/ (root)**
4. Click **Save**

### Step 5 — Your site is live!
URL: `https://YOUR-USERNAME.github.io`
(takes 2–5 minutes to go live)

---

## Option 2: Vercel (Free — Fastest)

### Step 1
Go to https://vercel.com → Sign up with GitHub

### Step 2
Click **New Project** → Import your GitHub repo

### Step 3
- Framework: **Other**
- No build command needed
- Click **Deploy**

### Step 4 — Live!
URL: `https://your-repo.vercel.app`
(deploys in ~30 seconds)

---

## Option 3: Custom Domain (henilpatel.tech)

### Buy Domain
Go to https://namecheap.com or https://godaddy.com
Search: `henilpatel.tech` (~₹800/year)

### Connect to GitHub Pages
1. In your repo → **Settings → Pages → Custom domain**
2. Enter: `henilpatel.tech`
3. In your domain registrar → DNS Settings → Add:
   - Type: `A`, Name: `@`, Value: `185.199.108.153`
   - Type: `A`, Name: `@`, Value: `185.199.109.153`
   - Type: `CNAME`, Name: `www`, Value: `your-username.github.io`
4. Wait 10–30 minutes → site live at `henilpatel.tech`

---

## Updating Your Portfolio

### After editing portfolio.json:
1. Go to your GitHub repo
2. Click on `assets/data/portfolio.json`
3. Click the **pencil (edit) icon**
4. Make your changes
5. Click **Commit changes**
6. Site updates in ~1 minute automatically

### To upload new files (certificates, reports):
1. Navigate to the folder in GitHub
2. Click **Add file → Upload files**
3. Upload your PDF/image
4. Commit → done

---

## Local Preview (Before Publishing)

```bash
# Python 3
cd portfolio-final
python3 -m http.server 8080
# Open: http://localhost:8080
```

⚠️ Must use a server — `file://` won't work (fetch() needs HTTP)
