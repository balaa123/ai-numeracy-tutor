// API Base URL
const API_URL = window.location.origin + '/api';

// Charts
let topicChart = null;
let progressChart = null;

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOverview();
    loadStudents();
});

// ============= NAVIGATION =============

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
}

// ============= OVERVIEW =============

async function loadOverview() {
    try {
        const response = await fetch(`${API_URL}/teacher/students`);
        const data = await response.json();

        if (data.success) {
            displayOverviewStats(data.students);
            createCharts(data.students);
        }
    } catch (error) {
        console.error('Error loading overview:', error);
    }
}

function displayOverviewStats(students) {
    // Total students
    document.getElementById('totalStudents').textContent = students.length;

    // Average score
    const studentsWithScore = students.filter(s => s.avg_score !== null);
    const avgScore = studentsWithScore.length > 0
        ? studentsWithScore.reduce((sum, s) => sum + s.avg_score, 0) / studentsWithScore.length
        : 0;
    document.getElementById('avgScore').textContent = Math.round(avgScore * 100) + '%';

    // Active students (those who have attempted topics)
    const activeStudents = students.filter(s => s.topics_attempted > 0).length;
    document.getElementById('activeStudents').textContent = activeStudents;

    // Struggling students (avg score < 60%)
    const strugglingStudents = students.filter(s => s.avg_score !== null && s.avg_score < 0.6).length;
    document.getElementById('strugglingStudents').textContent = strugglingStudents;
}

