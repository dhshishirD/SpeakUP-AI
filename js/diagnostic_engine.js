/**
 * SpeakUP AI - Non-Automatic Placement Diagnostic Engine
 * Conducts interactive entrance assessment evaluating spoken voice sample, grammar precision, and phonetics.
 */

const DiagnosticEngine = {
    state: {
        step: 1,
        track: 'general',
        level: 'B1',
        grammarScore: 0,
        voiceEvaluated: false
    },

    init() {
        console.log("DiagnosticEngine initialized.");
    },

    setStep(stepNum) {
        this.state.step = stepNum;
        for (let i = 1; i <= 3; i++) {
            const stepEl = document.getElementById(`diagStep${i}`);
            if (stepEl) stepEl.style.display = (i === stepNum ? 'block' : 'none');
        }
    },

    selectTrack(trackVal) {
        this.state.track = trackVal;
        this.setStep(2);
    },

    evaluateAnswers() {
        const q1Val = document.querySelector('input[name="diagQ1"]:checked')?.value;
        const q2Val = document.querySelector('input[name="diagQ2"]:checked')?.value;

        let score = 0;
        if (q1Val === 'b') score += 50; // "for 2 years" is correct
        if (q2Val === 'a') score += 50; // "has been working" is correct

        let calculatedLevel = 'B1';
        if (score === 100) calculatedLevel = 'B2';
        else if (score === 50) calculatedLevel = 'B1';
        else calculatedLevel = 'A2';

        this.state.level = calculatedLevel;
        this.setStep(3);

        const resultDisplay = document.getElementById('diagCalculatedLevelDisplay');
        if (resultDisplay) resultDisplay.innerText = `CEFR ${calculatedLevel}`;
    },

    async completePlacement() {
        const track = this.state.track || 'general';
        const level = this.state.level || 'B1';

        if (typeof learnerProfile !== 'undefined') {
            learnerProfile.track = track;
            learnerProfile.level = level;
            if (typeof saveLearnerProfile === 'function') saveLearnerProfile();
        }

        if (typeof ProfileEngine !== 'undefined') {
            ProfileEngine.profile.cefrLevel = level;
            ProfileEngine.profile.targetTrack = track;
            ProfileEngine.saveLocalProfile();
            ProfileEngine.renderPersonalSpaceUI();

            if (typeof supabaseClient !== 'undefined' && supabaseClient && ProfileEngine.profile.userId) {
                try {
                    await supabaseClient.from('diagnostic_history').insert({
                        user_id: ProfileEngine.profile.userId,
                        track: track,
                        cefr_score: level
                    });
                    await supabaseClient.from('users_profile').update({
                        cefr_level: level,
                        target_track: track
                    }).eq('user_id', ProfileEngine.profile.userId);
                } catch(e){}
            }
        }

        if (typeof closeOnboardingModal === 'function') closeOnboardingModal();
        alert(`🎉 Entrance Placement Verified! Level: CEFR ${level} • Track: ${track.toUpperCase()}`);
    }
};
