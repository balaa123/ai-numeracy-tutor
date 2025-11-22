# 🔐 Fix GitHub Authentication Error

## ⚠️ Error You're Seeing:
```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed
```

This happens because GitHub stopped accepting passwords in 2021. You need a **Personal Access Token (PAT)** instead.

---

## ✅ Solution: Use Personal Access Token

### Step 1: Create a Personal Access Token

1. **Go to GitHub Settings**:
   - Visit: https://github.com/settings/tokens
   - Or: GitHub.com → Your Profile (top right) → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**:
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Give it a name: `ai-numeracy-tutor`
   - Set expiration: Choose how long it should last (recommended: 90 days)
   
3. **Select Scopes** (permissions):
   - ✅ Check **`repo`** (this gives full control of private repositories)
   - That's all you need for now!

4. **Generate and Copy**:
   - Click **"Generate token"** at the bottom
   - **IMPORTANT**: Copy the token immediately (it starts with `ghp_...`)
   - You won't be able to see it again!
   - Save it somewhere safe (like a password manager)

### Step 2: Push Using the Token

When you run `git push`, Git will ask for your password. **Instead of your GitHub password**, paste your Personal Access Token.

```bash
# Run this command
git push -u origin main

# When prompted:
Username: balaa123
Password: [paste your token here - it will be invisible while typing]
```

**OR** you can include it in the URL:

```bash
# First, remove the old remote
git remote remove origin

# Add remote with token in URL
git remote add origin https://YOUR_TOKEN@github.com/balaa123/ai-numeracy-tutor.git

# Now push
git push -u origin main
```

Replace `YOUR_TOKEN` with your actual token (the one starting with `ghp_...`)

---

## 🎯 Alternative: Use GitHub Desktop (Easier!)

If command line authentication is tricky, use **GitHub Desktop** (recommended for beginners):

### Option 1: GitHub Desktop

1. **Download**: https://desktop.github.com/
2. **Install and Sign In** with your GitHub account
3. **Add Repository**:
   - File → Add Local Repository
   - Choose: `c:\Users\MYPC\Desktop\balaa_19`
4. **Publish**:
   - Click "Publish repository"
   - It will automatically authenticate!
   - Choose Public or Private
   - Click "Publish Repository"

✅ Done! No token needed with GitHub Desktop!

---

## 🎯 Alternative: Use GitHub CLI

Another easy option:

```bash
# Install GitHub CLI from: https://cli.github.com/

# After installation:
gh auth login

# Follow the interactive prompts
# Then push:
git push -u origin main
```

---

## 🔧 Quick Fix Commands

### If you want to try again with token:

```powershell
# Remove old remote
git remote remove origin

# Add new remote (replace YOUR_TOKEN with your actual token)
git remote add origin https://ghp_YOUR_TOKEN_HERE@github.com/balaa123/ai-numeracy-tutor.git

# Push
git push -u origin main
```

---

## ⚡ Recommended Approach for You:

**Option 1: GitHub Desktop** (Easiest)
- No need to mess with tokens
- Visual interface
- One-click publish
- Download: https://desktop.github.com/

**Option 2: Personal Access Token**
- More technical
- Good to learn
- Create token: https://github.com/settings/tokens

Choose whichever you're comfortable with!

---

## 🆘 Need Help Creating Token?

I can open the GitHub token creation page for you. Just let me know!

Or if you prefer the easy route, download GitHub Desktop and I'll help you use that instead.

What would you prefer?
1. **"token"** - I'll help you create a Personal Access Token
2. **"desktop"** - I'll help you set up GitHub Desktop
3. **"cli"** - I'll help you use GitHub CLI

Let me know! 🚀