function createCharts(students) {
    // Destroy existing charts
    if (topicChart) topicChart.destroy();
    if (progressChart) progressChart.destroy();

    // Topic performance chart (placeholder - would need detailed data)
    const topicCtx = document.getElementById('topicChart').getContext('2d');
    topicChart = new Chart(topicCtx, {
        type: 'bar',
        data: {
            labels: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
            datasets: [{
                label: 'Average Score (%)',
                data: [75, 68, 62, 58],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(88, 204, 2, 0.8)',
                    'rgba(255, 200, 0, 0.8)'
                ],
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    // Progress distribution chart
    const progressCtx = document.getElementById('progressChart').getContext('2d');

    // Categorize students
    const excellent = students.filter(s => s.avg_score >= 0.8).length;
    const good = students.filter(s => s.avg_score >= 0.6 && s.avg_score < 0.8).length;
    const needsHelp = students.filter(s => s.avg_score >= 0.4 && s.avg_score < 0.6).length;
    const struggling = students.filter(s => s.avg_score !== null && s.avg_score < 0.4).length;
    const notStarted = students.filter(s => s.avg_score === null).length;

    progressChart = new Chart(progressCtx, {
        type: 'doughnut',
        data: {
            labels: ['Excellent (80%+)', 'Good (60-80%)', 'Needs Help (40-60%)', 'Struggling (<40%)', 'Not Started'],
            datasets: [{
                data: [excellent, good, needsHelp, struggling, notStarted],
                backgroundColor: [
                    '#58cc02',
                    '#667eea',
                    '#ffc800',
                    '#ff4b4b',
                    '#cccccc'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ============= STUDENTS LIST =============

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/teacher/students`);
        const data = await response.json();

        if (data.success) {
            displayStudents(data.students);
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(students) {
    const tbody = document.getElementById('studentsTableBody');

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">No students found</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(student => {
        const avgScore = student.avg_score !== null ? Math.round(student.avg_score * 100) : 0;
        const status = getStatus(avgScore, student.topics_attempted);

        return `
      <tr data-student-name="${student.name.toLowerCase()}">
        <td><strong>${student.name}</strong></td>
        <td>${student.grade}</td>
        <td>${student.current_level}</td>
        <td>${student.total_points}</td>
        <td>${student.topics_attempted || 0}</td>
        <td>${avgScore}%</td>
        <td><span class="status-badge ${status.class}">${status.text}</span></td>
        <td>
          <button class="btn-view" onclick="viewStudent(${student.id})">View Details</button>
        </td>
      </tr>
    `;
    }).join('');
}

function getStatus(avgScore, topicsAttempted) {
    if (topicsAttempted === 0) {
        return { class: 'needs-help', text: 'Not Started' };
    }

    if (avgScore >= 80) {
        return { class: 'excellent', text: 'Excellent' };
    } else if (avgScore >= 60) {
        return { class: 'good', text: 'Good' };
    } else if (avgScore >= 40) {
        return { class: 'needs-help', text: 'Needs Help' };
    } else {
        return { class: 'struggling', text: 'Struggling' };
    }
}

function filterStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#studentsTableBody tr');

    rows.forEach(row => {
        const studentName = row.getAttribute('data-student-name');
        if (studentName && studentName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ============= STUDENT DETAILS =============

async function viewStudent(studentId) {
    try {
        const response = await fetch(`${API_URL}/teacher/students/${studentId}/analytics`);
        const data = await response.json();

        if (data.success) {
            displayStudentDetails(data.analytics);
            document.getElementById('studentModal').classList.add('active');
        }
    } catch (error) {
        console.error('Error loading student details:', error);
    }
}

function displayStudentDetails(analytics) {
    const { student, stats, recentProgress, learningGaps, achievements } = analytics;

    // Basic info
    document.getElementById('modalStudentName').textContent = student.name;
    document.getElementById('modalGrade').textContent = `Grade ${student.grade}`;
    document.getElementById('modalLevel').textContent = student.current_level;
    document.getElementById('modalPoints').textContent = student.total_points;
    document.getElementById('modalStreak').textContent = `${student.streak_days} days 🔥`;

    // Topic stats
    const topicStatsContainer = document.getElementById('topicStats');
    if (stats.length === 0) {
        topicStatsContainer.innerHTML = '<div class="no-data">No activity yet</div>';
    } else {
        topicStatsContainer.innerHTML = stats.map(stat => {
            const scorePercent = Math.round(stat.avg_score * 100);
            const scoreClass = scorePercent >= 80 ? 'high' : scorePercent >= 60 ? 'medium' : 'low';

            return `
        <div class="topic-stat">
          <div>
            <div class="topic-name">${stat.topic}</div>
            <div class="topic-meta">${stat.attempts} attempts • Level ${stat.max_difficulty}</div>
          </div>
          <div class="topic-score ${scoreClass}">${scorePercent}%</div>
        </div>
      `;
        }).join('');
    }

    // Learning gaps
    const gapsContainer = document.getElementById('learningGaps');
    if (learningGaps.length === 0) {
        gapsContainer.innerHTML = '<div class="no-data">✅ No major learning gaps identified</div>';
    } else {
        gapsContainer.innerHTML = learningGaps.map(gap => {
            const severityClass = gap.severity === 'high' ? 'high-severity' : '';
            const scorePercent = Math.round(gap.avgScore * 100);

            return `
        <div class="gap-item ${severityClass}">
          <div class="gap-topic">⚠️ ${gap.topic}</div>
          <div class="gap-details">
            Average score: ${scorePercent}% over ${gap.attempts} attempts
            ${gap.severity === 'high' ? ' - Requires immediate attention' : ' - Needs practice'}
          </div>
        </div>
      `;
        }).join('');
    }

    // Recent progress
    const progressContainer = document.getElementById('recentProgress');
    if (recentProgress.length === 0) {
        progressContainer.innerHTML = '<div class="no-data">No recent activity</div>';
    } else {
        progressContainer.innerHTML = recentProgress.map(progress => {
            const date = new Date(progress.completed_at).toLocaleDateString();
            const scoreClass = progress.score === 1 ? 'correct' : 'incorrect';
            const scoreText = progress.score === 1 ? '✓ Correct' : '✗ Incorrect';

            return `
        <div class="activity-item">
          <div>
            <div class="activity-topic">${progress.topic}</div>
            <div class="activity-meta">${date} • Difficulty ${progress.difficulty}</div>
          </div>
          <div class="activity-score ${scoreClass}">${scoreText}</div>
        </div>
      `;
        }).join('');
    }

    // Achievements
    const achievementsContainer = document.getElementById('studentAchievements');
    if (achievements.length === 0) {
        achievementsContainer.innerHTML = '<div class="no-data">No badges earned yet</div>';
    } else {
        achievementsContainer.innerHTML = `
      <div class="badges-display">
        ${achievements.map(ach => `
          <div class="badge-item">🏅 ${ach.badge_name}</div>
        `).join('')}
      </div>
    `;
    }
}

function closeModal() {
    document.getElementById('studentModal').classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('studentModal');
    if (event.target === modal) {
        closeModal();
    }
}
