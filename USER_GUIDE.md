# 🎯 How to Use the AI Numeracy Tutor

This guide will walk you through using the system as both a student and a teacher.

---

## 👨‍🎓 FOR STUDENTS

### Getting Started

#### Step 1: Access the Student Portal
1. Open your web browser
2. Go to: `http://localhost:3000/student`
3. You'll see the student selection screen

#### Step 2: Create Your Profile (First Time Only)
1. Click the **"➕ Create New Student"** button
2. Fill in the form:
   - **Your Name**: Enter your name (e.g., "Rahul Kumar")
   - **Grade**: Select your grade (1-5)
   - **Language**: Choose your preferred language
     - 🇬🇧 English
     - 🇮🇳 हिंदी (Hindi)
     - 🇮🇳 தமிழ் (Tamil)  
     - 🇮🇳 తెలుగు (Telugu)
3. Click **"Create Profile"**

#### Step 3: Explore Your Dashboard
Once logged in, you'll see:
- **Your Name & Avatar**: Top left corner
- **Your Stats**: 
  - ⭐ Points: Earn 10 points for each correct answer
  - 🔥 Streak: Days you've practiced in a row
  - 🏆 Level: Your current difficulty level
- **Progress Bar**: Shows your overall progress
- **Topic Cards**: Four math topics to practice

#### Step 4: Start Practicing

##### Choose a Topic
Click **"Practice"** on any topic card:
- **➕ Addition**: Learn to add numbers
- **➖ Subtraction**: Learn to subtract numbers
- **✖️ Multiplication**: Learn to multiply numbers
- **➗ Division**: Learn to divide numbers

##### Answer Questions
1. **Read the Question**: A math problem will appear
   - Example: `5 + 3 = ?`
2. **Select Your Answer**: Click on one of the four options
3. **Check Your Answer**: Click the **"Check"** button

##### Get Feedback
- **✅ Correct Answer**: 
  - You'll see a green checkmark
  - Earn +10 points!
  - Click **"Continue"** to next question
  
- **❌ Wrong Answer**:
  - You'll see what you got wrong
  - AI will explain the correct answer in your language
  - Learn and click **"Continue"**

##### Use Hints
- Stuck on a question? Click **"💡 Hint"**
- AI will give you a helpful clue without revealing the answer
- You can only use hint once per question

#### Step 5: Complete the Quiz
- Answer all 5 questions
- See your results:
  - How many you got correct (e.g., "4/5")
  - Total points earned (e.g., "+40")
  - Any new badges you've earned!

#### Step 6: Earn Badges 🏅
You earn badges by:
- **First Step**: Getting your first answer correct
- **Math Explorer**: Reaching 50 points
- **Math Champion**: Reaching 100 points  
- **Perfect Five**: Getting 5 in a row correct

#### Step 7: Switch Languages Anytime
- Use the language dropdown at the top
- All content, hints, and explanations will change to your new language
- Your progress is saved!

---

## 👨‍🏫 FOR TEACHERS

### Getting Started

#### Step 1: Access the Teacher Dashboard
1. Open your web browser
2. Go to: `http://localhost:3000/teacher`
3. You'll see the teacher dashboard

### Understanding the Overview Tab

#### Key Metrics (Top Cards)
- **👥 Total Students**: Number of students using the system
- **⭐ Average Score**: Overall class performance percentage
- **🎯 Active This Week**: Students who practiced recently
- **⚠️ Need Attention**: Students with avg score below 60%

#### Charts
1. **Topic Performance Chart**:
   - Shows average scores for each topic
   - Identifies which topics need more focus
   - Green bars = strong performance
   - Red/Orange bars = need help

2. **Progress Distribution Pie Chart**:
   - **Green**: Excellent students (80%+)
   - **Blue**: Good students (60-80%)
   - **Yellow**: Need help (40-60%)
   - **Red**: Struggling (<40%)
   - **Gray**: Haven't started yet

### Monitoring Students

#### Step 1: View All Students
1. Click **"👥 Students"** in the sidebar
2. See a table with all students

#### Step 2: Understand the Table
Columns show:
- **Name**: Student's name
- **Grade**: Their grade level
- **Level**: Current difficulty level
- **Points**: Total points earned
- **Topics Attempted**: How many topics they've tried
- **Avg Score**: Their average score percentage
- **Status**: Performance category
  - 🟢 Excellent (80%+)
  - 🔵 Good (60-80%)
  - 🟡 Needs Help (40-60%)
  - 🔴 Struggling (<40%)

#### Step 3: Search for Students
- Use the search box at the top
- Type a student's name
- Table filters in real-time

### Viewing Individual Student Details

#### Step 1: Open Student Details
- Click **"View Details"** button next to any student
- A detailed modal will open

#### Step 2: Review Student Summary
Top section shows:
- **Grade**: Student's current grade
- **Current Level**: Difficulty level they're at
- **Total Points**: All-time points earned
- **Streak**: Consecutive days of practice

#### Step 3: Analyze Topic Performance
**Topic Performance section** shows:
- Each topic the student has attempted
- Their average score for that topic
- Number of attempts
- Max difficulty level reached
- **Color coding**:
  - 🟢 Green (80%+): Student is strong
  - 🟡 Yellow (60-79%): Doing okay
  - 🔴 Red (<60%): Struggling

#### Step 4: Identify Learning Gaps ⚠️
**Learning Gaps section** lists topics where student is struggling:
- **High Severity** (Red): Avg score < 40% - Immediate attention needed
- **Medium Severity** (Yellow): Avg score 40-60% - Needs practice

