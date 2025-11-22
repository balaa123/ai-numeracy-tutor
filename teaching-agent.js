const { GoogleGenerativeAI } = require('@google/generative-ai');
const { CohereClient } = require('cohere-ai');
require('dotenv').config();

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

/**
 * AI Teaching Agent - Orchestrates learning between students and teachers
 * Uses Gemini as the intelligent coordinator
 */
class TeachingAgent {
    constructor() {
        this.agentModel = genAI.getGenerativeModel({
            model: 'gemini-pro',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
            }
        });
    }

    /**
     * Analyze student performance and generate insights
     */
    async analyzeStudentPerformance(studentData, progressHistory) {
        const prompt = `You are an AI Teaching Assistant analyzing student performance.

Student Profile:
- Name: ${studentData.name}
- Grade: ${studentData.grade}
- Current Level: ${studentData.current_level}
- Total Points: ${studentData.total_points}
- Language: ${studentData.language}

Recent Performance:
${progressHistory.slice(0, 10).map(p =>
            `- ${p.topic} (Difficulty ${p.difficulty}): ${p.score === 1 ? 'Correct' : 'Incorrect'}`
        ).join('\n')}

Analyze this student's performance and provide:
1. Strengths (topics they excel at)
2. Weaknesses (topics needing improvement)
3. Recommended next steps
4. Learning pace assessment
5. Motivation level (based on engagement patterns)

Return as JSON:
{
  "strengths": ["topic1", "topic2"],
  "weaknesses": ["topic1"],
  "recommendations": ["action1", "action2"],
  "pace": "slow/moderate/fast",
  "motivationLevel": "low/medium/high",
  "teacherAlert": true/false,
  "alertReason": "reason if alert is true"
}`;

        try {
            const result = await this.agentModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // Fallback analysis
            return this.fallbackAnalysis(progressHistory);
        } catch (error) {
            console.error('Agent analysis error:', error);
            return this.fallbackAnalysis(progressHistory);
        }
    }

    /**
     * Generate personalized learning path for student
     */
    async generateLearningPath(studentData, analysis) {
        const prompt = `You are an AI Teaching Assistant creating a personalized learning path.

Student: ${studentData.name} (Grade ${studentData.grade}, Level ${studentData.current_level})

Current Analysis:
- Strengths: ${analysis.strengths.join(', ')}
- Weaknesses: ${analysis.weaknesses.join(', ')}
- Pace: ${analysis.pace}

Create a 5-step learning path for the next week. Each step should:
- Build on strengths
- Address weaknesses gradually
- Match the student's pace
- Include specific topics and difficulty levels

Return as JSON array:
[
  {
    "day": 1,
    "topic": "addition",
    "difficulty": 2,
    "focus": "Build confidence",
    "estimatedTime": "15 minutes"
  },
  ...
]`;

        try {
            const result = await this.agentModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return this.fallbackLearningPath(analysis);
        } catch (error) {
            console.error('Learning path generation error:', error);
            return this.fallbackLearningPath(analysis);
        }
    }

    /**
     * Generate teacher insights and action items
     */
    async generateTeacherInsights(studentsData) {
        const prompt = `You are an AI Teaching Assistant helping a teacher manage a classroom.

Class Overview:
- Total Students: ${studentsData.length}
- Students Summary:
${studentsData.map(s =>
            `  * ${s.name}: Level ${s.current_level}, ${s.total_points} points, Avg Score: ${s.avg_score ? Math.round(s.avg_score * 100) : 0}%`
        ).slice(0, 10).join('\n')}

Analyze the class and provide:
1. Students who need immediate attention
2. Top performers to recognize
3. Common struggles across the class
4. Recommended class-wide interventions
5. Individual student action items

Return as JSON:
{
  "immediateAttention": [{"studentId": 1, "reason": "struggling with subtraction"}],
  "topPerformers": [{"studentId": 2, "achievement": "mastered all topics"}],
  "classWideIssues": ["Many students struggle with word problems"],
  "recommendations": ["action1", "action2"],
  "actionItems": [{"studentId": 1, "action": "one-on-one session"}]
}`;

        try {
            const result = await this.agentModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return this.fallbackTeacherInsights(studentsData);
        } catch (error) {
            console.error('Teacher insights error:', error);
            return this.fallbackTeacherInsights(studentsData);
        }
    }

    /**
     * Agent decides what questions to give student next
     */
    async selectNextQuestions(studentData, analysis, availableQuestions) {
        const prompt = `You are an AI Teaching Assistant selecting questions for a student.

Student: ${studentData.name} (Level ${studentData.current_level})
Strengths: ${analysis.strengths.join(', ')}
Weaknesses: ${analysis.weaknesses.join(', ')}
Pace: ${analysis.pace}

Available Question Topics: addition, subtraction, multiplication, division
Difficulty Levels: 1 (easy), 2 (medium), 3 (hard)

Select 5 questions that:
- Start with confidence-building (strengths)
- Gradually introduce weaknesses
- Match the student's pace
- End with a challenge

Return as JSON array:
[
  {"topic": "addition", "difficulty": 2, "reason": "confidence builder"},
  ...
]`;

        try {
            const result = await this.agentModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const selections = JSON.parse(jsonMatch[0]);
                // Map to actual questions
                return selections.map(sel => {
                    const matching = availableQuestions.filter(
                        q => q.topic === sel.topic && q.difficulty === sel.difficulty
                    );
                    return matching[Math.floor(Math.random() * matching.length)];
                }).filter(q => q);
            }

            return availableQuestions.slice(0, 5);
        } catch (error) {
            console.error('Question selection error:', error);
            return availableQuestions.slice(0, 5);
        }
    }

    /**
     * Agent provides real-time coaching to student
     */
    async provideStudentCoaching(studentData, currentQuestion, previousAnswers, language = 'en') {
        const prompt = `You are an encouraging AI tutor helping a student.

Student: ${studentData.name} (Grade ${studentData.grade})
Current Question: ${currentQuestion.topic} - Difficulty ${currentQuestion.difficulty}
Previous Answers: ${previousAnswers.map(a => a.is_correct ? '✓' : '✗').join(' ')}
Language: ${language}

Provide a brief, encouraging message (2-3 sentences) in ${language === 'en' ? 'English' : language} to:
- Acknowledge their effort
- Boost confidence
- Encourage them to try the current question

Keep it friendly and age-appropriate for Grade ${studentData.grade}.`;

        try {
            const result = await this.agentModel.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Coaching error:', error);
            return this.fallbackCoaching(language);
        }
    }

    /**
     * Agent communicates with teacher about student progress
     */
    async generateTeacherAlert(studentData, issue) {
        const prompt = `You are an AI Teaching Assistant alerting a teacher.

Student: ${studentData.name} (Grade ${studentData.grade})
Issue: ${issue}

Write a brief, professional alert message (3-4 sentences) for the teacher that:
1. Describes the issue clearly
2. Provides context (student's usual performance)
3. Suggests immediate action
4. Remains encouraging about the student

Keep it concise and actionable.`;

        try {
            const result = await this.agentModel.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Teacher alert error:', error);
            return `${studentData.name} needs attention: ${issue}. Please check their progress.`;
        }
    }

    /**
     * Fallback methods when AI calls fail
     */
    fallbackAnalysis(progressHistory) {
        const recentScores = progressHistory.slice(0, 5).map(p => p.score);
        const avgScore = recentScores.reduce((a, b) => a + b, 0) / Math.max(recentScores.length, 1);

        return {
            strengths: ['addition'],
            weaknesses: avgScore < 0.6 ? ['subtraction', 'division'] : [],
            recommendations: ['Practice regularly', 'Review basics'],
            pace: avgScore >= 0.8 ? 'fast' : avgScore >= 0.6 ? 'moderate' : 'slow',
            motivationLevel: recentScores.length >= 5 ? 'high' : 'medium',
            teacherAlert: avgScore < 0.4,
            alertReason: avgScore < 0.4 ? 'Student struggling with recent questions' : null
        };
    }

    fallbackLearningPath(analysis) {
        return [
            { day: 1, topic: 'addition', difficulty: 1, focus: 'Review basics', estimatedTime: '15 minutes' },
            { day: 2, topic: 'addition', difficulty: 2, focus: 'Build confidence', estimatedTime: '15 minutes' },
            { day: 3, topic: 'subtraction', difficulty: 1, focus: 'Introduction', estimatedTime: '15 minutes' },
            { day: 4, topic: 'subtraction', difficulty: 2, focus: 'Practice', estimatedTime: '15 minutes' },
            { day: 5, topic: 'multiplication', difficulty: 1, focus: 'New concept', estimatedTime: '15 minutes' }
        ];
    }

    fallbackTeacherInsights(studentsData) {
        const struggling = studentsData.filter(s => s.avg_score && s.avg_score < 0.6);
        const topPerformers = studentsData.filter(s => s.avg_score && s.avg_score >= 0.8);

        return {
            immediateAttention: struggling.map(s => ({
                studentId: s.id,
                reason: 'Below 60% average score'
            })),
            topPerformers: topPerformers.map(s => ({
                studentId: s.id,
                achievement: 'Maintaining high performance'
            })),
            classWideIssues: ['Monitor engagement levels'],
            recommendations: ['Continue current teaching approach'],
            actionItems: struggling.map(s => ({
                studentId: s.id,
                action: 'Schedule review session'
            }))
        };
    }

    fallbackCoaching(language) {
        const messages = {
            en: "You're doing great! Keep up the good work and try your best on this question.",
            hi: "आप बहुत अच्छा कर रहे हैं! अच्छा काम जारी रखें और इस प्रश्न पर अपना सर्वश्रेष्ठ प्रयास करें।",
            ta: "நீங்கள் நன்றாக செய்கிறீர்கள்! நல்ல வேலையைத் தொடர்ந்து இந்த கேள்வியில் உங்கள் சிறந்த முயற்சியை செய்யுங்கள்.",
            te: "మీరు చాలా బాగా చేస్తున్నారు! మంచి పనిని కొనసాగించండి మరియు ఈ ప్రశ్నపై మీ ఉత్తమ ప్రయత్నం చేయండి."
        };
        return messages[language] || messages.en;
    }
}

module.exports = new TeachingAgent();
