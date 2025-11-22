const { CohereClient } = require('cohere-ai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize AI clients
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Multilingual translations for AI prompts
const translations = {
    en: {
        explain: 'Explain this to a student',
        hint: 'Give a hint',
        encouragement: 'Great job!',
    },
    hi: {
        explain: 'एक छात्र को यह समझाएं',
        hint: 'एक संकेत दें',
        encouragement: 'बहुत अच्छा!',
    },
    ta: {
        explain: 'ஒரு மாணவருக்கு இதை விளக்குங்கள்',
        hint: 'ஒரு குறிப்பு கொடுங்கள்',
        encouragement: 'மிக நன்று!',
    },
    te: {
        explain: 'ఒక విద్యార్థికి దీన్ని వివరించండి',
        hint: 'ఒక సూచన ఇవ్వండి',
        encouragement: 'చాలా బాగుంది!',
    }
};

class AIEngine {
    /**
     * Generate personalized explanation using Cohere
     * @param {Object} question - Question object
     * @param {string} studentAnswer - Student's answer
     * @param {string} correctAnswer - Correct answer
     * @param {string} language - Language code (en, hi, ta, te)
     */
    async generateExplanation(question, studentAnswer, correctAnswer, language = 'en') {
        try {
            const questionData = JSON.parse(question.question_data);
            let questionText = '';

            if (question.question_type === 'select') {
                if (question.topic === 'addition') {
                    questionText = `${questionData.num1} + ${questionData.num2}`;
                } else if (question.topic === 'subtraction') {
                    questionText = `${questionData.num1} - ${questionData.num2}`;
                } else if (question.topic === 'multiplication') {
                    questionText = `${questionData.num1} × ${questionData.num2}`;
                } else if (question.topic === 'division') {
                    questionText = `${questionData.num1} ÷ ${questionData.num2}`;
                }
            } else if (question.question_type === 'input') {
                questionText = questionData.text;
            }

            const languageNames = {
                en: 'English',
                hi: 'Hindi',
                ta: 'Tamil',
                te: 'Telugu'
            };

            const prompt = `You are a friendly math tutor for elementary school students. 
Question: ${questionText}
Student's Answer: ${studentAnswer}
Correct Answer: ${correctAnswer}

Provide a brief, encouraging explanation in ${languageNames[language]} (2-3 sentences) explaining why the correct answer is ${correctAnswer}. 
Be very simple and friendly. Use analogies with everyday objects like fruits, toys, or candies.
Keep it SHORT and encouraging.`;

            const response = await cohere.generate({
                prompt: prompt,
                maxTokens: 150,
                temperature: 0.7,
            });

            return response.generations[0].text.trim();
        } catch (error) {
            console.error('Cohere API error:', error);
            return this.getFallbackExplanation(question, correctAnswer, language);
        }
    }

    /**
     * Get a hint using Cohere
     */
    async generateHint(question, language = 'en') {
        try {
            const questionData = JSON.parse(question.question_data);
            let questionText = '';

            if (question.topic === 'addition') {
                questionText = `${questionData.num1} + ${questionData.num2}`;
            } else if (question.topic === 'subtraction') {
                questionText = `${questionData.num1} - ${questionData.num2}`;
            } else if (question.topic === 'multiplication') {
                questionText = `${questionData.num1} × ${questionData.num2}`;
            } else if (question.topic === 'division') {
                questionText = `${questionData.num1} ÷ ${questionData.num2}`;
            }

            const languageNames = {
                en: 'English',
                hi: 'Hindi',
                ta: 'Tamil',
                te: 'Telugu'
            };

            const prompt = `Give a very simple hint in ${languageNames[language]} for this math problem: ${questionText}
The hint should help a young student think about the problem without giving away the answer.
Keep it to 1-2 sentences.`;

            const response = await cohere.generate({
                prompt: prompt,
                maxTokens: 100,
                temperature: 0.8,
            });

            return response.generations[0].text.trim();
        } catch (error) {
            console.error('Cohere API error:', error);
            return this.getFallbackHint(question, language);
        }
    }

    /**
     * Generate new questions using Gemini
     */
    async generateQuestion(topic, difficulty, language = 'en') {
        try {
            const topicExamples = {
                addition: 'addition problems like 5 + 3',
                subtraction: 'subtraction problems like 8 - 2',
                multiplication: 'multiplication problems like 4 × 5',
                division: 'division problems like 10 ÷ 2',
                word_problem: 'simple word problems involving basic math'
            };

            const difficultyGuide = {
                1: 'very easy, single digit numbers (1-10)',
                2: 'medium, numbers up to 20',
                3: 'harder, numbers up to 50 and multi-step problems'
            };

            const prompt = `Generate a ${topicExamples[topic]} with ${difficultyGuide[difficulty]}.
Return ONLY a JSON object with this structure:
{
  "num1": <first number>,
  "num2": <second number>,
  "options": [correct_answer, wrong1, wrong2, wrong3],
  "correct_answer": <the correct answer>
}

Make sure options are shuffled and the wrong answers are believable but clearly wrong.`;

            const result = await geminiModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const questionData = JSON.parse(jsonMatch[0]);
                return {
                    topic,
                    difficulty,
                    question_type: 'select',
                    question_data: JSON.stringify({
                        num1: questionData.num1,
                        num2: questionData.num2,
                        options: questionData.options
                    }),
                    correct_answer: String(questionData.correct_answer)
                };
            }

            throw new Error('Could not parse Gemini response');
        } catch (error) {
            console.error('Gemini API error:', error);
            return this.generateFallbackQuestion(topic, difficulty);
        }
    }

    /**
     * Analyze student performance and suggest next difficulty
     */
    analyzePerformance(recentScores) {
        if (recentScores.length < 3) {
            return { difficulty: 1, confidence: 'building' };
        }

        const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

        if (avgScore >= 0.8) {
            return { difficulty: 'increase', confidence: 'high', message: 'Ready for harder questions!' };
        } else if (avgScore >= 0.6) {
            return { difficulty: 'maintain', confidence: 'good', message: 'Keep practicing!' };
        } else {
            return { difficulty: 'decrease', confidence: 'needs_practice', message: 'Let\'s review the basics' };
        }
    }

    /**
     * Check if student earned a badge
     */
    checkBadges(studentData, recentProgress) {
        const badges = [];

        // First correct answer
        if (studentData.total_points === 10) {
            badges.push({ type: 'first_correct', name: 'First Step' });
        }

        // 50 points milestone
        if (studentData.total_points >= 50 && studentData.total_points < 60) {
            badges.push({ type: 'points_50', name: 'Math Explorer' });
        }

        // 100 points milestone
        if (studentData.total_points >= 100 && studentData.total_points < 110) {
            badges.push({ type: 'points_100', name: 'Math Champion' });
        }

        // Perfect streak of 5
        const lastFive = recentProgress.slice(0, 5);
        if (lastFive.length === 5 && lastFive.every(p => p.score === 1)) {
            badges.push({ type: 'perfect_streak', name: 'Perfect Five' });
        }

        return badges;
    }

    /**
     * Fallback explanation when API fails
     */
    getFallbackExplanation(question, correctAnswer, language) {
        const explanations = {
            en: `The correct answer is ${correctAnswer}. Let's break it down step by step!`,
            hi: `सही उत्तर ${correctAnswer} है। आइए इसे चरण दर चरण समझें!`,
            ta: `சரியான பதில் ${correctAnswer}. படிப்படியாக புரிந்து கொள்வோம்!`,
            te: `సరైన సమాధానం ${correctAnswer}. దశలవారీగా అర్థం చేసుకుందాం!`
        };
        return explanations[language] || explanations.en;
    }

    /**
     * Fallback hint when API fails
     */
    getFallbackHint(question, language) {
        const hints = {
            en: 'Think carefully about the numbers. You can do it!',
            hi: 'संख्याओं के बारे में ध्यान से सोचें। आप कर सकते हैं!',
            ta: 'எண்களைப் பற்றி கவனமாக சிந்தியுங்கள். உங்களால் முடியும்!',
            te: 'సంఖ్యల గురించి జాగ్రత్తగా ఆలోచించండి. మీరు చేయగలరు!'
        };
        return hints[language] || hints.en;
    }

    /**
     * Generate fallback question when Gemini fails
     */
    generateFallbackQuestion(topic, difficulty) {
        const max = difficulty === 1 ? 10 : difficulty === 2 ? 20 : 50;
        const num1 = Math.floor(Math.random() * max) + 1;
        const num2 = Math.floor(Math.random() * max) + 1;

        let correctAnswer;
        if (topic === 'addition') {
            correctAnswer = num1 + num2;
        } else if (topic === 'subtraction') {
            correctAnswer = Math.max(num1, num2) - Math.min(num1, num2);
        } else if (topic === 'multiplication') {
            correctAnswer = num1 * num2;
        } else if (topic === 'division') {
            correctAnswer = Math.floor(num1 / Math.max(num2, 1));
        }

        const options = [
            correctAnswer,
            correctAnswer + 1,
            correctAnswer - 1,
            correctAnswer + 2
        ].sort(() => Math.random() - 0.5);

        return {
            topic,
            difficulty,
            question_type: 'select',
            question_data: JSON.stringify({ num1, num2, options }),
            correct_answer: String(correctAnswer)
        };
    }
}

module.exports = new AIEngine();
