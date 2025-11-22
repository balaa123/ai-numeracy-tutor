# 🚀 Quick Setup Guide

## Prerequisites Installation

Your system needs Node.js and npm installed. Here's how:

### Step 1: Install Node.js

1. **Download Node.js**:
   - Visit: https://nodejs.org/
   - Download the **LTS version** (recommended for most users)
   - Choose the Windows Installer (.msi) 64-bit

2. **Run the installer**:
   - Double-click the downloaded file
   - Follow the installation wizard
   - **Important**: Check the box "Automatically install the necessary tools"
   - Click "Install"

3. **Verify installation**:
   Open PowerShell or Command Prompt and type:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers if installed correctly.

### Step 2: Add Your API Keys

1. Open the file: `c:\Users\MYPC\Desktop\balaa_19\.env`

2. Replace the placeholder text with your actual API keys:
   ```
   COHERE_API_KEY=paste_your_cohere_key_here
   GEMINI_API_KEY=paste_your_gemini_key_here
   PORT=3000
   NODE_ENV=development
   ```

3. Save the file

**Getting API Keys:**

- **Cohere**: https://dashboard.cohere.com/api-keys (Sign up free)
- **Gemini**: https://makersuite.google.com/app/apikey (Sign in with Google)

### Step 3: Install Dependencies

Open PowerShell in the project directory and run:
```bash
cd c:\Users\MYPC\Desktop\balaa_19
npm install
```

This will install all required packages:
- express (web server)
- better-sqlite3 (database)
- cohere-ai (AI explanations)
- @google/generative-ai (AI questions)
- Plus other dependencies

### Step 4: Start the Application

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║   AI Numeracy Tutor - Server Running      ║
║                                            ║
║   🌐 Server: http://localhost:3000         ║
║   👨‍🎓 Student: http://localhost:3000/student ║
║   👨‍🏫 Teacher: http://localhost:3000/teacher ║
║                                            ║
╚════════════════════════════════════════════╝
```

### Step 5: Access the Application

Open your web browser and visit:
- **Home Page**: http://localhost:3000
- **Student Portal**: http://localhost:3000/student
- **Teacher Dashboard**: http://localhost:3000/teacher

## 🎮 Quick Test

1. Go to **Student Portal**
2. Click "Create New Student"
3. Enter a name, select grade and language
4. Click "Practice" on any topic
5. Answer questions and see AI feedback!

## ❓ Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Restart your computer after installing Node.js
- Or manually add Node.js to system PATH

### "Cannot find module" errors
- Run `npm install` again
- Delete `node_modules` folder and run `npm install`

### Database errors
- The database (tutoring.db) is auto-created on first run
- Make sure you have write permissions in the project folder

### API errors
- Verify your API keys in `.env` file
- Make sure there are no quotes around the keys
- Check if you have internet connection

### Port already in use
- Change PORT in `.env` from 3000 to 3001
- Or close any application using port 3000

## 📞 Need Help?

Check the main README.md for detailed documentation!

---

**Ready to transform numeracy education! 🎓✨**
