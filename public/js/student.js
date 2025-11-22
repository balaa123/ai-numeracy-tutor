// Global state
let currentStudent = null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizQuestions = [];
let quizAnswers = [];
let currentLanguage = 'en';
let selectedAnswer = null;
let startTime = null;

// API Base URL
const API_URL = window.location.origin + '/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
});

// ============= STUDENT SELECTION =============

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        const data = await response.json();

        if (data.success) {
            displayStudents(data.students);
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(students) {
    const container = document.getElementById('studentList');
    container.innerHTML = '';

    students.forEach(student => {
        const item = document.createElement('div');
        item.className = 'student-item';
        item.onclick = () => selectStudent(student.id);

        const languageNames = {
            en: '🇬🇧 English',
            hi: '🇮🇳 हिंदी',
            ta: '🇮🇳 தமிழ்',
            te: '🇮🇳 తెలుగు'
        };

        item.innerHTML = `
      <div class="student-avatar">👤</div>
      <div class="student-details">
        <div class="student-name">${student.name}</div>
        <div class="student-meta">Grade ${student.grade} • ${languageNames[student.language] || student.language} • Level ${student.current_level}</div>
      </div>
    `;

        container.appendChild(item);
    });
}

function showNewStudentForm() {
    document.getElementById('newStudentForm').classList.remove('hidden');
}

function hideNewStudentForm() {
    document.getElementById('newStudentForm').classList.add('hidden');
}

async function createStudent() {
    const name = document.getElementById('studentName').value.trim();
    const grade = document.getElementById('studentGrade').value;
    const language = document.getElementById('studentLanguage').value;

    if (!name) {
        alert('Please enter your name');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, grade: parseInt(grade), language })
        });

        const data = await response.json();

        if (data.success) {
            selectStudent(data.student.id);
        }
    } catch (error) {
        console.error('Error creating student:', error);
        alert('Failed to create student profile');
    }
}

async function selectStudent(studentId) {
    try {
        const response = await fetch(`${API_URL}/students/${studentId}`);
        const data = await response.json();

        if (data.success) {
            currentStudent = data.student;
            currentLanguage = data.student.language;
            showDashboard();
        }
    } catch (error) {
        console.error('Error selecting student:', error);
    }
}

// ============= DASHBOARD =============

async function showDashboard() {
    // Hide selection, show dashboard
    document.getElementById('studentSelect').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');

    // Update student info
    document.getElementById('studentNameDisplay').textContent = currentStudent.name;
    document.getElementById('totalPoints').textContent = currentStudent.total_points;
    document.getElementById('streakDays').textContent = currentStudent.streak_days;
    document.getElementById('currentLevel').textContent = currentStudent.current_level;

    // Set language
    document.getElementById('languageSwitch').value = currentLanguage;
    applyTranslations(currentLanguage);

    // Load progress
    await loadProgress();

    // Load achievements
    await loadAchievements();
}

