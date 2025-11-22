# ☁️ Google Cloud Deployment Guide

Deploy your AI Numeracy Tutor to **Google Cloud Run** - Free tier friendly! 🎉

---

## 💰 Cost Estimate

**Google Cloud Run Free Tier (Per Month)**:
- ✅ 2 million requests FREE
- ✅ 360,000 GB-seconds of memory FREE
- ✅ 180,000 vCPU-seconds FREE

**Expected Monthly Cost**: **$0** (within free tier for educational use)
- Even with moderate usage: < $2/month
- **Well within your $5 budget!** ✅

---

## 🚀 Deployment Steps

### **Prerequisites**

1. **Google Cloud Account**
   - Visit: https://console.cloud.google.com/
   - Sign up with your Google account
   - You get **$300 free credits** for 90 days!

2. **Install Google Cloud SDK** (gcloud CLI)
   - Download: https://cloud.google.com/sdk/docs/install
   - Choose Windows installer
   - Run the installer
   - Follow installation prompts

---

### **Step 1: Set Up Google Cloud Project**

1. **Create a New Project**:
   ```bash
   gcloud projects create ai-numeracy-tutor --name="AI Numeracy Tutor"
   ```

2. **Set the Active Project**:
   ```bash
   gcloud config set project ai-numeracy-tutor
   ```

3. **Enable Required APIs**:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

---

### **Step 2: Configure Environment Variables**

