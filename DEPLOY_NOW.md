# ☁️ Quick Deployment Guide

## 🚀 Deploy to Google Cloud Run (FREE!)

Your app is ready to deploy! Follow these simple steps:

---

### **Step 1: Install Google Cloud SDK**

1. Download: https://cloud.google.com/sdk/docs/install
2. Run the Windows installer
3. Follow installation prompts
4. Restart your terminal

---

### **Step 2: Authenticate**

```bash
gcloud auth login
gcloud config set project ai-numeracy-tutor
```

---

### **Step 3: Create .env.yaml with Your API Keys**

Create a file named `.env.yaml` with:

```yaml
COHERE_API_KEY: "YOUR_COHERE_KEY_HERE"
GEMINI_API_KEY: "YOUR_GEMINI_KEY_HERE"
NODE_ENV: "production"
PORT: "8080"
```

**Replace the keys with your actual API keys!**

---

### **Step 4: Deploy!**

```bash
cd c:\Users\MYPC\Desktop\balaa_19

gcloud run deploy ai-numeracy-tutor \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --env-vars-file .env.yaml \
  --memory 256Mi \
  --min-instances 0 \
  --max-instances 2
```

Wait 3-5 minutes for deployment...

---

### **Step 5: Get Your URL!**

After deployment, you'll see:

```
Service URL: https://ai-numeracy-tutor-xxxxxxxxxx-uc.a.run.app
```

**That's your live deployment URL!** 🎉

---

## 💰 Cost: $0/month

- ✅ 2 million requests FREE
- ✅ Auto-scales to zero when not in use
- ✅ No credit card charged

---

## 🧪 Test Your Deployment

```
https://YOUR-URL.run.app           # Home
https://YOUR-URL.run.app/student   # Student Portal
https://YOUR-URL.run.app/teacher   # Teacher Dashboard
```

---

**Need detailed instructions?** See `CLOUD_DEPLOYMENT.md`

**Ready to deploy? Run the commands above!** 🚀
