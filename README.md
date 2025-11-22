# AI Numeracy Tutor for Government Schools

An AI-powered tutoring system that provides personalized numeracy education for students in government schools across India. Features gamified learning, multilingual support (English, Hindi, Tamil, Telugu), and teacher analytics.

## 🌟 Features

### For Students
- **Gamified Learning**: Duolingo-style interactive interface with points, badges, and levels
- **Adaptive Difficulty**: AI adjusts question difficulty based on performance
- **Multilingual Support**: Learn in English, Hindi, Tamil, or Telugu
- **Personalized Feedback**: AI-generated explanations using Cohere
- **Progress Tracking**: Visual progress indicators and achievement system
- **Topics**: Addition, Subtraction, Multiplication, Division

### For Teachers
- **Student Dashboard**: Overview of all students and their progress
- **Analytics**: Detailed performance metrics with charts
- **Learning Gap Identification**: AI identifies students who need help
- **Individual Student Reports**: Deep dive into each student's performance

### AI Integration
- **Cohere API**: Generates personalized explanations and hints in multiple languages
- **Google Gemini API**: Creates adaptive questions and analyzes student responses

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Cohere API key
- Google Gemini API key

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd c:\Users\MYPC\Desktop\balaa_19
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```
   COHERE_API_KEY=your_cohere_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Home: http://localhost:3000
   - Student Portal: http://localhost:3000/student
   - Teacher Dashboard: http://localhost:3000/teacher

## 📁 Project Structure

```
balaa_19/
├── server.js              # Express server
├── database.js            # SQLite database setup and operations
├── ai-engine.js           # AI integration (Cohere & Gemini)
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── .env.example           # Environment template
├── tutoring.db            # SQLite database (auto-created)
└── public/
    ├── index.html         # Landing page
    ├── student.html       # Student learning interface
    ├── teacher.html       # Teacher dashboard
    ├── css/
    │   ├── index.css
    │   ├── student.css
    │   └── teacher.css
    └── js/
        ├── translations.js # Multilingual support
        ├── student.js      # Student interface logic
        └── teacher.js      # Teacher dashboard logic
```

## 🎮 How to Use

### Student Flow
1. Navigate to http://localhost:3000/student
2. Create a new student profile or select existing one
3. Choose preferred language (English/Hindi/Tamil/Telugu)
4. Select a topic to practice (Addition, Subtraction, etc.)
5. Answer questions in Duolingo-style interface
6. Get instant AI-powered feedback
7. Earn points, badges, and level up!

### Teacher Flow
1. Navigate to http://localhost:3000/teacher
2. View overview dashboard with key metrics
3. Click on "Students" to see all students
4. Click "View Details" on any student to see:
   - Topic performance
   - Learning gaps
   - Recent activity
   - Earned badges

## 🔑 Getting API Keys

### Cohere API
1. Visit https://cohere.com
2. Sign up for a free account
3. Go to dashboard and generate an API key
4. Copy the key to your `.env` file

### Google Gemini API
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

## 🌐 Multilingual Support

The system supports 4 languages:
- 🇬🇧 **English**: Default language
- 🇮🇳 **हिंदी (Hindi)**: National language
- 🇮🇳 **தமிழ் (Tamil)**: Regional language
- 🇮🇳 **తెలుగు (Telugu)**: Regional language

Students can switch languages anytime from the dashboard. All AI-generated content (explanations, hints) adapts to the selected language.

## 📊 Database Schema

The SQLite database includes:
- **students**: Student profiles and progress
- **teachers**: Teacher accounts
- **questions**: Question bank with difficulty levels
- **progress**: Student learning progress tracking
- **achievements**: Badges and rewards
- **student_answers**: Detailed answer history

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **AI/ML**: 
  - Cohere API (explanations & hints)
  - Google Gemini API (adaptive questions)
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Charting**: Chart.js
- **Styling**: Custom CSS with gradients and animations

## 🎨 Design Features

- **Duolingo-inspired UI**: Familiar, engaging interface
- **Vibrant Gradients**: Modern, premium feel
- **Micro-animations**: Smooth transitions and hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light themes**: Adaptive color schemes

## 📝 Future Enhancements

- [ ] Add more topics (fractions, geometry, etc.)
- [ ] Implement voice-based questions for young learners
- [ ] Add parent portal for progress monitoring
- [ ] Offline mode support
- [ ] Integration with school management systems
- [ ] More regional languages
- [ ] Competitive leaderboards
- [ ] Certificate generation

## 🐛 Troubleshooting

### Database not created
- The database is auto-created on first run
- Check file permissions in the project directory

### API errors
- Verify your API keys in `.env`
- Check API rate limits (Cohere free tier has limits)
- Ensure internet connection for API calls

### Port already in use
- Change PORT in `.env` to another value (e.g., 3001)
- Or stop the process using port 3000

## 📄 License

MIT License - feel free to use for educational purposes in government schools!

## 🤝 Contributing

This project is designed for government schools in India. Contributions welcome for:
- Additional language support
- New topics and questions
- UI/UX improvements
- Bug fixes

---

**Built with ❤️ for equitable education in India**
