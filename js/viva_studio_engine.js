/**
 * SpeakUP AI - Unified Job Viva Prep Studio Engine
 * Merges BCS Cadre Viva, Bank Officer Viva, Corporate HR Interviews, and STAR Pitch Builder
 * into a single, dedicated executive workspace.
 */

const VivaStudioEngine = {
    activeTrack: 'bcs', // bcs, bank, corporate, star

    tracks: {
        bcs: {
            title: 'BCS Cadre Viva Board',
            subtitle: '1971 Liberation War History, Constitution, & PSC Chairman Pitch',
            badgeColor: '#059669',
            questions: [
                '"Explain the historical significance of 7th March 1971 speech in international diplomacy."',
                '"What are the fundamental principles of the Constitution of Bangladesh?"',
                '"Why should the PSC board select you over other candidates for your top cadre choice?"'
            ]
        },
        bank: {
            title: 'Bank Officer Viva Board',
            subtitle: 'Commercial Banking Scenarios, Financial Terms, & STAR Framework',
            badgeColor: '#7C3AED',
            questions: [
                '"Tell me about a time you solved a complex financial problem under a tight deadline."',
                '"What is the difference between Monetary Policy and Fiscal Policy in Bangladesh economy?"',
                '"How would you handle a disgruntled bank client at the front desk professionally?"'
            ]
        },
        corporate: {
            title: 'Corporate & HR Interview',
            subtitle: '60-Second Resume Walkthrough, Leadership, & Behavioral HR Scenarios',
            badgeColor: '#2563EB',
            questions: [
                '"Walk me through your resume in 60 seconds highlighting key technical & leadership achievements."',
                '"Describe a situation where you managed conflict within a cross-functional project team."',
                '"Where do you see your career in 3 to 5 years in our organization?"'
            ]
        },
        star: {
            title: 'STAR Pitch Builder & Salary Negotiation',
            subtitle: '90-Second Structured Model Answer Generator with Audio Playback',
            badgeColor: '#D97706',
            questions: [
                '"What are your salary expectations for this Senior Officer / Manager position?"',
                '"Pitch your top 3 core strengths using the Situation, Task, Action, Result framework."'
            ]
        }
    },

    setTrack(trackKey) {
        if (!this.tracks[trackKey]) return;
        this.activeTrack = trackKey;
        const config = this.tracks[trackKey];

        // Update UI headers
        const titleEl = document.getElementById('vivaWorkspaceTitle');
        const subEl = document.getElementById('vivaWorkspaceSub');
        const qEl = document.getElementById('vivaQuestionText');

        if (titleEl) titleEl.innerText = config.title;
        if (subEl) subEl.innerText = config.subtitle;
        if (qEl) qEl.innerText = config.questions[0];

        // Highlight active track pill
        document.querySelectorAll('.viva-track-btn').forEach(btn => {
            btn.style.background = '#F1F5F9';
            btn.style.color = '#475569';
            btn.style.borderColor = '#CBD5E1';
        });

        const activeBtn = document.getElementById(`vivaBtn_${trackKey}`);
        if (activeBtn) {
            activeBtn.style.background = config.badgeColor;
            activeBtn.style.color = '#FFFFFF';
            activeBtn.style.borderColor = config.badgeColor;
        }

        // Show/hide STAR pitch form if star track selected
        const starForm = document.getElementById('vivaStarPitchForm');
        if (starForm) starForm.style.display = (trackKey === 'star' ? 'block' : 'none');
    },

    nextQuestion() {
        const config = this.tracks[this.activeTrack];
        const qEl = document.getElementById('vivaQuestionText');
        if (qEl && config) {
            const randomQ = config.questions[Math.floor(Math.random() * config.questions.length)];
            qEl.innerText = randomQ;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    VivaStudioEngine.setTrack('bcs');
});