async function loadProgress() {
    try {
        const response = await fetch(`${API_URL}/students/${currentStudent.id}/progress`);
        const data = await response.json();

        if (data.success && data.stats) {
            // Calculate overall progress
            const totalAttempts = data.stats.reduce((sum, stat) => sum + stat.attempts, 0);
            const avgScore = data.stats.reduce((sum, stat) => sum + stat.avg_score * stat.attempts, 0) / Math.max(totalAttempts, 1);

            // Update progress bar
            const progressPercent = Math.round(avgScore * 100);
            document.getElementById('progressFill').style.width = progressPercent + '%';
            document.getElementById('progressText').textContent =
                progressPercent >= 80 ? translations[currentLanguage].excellent + ' 🎉' :
                    progressPercent >= 60 ? translations[currentLanguage].keep_going :
                        translations[currentLanguage].keep_going;

            // Update topic levels
            data.stats.forEach(stat => {
                const levelElement = document.getElementById(`${stat.topic}Level`);
                if (levelElement) {
                    levelElement.textContent = stat.max_difficulty || 1;
                }
            });
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

async function loadAchievements() {
    try {
        const response = await fetch(`${API_URL}/students/${currentStudent.id}/achievements`);
        const data = await response.json();

        if (data.success) {
            const container = document.getElementById('badgesList');

            if (data.achievements.length === 0) {
                container.innerHTML = '<div class="badge-placeholder">' +
                    (currentLanguage === 'en' ? 'Complete exercises to earn badges!' :
                        currentLanguage === 'hi' ? 'बैज पाने के लिए अभ्यास पूरा करें!' :
                            currentLanguage === 'ta' ? 'பேட்ஜ்கள் பெற பயிற்சிகளை முடிக்கவும்!' :
                                'బ్యాడ్జ్‌లను పొందడానికి వ్యాయామాలను పూర్తి చేయండి!') +
                    '</div>';
            } else {
                container.innerHTML = data.achievements
                    .map(ach => `<div class="badge">🏅 ${ach.badge_name}</div>`)
                    .join('');
            }
        }
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}

function changeLanguage() {
    currentLanguage = document.getElementById('languageSwitch').value;
    applyTranslations(currentLanguage);
}

function logout() {
    currentStudent = null;
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('studentSelect').classList.add('active');
    loadStudents();
}

// ============= QUIZ FUNCTIONALITY =============

async function startPractice(topic) {
    currentQuiz = { topic };
    currentQuestionIndex = 0;
    quizAnswers = [];

    // Load questions
    try {
        const difficulty = currentStudent.current_level;
        const response = await fetch(`${API_URL}/questions?topic=${topic}&difficulty=${difficulty}&count=5`);
        const data = await response.json();

        if (data.success) {
            quizQuestions = data.questions;

            // Show quiz screen
            document.getElementById('dashboard').classList.remove('active');
            document.getElementById('quizScreen').classList.add('active');

            // Show first question
            showQuestion();
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions. Please try again.');
    }
}

function showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const questionData = JSON.parse(question.question_data);

    // Reset state
    selectedAnswer = null;
    startTime = Date.now();
    document.getElementById('feedbackPanel').classList.add('hidden');
    document.getElementById('hintBox').classList.add('hidden');

    // Update progress
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    document.getElementById('quizProgressFill').style.width = progress + '%';
    document.getElementById('quizCounter').textContent = `${currentQuestionIndex + 1}/${quizQuestions.length}`;

    // Update topic
    const topicNames = {
        en: { addition: 'Addition', subtraction: 'Subtraction', multiplication: 'Multiplication', division: 'Division' },
        hi: { addition: 'जोड़', subtraction: 'घटाव', multiplication: 'गुणा', division: 'भाग' },
        ta: { addition: 'கூட்டல்', subtraction: 'கழித்தல்', multiplication: 'பெருக்கல்', division: 'வகுத்தல்' },
        te: { addition: 'కూడిక', subtraction: 'తీసివేత', multiplication: 'గుణకారం', division: 'భాగహారం' }
    };
    document.getElementById('questionTopic').textContent = topicNames[currentLanguage][question.topic];

    // Build question text
    let questionText = '';
    if (question.question_type === 'select') {
        const operators = {
            addition: '+',
            subtraction: '−',
            multiplication: '×',
            division: '÷'
        };
        questionText = `${questionData.num1} ${operators[question.topic]} ${questionData.num2} = ?`;
    } else {
        questionText = questionData.text;
    }

    document.getElementById('questionText').textContent = questionText;

    // Display options
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    questionData.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => selectOption(btn, option);
        container.appendChild(btn);
    });

    // Reset button states
    document.getElementById('checkBtn').disabled = true;
    document.getElementById('hintBtn').disabled = false;
}

function selectOption(button, answer) {
    // Deselect all
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Select clicked
    button.classList.add('selected');
    selectedAnswer = answer;

    // Enable check button
    document.getElementById('checkBtn').disabled = false;
}

async function checkAnswer() {
    if (!selectedAnswer) {
        console.log('No answer selected');
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    console.log('Checking answer:', {
        questionId: question.id,
        selectedAnswer: selectedAnswer,
        timeTaken: timeTaken
    });

    // Disable all buttons
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
    document.getElementById('checkBtn').disabled = true;
    document.getElementById('hintBtn').disabled = true;

    try {
        const response = await fetch(`${API_URL}/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: currentStudent.id,
                questionId: question.id,
                answer: selectedAnswer,
                timeTaken
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Answer response:', data);

        if (data.success) {
            // Update current student data
            currentStudent = data.student;

            // Record answer
            quizAnswers.push({
                isCorrect: data.isCorrect,
                points: data.points
            });

            // Show feedback
            showFeedback(data.isCorrect, data.correctAnswer, data.explanation, data.newBadges);
        } else {
            console.error('API returned failure:', data.error);
            alert('Error: ' + (data.error || 'Failed to submit answer'));
            // Re-enable buttons
            document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = false);
            document.getElementById('checkBtn').disabled = false;
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        alert('Failed to submit answer: ' + error.message);
        // Re-enable buttons
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = false);
        document.getElementById('checkBtn').disabled = false;
    }
}

function showFeedback(isCorrect, correctAnswer, explanation, newBadges) {
    console.log('Showing feedback:', { isCorrect, correctAnswer, explanation });

    const panel = document.getElementById('feedbackPanel');
    panel.classList.remove('hidden', 'correct', 'wrong');
    panel.classList.add(isCorrect ? 'correct' : 'wrong');

    // Highlight correct/wrong answer
    document.querySelectorAll('.option-btn').forEach(btn => {
        const btnText = btn.textContent.trim();
        const correctAns = String(correctAnswer).trim();

        if (btnText === correctAns) {
            btn.classList.add('correct');
        } else if (btn.classList.contains('selected') && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Set feedback text
    const title = isCorrect ?
        translations[currentLanguage].excellent :
        translations[currentLanguage].oops;

    const message = isCorrect ?
        translations[currentLanguage].correct_answer :
        translations[currentLanguage].not_quite;

    document.getElementById('feedbackTitle').textContent = title;
    document.getElementById('feedbackMessage').textContent = message;

    // Show explanation if wrong
    const explanationBox = document.getElementById('explanationBox');
    if (!isCorrect && explanation) {
        explanationBox.textContent = explanation;
        explanationBox.classList.remove('hidden');
    } else {
        explanationBox.classList.add('hidden');
    }

    // Show new badges
    if (newBadges && newBadges.length > 0) {
        console.log('New badges earned:', newBadges);
        // We'll show these on the results screen
    }

    // Scroll feedback into view
    setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

async function getHint() {
    const question = quizQuestions[currentQuestionIndex];

    try {
        const response = await fetch(`${API_URL}/hints`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                questionId: question.id,
                language: currentLanguage
            })
        });

        const data = await response.json();

        if (data.success) {
            const hintBox = document.getElementById('hintBox');
            hintBox.textContent = '💡 ' + data.hint;
            hintBox.classList.remove('hidden');

            // Disable hint button after use
            document.getElementById('hintBtn').disabled = true;
        }
    } catch (error) {
        console.error('Error getting hint:', error);
    }
}

function exitQuiz() {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
        backToDashboard();
    }
}

// ============= RESULTS =============

function showResults() {
    document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');

    // Calculate results
    const correctCount = quizAnswers.filter(a => a.isCorrect).length;
    const totalPoints = quizAnswers.reduce((sum, a) => sum + a.points, 0);

    document.getElementById('finalScore').textContent = `${correctCount}/${quizQuestions.length}`;
    document.getElementById('pointsEarned').textContent = `+${totalPoints}`;

    // Update stats display
    document.getElementById('totalPoints').textContent = currentStudent.total_points;

    // Check for new badges (we could fetch this from the last answer)
    // For now, we'll skip detailed badge display on results
}

function backToDashboard() {
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.remove('active');
    showDashboard();
}

function practiceAgain() {
    startPractice(currentQuiz.topic);
}
