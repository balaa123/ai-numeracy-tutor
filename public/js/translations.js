// Multilingual translations
const translations = {
    en: {
        points: 'Points',
        streak: 'Streak',
        level: 'Level',
        your_progress: 'Your Progress',
        addition: 'Addition',
        subtraction: 'Subtraction',
        multiplication: 'Multiplication',
        division: 'Division',
        practice: 'Practice',
        achievements: '🏅 Achievements',
        hint: 'Hint',
        check: 'Check',
        continue: 'Continue',
        great_job: 'Great Job!',
        correct: 'Correct',
        points_earned: 'Points Earned',
        new_badges: '🎉 New Badges Earned!',
        back_to_dashboard: 'Back to Dashboard',
        practice_again: 'Practice Again',
        excellent: 'Excellent!',
        correct_answer: 'Correct Answer!',
        oops: 'Oops!',
        not_quite: 'Not quite right',
        try_again: 'Try again!',
        keep_going: 'Keep going! 🎯'
    },
    hi: {
        points: 'अंक',
        streak: 'सिलसिला',
        level: 'स्तर',
        your_progress: 'आपकी प्रगति',
        addition: 'जोड़',
        subtraction: 'घटाव',
        multiplication: 'गुणा',
        division: 'भाग',
        practice: 'अभ्यास करें',
        achievements: '🏅 उपलब्धियां',
        hint: 'संकेत',
        check: 'जांचें',
        continue: 'जारी रखें',
        great_job: 'बहुत बढ़िया!',
        correct: 'सही',
        points_earned: 'अंक प्राप्त',
        new_badges: '🎉 नए बैज मिले!',
        back_to_dashboard: 'डैशबोर्ड पर वापस',
        practice_again: 'फिर से अभ्यास करें',
        excellent: 'उत्कृष्ट!',
        correct_answer: 'सही उत्तर!',
        oops: 'उफ़!',
        not_quite: 'बिल्कुल सही नहीं',
        try_again: 'फिर कोशिश करें!',
        keep_going: 'आगे बढ़ते रहो! 🎯'
    },
    ta: {
        points: 'புள்ளிகள்',
        streak: 'தொடர்ச்சி',
        level: 'நிலை',
        your_progress: 'உங்கள் முன்னேற்றம்',
        addition: 'கூட்டல்',
        subtraction: 'கழித்தல்',
        multiplication: 'பெருக்கல்',
        division: 'வகுத்தல்',
        practice: 'பயிற்சி',
        achievements: '🏅 சாதனைகள்',
        hint: 'குறிப்பு',
        check: 'சரிபார்க்கவும்',
        continue: 'தொடரவும்',
        great_job: 'மிக நன்று!',
        correct: 'சரியானது',
        points_earned: 'புள்ளிகள் பெற்றது',
        new_badges: '🎉 புதிய பேட்ஜ்கள் பெற்றது!',
        back_to_dashboard: 'டாஷ்போர்டுக்கு திரும்பு',
        practice_again: 'மீண்டும் பயிற்சி',
        excellent: 'சிறப்பு!',
        correct_answer: 'சரியான பதில்!',
        oops: 'அச்சச்சோ!',
        not_quite: 'முழுமையாக சரியல்ல',
        try_again: 'மீண்டும் முயற்சி செய்!',
        keep_going: 'தொடர்ந்து செல்லுங்கள்! 🎯'
    },
    te: {
        points: 'పాయింట్లు',
        streak: 'వరుస',
        level: 'స్థాయి',
        your_progress: 'మీ పురోగతి',
        addition: 'కూడిక',
        subtraction: 'తీసివేత',
        multiplication: 'గుణకారం',
        division: 'భాగహారం',
        practice: 'అభ్యాసం',
        achievements: '🏅 విజయాలు',
        hint: 'సూచన',
        check: 'తనిఖీ చేయండి',
        continue: 'కొనసాగించు',
        great_job: 'చాలా బాగుంది!',
        correct: 'సరైనది',
        points_earned: 'పాయింట్లు సంపాదించారు',
        new_badges: '🎉 కొత్త బ్యాడ్జ్‌లు సంపాదించారు!',
        back_to_dashboard: 'డ్యాష్‌బోర్డ్‌కు తిరిగి',
        practice_again: 'మళ్లీ అభ్యసించండి',
        excellent: 'అద్భుతం!',
        correct_answer: 'సరైన సమాధానం!',
        oops: 'అయ్యో!',
        not_quite: 'పూర్తిగా సరైనది కాదు',
        try_again: 'మళ్లీ ప్రయత్నించండి!',
        keep_going: 'కొనసాగండి! 🎯'
    }
};

// Apply translations
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// Export for use in other scripts
window.translations = translations;
window.applyTranslations = applyTranslations;