Create a `.env.yaml` file for Cloud Run (don't commit this!):

```yaml
COHERE_API_KEY: "your_cohere_api_key_here"
GEMINI_API_KEY: "your_gemini_api_key_here"
NODE_ENV: "production"
```

Add `.env.yaml` to `.gitignore`:
```bash
echo .env.yaml >> .gitignore
```

---

### **Step 3: Deploy to Cloud Run**

#### **Option A: Deploy with gcloud CLI** (Recommended)

```bash
# Navigate to project directory
cd c:\Users\MYPC\Desktop\balaa_19

# Deploy to Cloud Run
gcloud run deploy ai-numeracy-tutor \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --env-vars-file .env.yaml \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 2
```

**Wait 3-5 minutes** for deployment to complete.

#### **Option B: Deploy from GitHub** (Alternative)

1. Push your code to GitHub (already done! ✅)
2. Go to: https://console.cloud.google.com/run
3. Click **"Create Service"**
4. Choose **"Continuously deploy new revisions from a source repository"**
5. Select your GitHub repo: `balaa123/ai-numeracy-tutor`
6. Click **"Save"**
7. Configure:
   - **Region**: us-central1
   - **Authentication**: Allow unauthenticated invocations
   - **Container port**: 8080
   - **Memory**: 512 MiB
   - **Environment variables**: Add COHERE_API_KEY and GEMINI_API_KEY
8. Click **"Create"**

---

### **Step 4: Get Your Deployment URL**

After deployment completes, you'll see:

```
Service [ai-numeracy-tutor] revision [ai-numeracy-tutor-00001-xxx] has been deployed and is serving 100 percent of traffic.
Service URL: https://ai-numeracy-tutor-xxxxxxxxxx-uc.a.run.app
```

**Copy that URL!** That's your live deployment! 🎉

---

## 🔧 Files Created for Deployment

I've created these files for you:

### ✅ `Dockerfile`
- Defines how to build your application container
- Uses Node.js 18 Alpine (lightweight)
- Optimized for Cloud Run

### ✅ `.dockerignore`
- Excludes unnecessary files from Docker image
- Reduces image size and deployment time

### ✅ Updated `server.js`
- Now uses PORT 8080 (Cloud Run default)
- Compatible with Cloud Run environment

---

## 🧪 Test Your Deployment

Once deployed, test these URLs:

```
# Home page
https://YOUR-SERVICE-URL.run.app

# Student portal
https://YOUR-SERVICE-URL.run.app/student

# Teacher dashboard
https://YOUR-SERVICE-URL.run.app/teacher
```

---

## 📊 Monitor Your Usage & Costs

1. **View Metrics**:
   - Go to: https://console.cloud.google.com/run
   - Click on your service
   - See requests, CPU, memory usage

2. **Check Costs**:
   - Go to: https://console.cloud.google.com/billing
   - View current spending (should be $0 in free tier)

---

## 🔐 Security Best Practices

### **Environment Variables**

**Already configured!** Your `.env.yaml` is:
- ✅ Excluded from Git (.gitignore)
- ✅ Passed securely to Cloud Run
- ✅ Never exposed in logs

### **Database Persistence**

**Important**: SQLite data won't persist on Cloud Run restarts!

**Solutions**:
1. **Use Cloud SQL** (costs ~$7/month - over budget)
2. **Use Firestore** (generous free tier, NoSQL)
3. **Accept ephemeral storage** (for demo purposes)

For this demo, ephemeral storage is fine. Data resets when service restarts (rare).

---

## 💡 Optimization Tips

### **Reduce Costs Further**:

1. **Set Minimum Instances to 0**:
   ```bash
   --min-instances 0
   ```
   Service scales to zero when not in use (FREE!)

2. **Reduce Memory**:
   ```bash
   --memory 256Mi
   ```
   Sufficient for this app

3. **Set Max Instances**:
   ```bash
   --max-instances 2
   ```
   Prevents unexpected scaling costs

### **Full Optimized Deploy Command**:

```bash
gcloud run deploy ai-numeracy-tutor \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --env-vars-file .env.yaml \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 2 \
  --timeout 300
```

**Estimated Cost**: $0 - $1/month 💰

---

## 🎯 Quick Deploy Checklist

- [ ] Install Google Cloud SDK
- [ ] Create Google Cloud account
- [ ] Create new project
- [ ] Enable Cloud Run API
- [ ] Create `.env.yaml` with API keys
- [ ] Run deploy command
- [ ] Copy deployment URL
- [ ] Test the deployment
- [ ] Share the URL!

---

## 🆘 Troubleshooting

### **"gcloud: command not found"**
- Restart your terminal after installing gcloud
- Or add to PATH manually

### **"Permission denied"**
- Run: `gcloud auth login`
- Follow browser authentication

### **"Billing not enabled"**
- Go to: https://console.cloud.google.com/billing
- Link a billing account (won't charge within free tier)

### **"Build failed"**
- Check Dockerfile syntax
- Ensure all files are committed
- Check logs: `gcloud builds log`

---

## 📱 Share Your Deployment

Once deployed, share this info:

**Live Application**:
```
🌐 URL: https://ai-numeracy-tutor-xxxxxxxxxx-uc.a.run.app
👨‍🎓 Student Portal: https://YOUR-URL/student
👨‍🏫 Teacher Dashboard: https://YOUR-URL/teacher
```

**GitHub Repository**:
```
📂 Source Code: https://github.com/balaa123/ai-numeracy-tutor
```

---

## 🎉 Next Steps After Deployment

1. **Add Custom Domain** (Optional):
   - Buy a domain (e.g., ai-tutor.education)
   - Point to your Cloud Run service
   - Free with Cloud Run!

2. **Set Up Monitoring**:
   - Enable Cloud Monitoring
   - Get alerts for errors

3. **Add Analytics**:
   - Google Analytics for usage tracking
   - Monitor student engagement

---

## 💰 Cost Breakdown

| Service | Free Tier | Expected Usage | Cost |
|---------|-----------|----------------|------|
| **Cloud Run** | 2M requests/month | ~10K requests/month | $0 |
| **Cloud Build** | 120 builds/day | 1-2 builds/day | $0 |
| **Container Registry** | 5 GB storage | ~500 MB | $0 |
| **Cohere API** | Free tier | Within limits | $0 |
| **Gemini API** | Free tier | Within limits | $0 |
| **Total** | | | **$0/month** ✅ |

**Well within $5 budget!** 🎊

---

**Ready to deploy? Let's do it!** 🚀

Run the commands and share your deployment URL! 🌐