**Example**:
```
⚠️ subtraction
Average score: 45% over 8 attempts - Needs practice
```

**Action**: Plan extra lessons or one-on-one time on this topic

#### Step 5: Check Recent Activity
Shows the last 10 exercises:
- Date completed
- Topic practiced
- Difficulty level
- Whether they got it correct or wrong

**Use this to**:
- See if student is improving over time
- Identify if they're attempting harder problems
- Track engagement frequency

#### Step 6: View Achievements
See all badges the student has earned:
- 🏅 First Step
- 🏅 Math Explorer  
- 🏅 Math Champion
- 🏅 Perfect Five

**Use this to**:
- Celebrate student achievements
- Motivate others by sharing success
- Identify highly engaged students

---

## 💡 BEST PRACTICES

### For Students
1. **Practice Daily**: Even 10 minutes helps!
2. **Use Hints Wisely**: Try to think first, use hints when really stuck
3. **Learn from Mistakes**: Read the AI explanations carefully
4. **Build Your Streak**: Try to practice every day
5. **Challenge Yourself**: As you level up, problems get harder
6. **Switch Languages**: If explanation doesn't make sense, try another language

### For Teachers
1. **Check Dashboard Weekly**: Monitor student engagement
2. **Prioritize "Need Attention"**: These students need help first
3. **Celebrate Achievements**: Recognize students earning badges
4. **Use Learning Gaps**: Plan lessons around identified weak areas
5. **Encourage Streaks**: Praise students with high streaks
6. **Track Progress**: Compare scores week-over-week
7. **Intervene Early**: Don't wait for students to fall too far behind

---

## 🎮 GAMIFICATION EXPLAINED

### How Points Work
- **10 points** for each correct answer
- **0 points** for wrong answers
- Points unlock higher levels
- More points = higher on class leaderboard

### How Levels Work
- Start at **Level 1** (easy questions)
- After consistent correct answers, level up to **Level 2**
- Higher levels = harder questions = more challenge
- Each topic has its own level

### How Streaks Work
- Practice on consecutive days
- **1 day** of practice = **+1 to streak**
- Miss a day = streak resets to 0
- Streaks motivate daily practice

### How Badges Work
Automatic awards for milestones:
- First correct answer
- 50 points total
- 100 points total
- 5 perfect answers in a row
- More badges as system grows!

---

## ❓ COMMON QUESTIONS

### Students

**Q: I got the answer wrong. Will I lose points?**
A: No! You don't lose points. Only correct answers earn points.

**Q: Can I practice the same topic multiple times?**
A: Yes! Practice as much as you want. More practice = better understanding.

**Q: What if I don't understand the AI explanation?**
A: Try switching to your mother tongue using the language selector.

**Q: How do I unlock new topics?**
A: All topics are unlocked from the start! Choose any topic anytime.

**Q: Can I change my language after creating my profile?**
A: Yes! Use the dropdown menu at the top anytime.

### Teachers

**Q: How often is data updated?**
A: Real-time! Refresh the page to see latest student activity.

**Q: Can I export student data?**
A: Currently, you can view and screenshot reports. Export feature coming soon!

**Q: What does "Learning Gap" mean?**
A: Topics where a student's average score is below 60%, indicating they need help.

**Q: How do I add more students?**
A: Students self-register through the Student Portal. No teacher action needed!

**Q: Can I see which questions students got wrong?**
A: In the Recent Activity section, you can see correct/incorrect for each attempt.

**Q: What's a good average score?**
A: 
- 80%+ = Excellent
- 60-80% = Good, on track
- 40-60% = Needs help
- <40% = Struggling, intervention needed

---

## 📱 TIPS & TRICKS

### Maximize Points
1. Take your time - accuracy over speed
2. Use hints when stuck (better than guessing)
3. Practice daily to maintain streak
4. Focus on topics where you're strongest to build confidence

### Effective Teaching
1. Start class by showing the overview dashboard
2. Recognize top performers publicly
3. Work with "struggling" students privately
4. Use learning gaps to plan next lessons
5. Set class goals (e.g., "Everyone earn Math Explorer badge")

### Engagement Ideas
1. **Weekly Leaderboard**: Highest points wins
2. **Streak Challenge**: Who can maintain the longest streak?
3. **Badge Race**: First to earn all badges
4. **Topic Master**: Perfect score on one topic
5. **Class Goal**: Entire class reaches 1000 total points

---

## 🔧 TROUBLESHOOTING

### For Students

**Problem**: "I can't see my progress"
- **Solution**: Make sure you're logged in with your profile

**Problem**: "Questions are too hard"
- **Solution**: Your level will adjust down if you get several wrong. Keep practicing!

**Problem**: "Questions are too easy"
- **Solution**: Keep getting them right! System will level you up automatically.

**Problem**: "AI hint didn't help"
- **Solution**: Try switching languages - sometimes different wording helps!

### For Teachers

**Problem**: "No students showing"
- **Solution**: Students must self-register first. Direct them to student portal.

**Problem**: "Charts not loading"
- **Solution**: Refresh the page. Check browser console for errors.

**Problem**: "Student data looks wrong"
- **Solution**: Click "View Details" for accurate, detailed information.

---

**Happy Learning! 🎓✨**

Remember: The goal isn't perfection - it's progress. Every attempt, right or wrong, is learning!
