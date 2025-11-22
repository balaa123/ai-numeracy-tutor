const Database = require('better-sqlite3');
const path = require('path');

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'tutoring.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
function initializeDatabase() {
    // Students table
    db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      grade INTEGER NOT NULL,
      language TEXT DEFAULT 'en',
      current_level INTEGER DEFAULT 1,
      total_points INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Teachers table
    db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Progress tracking
    db.exec(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      topic TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      score REAL NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

    // Achievements/Badges
    db.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      badge_type TEXT NOT NULL,
      badge_name TEXT NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

    // Questions bank
    db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      question_type TEXT NOT NULL,
      question_data TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Student answers
    db.exec(`
    CREATE TABLE IF NOT EXISTS student_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      answer TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      time_taken INTEGER,
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    )
  `);

    console.log('✅ Database initialized successfully');

    // Seed initial data
    seedInitialData();
}

// Seed initial questions
function seedInitialData() {
    const checkQuestions = db.prepare('SELECT COUNT(*) as count FROM questions').get();

    if (checkQuestions.count === 0) {
        const insert = db.prepare(`
      INSERT INTO questions (topic, difficulty, question_type, question_data, correct_answer)
      VALUES (?, ?, ?, ?, ?)
    `);

        // Level 1 - Basic Addition
        const questions = [
            ['addition', 1, 'select', JSON.stringify({ num1: 2, num2: 3, options: [5, 4, 6, 3] }), '5'],
            ['addition', 1, 'select', JSON.stringify({ num1: 1, num2: 4, options: [5, 6, 4, 3] }), '5'],
            ['addition', 1, 'select', JSON.stringify({ num1: 3, num2: 2, options: [5, 4, 6, 7] }), '5'],

            // Level 2 - Harder Addition
            ['addition', 2, 'select', JSON.stringify({ num1: 12, num2: 8, options: [20, 19, 21, 18] }), '20'],
            ['addition', 2, 'select', JSON.stringify({ num1: 15, num2: 7, options: [22, 23, 21, 20] }), '22'],

            // Level 1 - Basic Subtraction
            ['subtraction', 1, 'select', JSON.stringify({ num1: 5, num2: 2, options: [3, 2, 4, 7] }), '3'],
            ['subtraction', 1, 'select', JSON.stringify({ num1: 8, num2: 3, options: [5, 6, 4, 11] }), '5'],

            // Level 2 - Harder Subtraction
            ['subtraction', 2, 'select', JSON.stringify({ num1: 20, num2: 8, options: [12, 13, 11, 28] }), '12'],
            ['subtraction', 2, 'select', JSON.stringify({ num1: 25, num2: 9, options: [16, 15, 17, 34] }), '16'],

            // Level 1 - Basic Multiplication
            ['multiplication', 1, 'select', JSON.stringify({ num1: 2, num2: 3, options: [6, 5, 7, 8] }), '6'],
            ['multiplication', 1, 'select', JSON.stringify({ num1: 3, num2: 3, options: [9, 6, 12, 8] }), '9'],

            // Level 2 - Harder Multiplication
            ['multiplication', 2, 'select', JSON.stringify({ num1: 4, num2: 5, options: [20, 19, 21, 9] }), '20'],
            ['multiplication', 2, 'select', JSON.stringify({ num1: 6, num2: 7, options: [42, 41, 43, 13] }), '42'],

            // Level 1 - Basic Division
            ['division', 1, 'select', JSON.stringify({ num1: 6, num2: 2, options: [3, 2, 4, 8] }), '3'],
            ['division', 1, 'select', JSON.stringify({ num1: 10, num2: 5, options: [2, 3, 5, 15] }), '2'],

            // Level 3 - Mixed word problems
            ['word_problem', 3, 'input', JSON.stringify({ text: 'Ram has 5 apples. His friend gives him 3 more. How many apples does Ram have now?' }), '8'],
            ['word_problem', 3, 'input', JSON.stringify({ text: 'A box contains 12 chocolates. If you eat 4 chocolates, how many are left?' }), '8'],
        ];

        const insertMany = db.transaction((questions) => {
            for (const q of questions) {
                insert.run(...q);
            }
        });

        insertMany(questions);
        console.log('✅ Seeded initial questions');
    }

    // Create demo student if none exists
    const checkStudents = db.prepare('SELECT COUNT(*) as count FROM students').get();
    if (checkStudents.count === 0) {
        db.prepare(`
      INSERT INTO students (name, grade, language, current_level, total_points)
      VALUES (?, ?, ?, ?, ?)
    `).run('Demo Student', 3, 'en', 1, 0);
        console.log('✅ Created demo student');
    }

    // Create demo teacher if none exists
    const checkTeachers = db.prepare('SELECT COUNT(*) as count FROM teachers').get();
    if (checkTeachers.count === 0) {
        db.prepare(`
      INSERT INTO teachers (name, email)
      VALUES (?, ?)
    `).run('Demo Teacher', 'teacher@school.gov.in');
        console.log('✅ Created demo teacher');
    }
}

// Student operations
const studentOps = {
    getAll: () => db.prepare('SELECT * FROM students').all(),

    getById: (id) => db.prepare('SELECT * FROM students WHERE id = ?').get(id),

    create: (name, grade, language = 'en') => {
        const result = db.prepare(`
      INSERT INTO students (name, grade, language)
      VALUES (?, ?, ?)
    `).run(name, grade, language);
        return result.lastInsertRowid;
    },

    updateProgress: (studentId, points, level) => {
        return db.prepare(`
      UPDATE students 
      SET total_points = total_points + ?, current_level = ?
      WHERE id = ?
    `).run(points, level, studentId);
    },

    updateStreak: (studentId) => {
        return db.prepare(`
      UPDATE students 
      SET streak_days = streak_days + 1
      WHERE id = ?
    `).run(studentId);
    }
};

// Progress operations
const progressOps = {
    add: (studentId, topic, difficulty, score) => {
        return db.prepare(`
      INSERT INTO progress (student_id, topic, difficulty, score)
      VALUES (?, ?, ?, ?)
    `).run(studentId, topic, difficulty, score);
    },

    getByStudent: (studentId) => {
        return db.prepare(`
      SELECT * FROM progress 
      WHERE student_id = ? 
      ORDER BY completed_at DESC
    `).all(studentId);
    },

    getStats: (studentId) => {
        return db.prepare(`
      SELECT 
        topic,
        AVG(score) as avg_score,
        COUNT(*) as attempts,
        MAX(difficulty) as max_difficulty
      FROM progress
      WHERE student_id = ?
      GROUP BY topic
    `).all(studentId);
    }
};

// Achievement operations
const achievementOps = {
    add: (studentId, badgeType, badgeName) => {
        return db.prepare(`
      INSERT INTO achievements (student_id, badge_type, badge_name)
      VALUES (?, ?, ?)
    `).run(studentId, badgeType, badgeName);
    },

    getByStudent: (studentId) => {
        return db.prepare(`
      SELECT * FROM achievements 
      WHERE student_id = ? 
      ORDER BY earned_at DESC
    `).all(studentId);
    }
};

// Question operations
const questionOps = {
    getByDifficulty: (difficulty, limit = 5) => {
        return db.prepare(`
      SELECT * FROM questions 
      WHERE difficulty = ? 
      ORDER BY RANDOM()
      LIMIT ?
    `).all(difficulty, limit);
    },

    getByTopic: (topic, difficulty) => {
        return db.prepare(`
      SELECT * FROM questions 
      WHERE topic = ? AND difficulty = ?
      ORDER BY RANDOM()
      LIMIT 5
    `).all(topic, difficulty);
    },

    getById: (id) => {
        return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
    }
};

// Answer operations
const answerOps = {
    record: (studentId, questionId, answer, isCorrect, timeTaken) => {
        return db.prepare(`
      INSERT INTO student_answers (student_id, question_id, answer, is_correct, time_taken)
      VALUES (?, ?, ?, ?, ?)
    `).run(studentId, questionId, answer, isCorrect, timeTaken);
    },

    getByStudent: (studentId) => {
        return db.prepare(`
      SELECT sa.*, q.topic, q.difficulty 
      FROM student_answers sa
      JOIN questions q ON sa.question_id = q.id
      WHERE sa.student_id = ?
      ORDER BY sa.answered_at DESC
    `).all(studentId);
    }
};

// Teacher operations
const teacherOps = {
    getAll: () => db.prepare('SELECT * FROM teachers').all(),

    getStudentAnalytics: (studentId) => {
        const student = studentOps.getById(studentId);
        const stats = progressOps.getStats(studentId);
        const recentProgress = progressOps.getByStudent(studentId);
        const achievements = achievementOps.getByStudent(studentId);

        return {
            student,
            stats,
            recentProgress: recentProgress.slice(0, 10),
            achievements
        };
    },

    getAllStudentsOverview: () => {
        return db.prepare(`
      SELECT 
        s.*,
        COUNT(DISTINCT p.topic) as topics_attempted,
        AVG(p.score) as avg_score
      FROM students s
      LEFT JOIN progress p ON s.id = p.student_id
      GROUP BY s.id
    `).all();
    }
};

module.exports = {
    db,
    initializeDatabase,
    studentOps,
    progressOps,
    achievementOps,
    questionOps,
    answerOps,
    teacherOps
};
