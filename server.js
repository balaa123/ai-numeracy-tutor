const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const {
    initializeDatabase,
    studentOps,
    progressOps,
    achievementOps,
    questionOps,
    answerOps,
    teacherOps
} = require('./database');
const aiEngine = require('./ai-engine');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
initializeDatabase();

// ============= STUDENT ENDPOINTS =============

// Get all students
app.get('/api/students', (req, res) => {
    try {
        const students = studentOps.getAll();
        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get student by ID
app.get('/api/students/:id', (req, res) => {
    try {
        const student = studentOps.getById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new student
app.post('/api/students', (req, res) => {
    try {
        const { name, grade, language } = req.body;
        const studentId = studentOps.create(name, grade, language);
        const student = studentOps.getById(studentId);
        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get student progress
app.get('/api/students/:id/progress', (req, res) => {
    try {
        const progress = progressOps.getByStudent(req.params.id);
        const stats = progressOps.getStats(req.params.id);
        res.json({ success: true, progress, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get student achievements
app.get('/api/students/:id/achievements', (req, res) => {
    try {
        const achievements = achievementOps.getByStudent(req.params.id);
        res.json({ success: true, achievements });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============= QUESTION ENDPOINTS =============

// Get questions for practice
app.get('/api/questions', (req, res) => {
    try {
        const { difficulty, topic, count } = req.query;
        let questions;

        if (topic) {
            questions = questionOps.getByTopic(topic, parseInt(difficulty) || 1);
        } else {
            questions = questionOps.getByDifficulty(parseInt(difficulty) || 1, parseInt(count) || 5);
        }

        res.json({ success: true, questions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Submit answer
app.post('/api/answers', async (req, res) => {
    try {
        const { studentId, questionId, answer, timeTaken } = req.body;

        const question = questionOps.getById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, error: 'Question not found' });
        }

        const isCorrect = String(answer).trim() === String(question.correct_answer).trim();

        // Record answer
        answerOps.record(studentId, questionId, answer, isCorrect, timeTaken);

        // Update progress
        const points = isCorrect ? 10 : 0;
        const student = studentOps.getById(studentId);
        progressOps.add(studentId, question.topic, question.difficulty, isCorrect ? 1 : 0);
        studentOps.updateProgress(studentId, points, student.current_level);

        // Check for new badges
        const updatedStudent = studentOps.getById(studentId);
        const recentProgress = progressOps.getByStudent(studentId);
        const newBadges = aiEngine.checkBadges(updatedStudent, recentProgress);

        // Add new badges to database
        for (const badge of newBadges) {
            achievementOps.add(studentId, badge.type, badge.name);
        }

        // Get AI explanation if wrong
        let explanation = null;
        if (!isCorrect) {
            explanation = await aiEngine.generateExplanation(
                question,
                answer,
                question.correct_answer,
                student.language
            );
        }

        res.json({
            success: true,
            isCorrect,
            correctAnswer: question.correct_answer,
            points,
            explanation,
            newBadges,
            student: updatedStudent
        });
    } catch (error) {
        console.error('Answer submission error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get hint for question
app.post('/api/hints', async (req, res) => {
    try {
        const { questionId, language } = req.body;
        const question = questionOps.getById(questionId);

        if (!question) {
            return res.status(404).json({ success: false, error: 'Question not found' });
        }

        const hint = await aiEngine.generateHint(question, language);
        res.json({ success: true, hint });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate AI question
app.post('/api/questions/generate', async (req, res) => {
    try {
        const { topic, difficulty, language } = req.body;
        const question = await aiEngine.generateQuestion(topic, difficulty, language);
        res.json({ success: true, question });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============= TEACHER ENDPOINTS =============

// Get all students overview
app.get('/api/teacher/students', (req, res) => {
    try {
        const students = teacherOps.getAllStudentsOverview();
        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get detailed student analytics
app.get('/api/teacher/students/:id/analytics', (req, res) => {
    try {
        const analytics = teacherOps.getStudentAnalytics(req.params.id);

        // Identify learning gaps
        const gaps = [];
        analytics.stats.forEach(stat => {
            if (stat.avg_score < 0.6) {
                gaps.push({
                    topic: stat.topic,
                    avgScore: stat.avg_score,
                    attempts: stat.attempts,
                    severity: stat.avg_score < 0.4 ? 'high' : 'medium'
                });
            }
        });

        analytics.learningGaps = gaps;
        res.json({ success: true, analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============= SERVE FRONTEND =============

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'teacher.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   AI Numeracy Tutor - Server Running      ║
║                                            ║
║   🌐 Server: http://localhost:${PORT}       ║
║   👨‍🎓 Student: http://localhost:${PORT}/student ║
║   👨‍🏫 Teacher: http://localhost:${PORT}/teacher ║
║                                            ║
╚════════════════════════════════════════════╝
  `);
});
