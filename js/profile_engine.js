/**
 * SpeakUP AI - Personal Space & Multi-Service Profile Engine
 * Centralizes authentication, cross-service activity tracking, streak calculation,
 * weakness action items, and real-time cloud persistence via Supabase PostgreSQL.
 */

const ProfileEngine = {
    profile: {
        userId: null,
        email: 'Guest',
        fullName: 'Learner',
        avatarUrl: '👨‍🎓',
        cefrLevel: 'B1',
        targetTrack: 'general',
        xpTotal: 100,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        serviceStats: {
            aiTutor: { sentencesSpoken: 0, durationMinutes: 0 },
            realPartner: { callsConnected: 0 },
            ieltsStudio: { mockTestsTaken: 0, bandScore: '6.5' },
            bcsViva: { vivaSessions: 0, readinessScore: '78%' },
            jobViva: { starPitchesBuilt: 0 },
            ipaLab: { soundsMastered: 0, totalSounds: 44 },
            quizTab: { quizzesCompleted: 0, avgScore: '85%' },
            vocabBankTab: { wordsMastered: 0 }
        },
        actionItems: [
            { id: 'act_1', title: 'Minimal Pairs: /v/ vs /b/ Sound Distinction', category: 'Phonetics Lab', completedDrills: 2, totalDrills: 5, serviceId: 'ipaLab' },
            { id: 'act_2', title: 'Syllable Stress Timing Drills', category: 'Phonetics Lab', completedDrills: 0, totalDrills: 5, serviceId: 'ipaLab' },
            { id: 'act_3', title: 'STAR Framework Pitch Structure', category: 'Job Viva', completedDrills: 1, totalDrills: 5, serviceId: 'jobViva' }
        ],
        recordingsVault: []
    },

    async init() {
        console.log("🚀 Initializing SpeakUP AI ProfileEngine...");
        this.loadLocalProfile();

        // Listen for Supabase user session
        if (typeof RealAuthEngine !== 'undefined' && RealAuthEngine.user) {
            await this.syncFromCloud(RealAuthEngine.user);
        }

        this.calculateStreak();
        this.renderPersonalSpaceUI();
    },

    loadLocalProfile() {
        try {
            const cached = localStorage.getItem('speakup_cloud_profile');
            if (cached) {
                const parsed = JSON.parse(cached);
                this.profile = { ...this.profile, ...parsed };
            }
        } catch(e) {
            console.warn("ProfileEngine local cache load note:", e);
        }
    },

    saveLocalProfile() {
        try {
            localStorage.setItem('speakup_cloud_profile', JSON.stringify(this.profile));
        } catch(e){}
    },

    calculateStreak() {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = this.profile.lastActiveDate;

        if (!lastActive) {
            this.profile.streakDays = 1;
            this.profile.lastActiveDate = today;
        } else if (lastActive !== today) {
            const prevDate = new Date();
            prevDate.setDate(prevDate.getDate() - 1);
            const yesterdayStr = prevDate.toISOString().split('T')[0];

            if (lastActive === yesterdayStr) {
                this.profile.streakDays = (this.profile.streakDays || 1) + 1;
            } else {
                this.profile.streakDays = 1; // Reset streak if missed more than 1 day
            }
            this.profile.lastActiveDate = today;
            this.saveLocalProfile();
        }
    },

    async syncFromCloud(user) {
        if (!user || typeof supabaseClient === 'undefined' || !supabaseClient) return;

        this.profile.userId = user.id;
        this.profile.email = user.email || 'Learner';
        this.profile.fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Learner";
        if (user.user_metadata?.avatar_url) this.profile.avatarUrl = user.user_metadata.avatar_url;

        try {
            // Fetch profile record from Postgres
            const { data, error } = await supabaseClient
                .from('users_profile')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data && !error) {
                this.profile.cefrLevel = data.cefr_level || this.profile.cefrLevel;
                this.profile.xpTotal = data.xp_total || this.profile.xpTotal;
                this.profile.streakDays = data.streak_days || this.profile.streakDays;
                this.profile.targetTrack = data.target_track || this.profile.targetTrack;
            } else {
                // First time sign in: Create initial row in Postgres
                await supabaseClient.from('users_profile').upsert({
                    user_id: user.id,
                    email: this.profile.email,
                    full_name: this.profile.fullName,
                    cefr_level: this.profile.cefrLevel,
                    xp_total: this.profile.xpTotal,
                    streak_days: this.profile.streakDays,
                    last_active_date: new Date().toISOString().split('T')[0]
                });
            }

            // Sync vocabulary & IPA progress counts
            if (typeof RealAuthEngine !== 'undefined') {
                const vocabData = await RealAuthEngine.loadProgressFromPostgres();
                if (vocabData) {
                    this.profile.serviceStats.vocabBankTab.wordsMastered = (vocabData.mastered_words || []).length;
                    if (vocabData.mastered_ipa_sounds) {
                        this.profile.serviceStats.ipaLab.soundsMastered = vocabData.mastered_ipa_sounds.length;
                    }
                }
            }
        } catch(e) {
            console.warn("Cloud profile sync note:", e);
        }

        this.saveLocalProfile();
        this.renderPersonalSpaceUI();
    },

    async recordActivity(serviceId, metrics = {}) {
        const xpGained = metrics.xpGained || 10;
        this.profile.xpTotal = (this.profile.xpTotal || 100) + xpGained;

        if (serviceId === 'aiTutor') {
            const stats = this.profile.serviceStats.aiTutor;
            stats.sentencesSpoken = (stats.sentencesSpoken || 0) + (metrics.sentences || 1);
            stats.durationMinutes = parseFloat(((stats.durationMinutes || 0) + 0.5).toFixed(1));
        } else if (serviceId === 'ipaLab') {
            if (metrics.soundMastered) {
                this.profile.serviceStats.ipaLab.soundsMastered = Math.min(44, (this.profile.serviceStats.ipaLab.soundsMastered || 0) + 1);
            }
        } else if (serviceId === 'quizTab') {
            this.profile.serviceStats.quizTab.quizzesCompleted = (this.profile.serviceStats.quizTab.quizzesCompleted || 0) + 1;
            if (metrics.score) this.profile.serviceStats.quizTab.avgScore = metrics.score + '%';
        } else if (serviceId === 'jobViva') {
            if (metrics.pitchBuilt) {
                this.profile.serviceStats.jobViva.starPitchesBuilt = (this.profile.serviceStats.jobViva.starPitchesBuilt || 0) + 1;
            }
        }

        this.saveLocalProfile();
        this.renderPersonalSpaceUI();

        // Async log to Supabase
        if (typeof supabaseClient !== 'undefined' && supabaseClient && this.profile.userId) {
            try {
                await supabaseClient.from('service_activity_logs').insert({
                    user_id: this.profile.userId,
                    service_id: serviceId,
                    session_duration_sec: metrics.durationSec || 60,
                    sentences_spoken: metrics.sentences || 1,
                    xp_gained: xpGained,
                    activity_metadata: metrics
                });

                await supabaseClient.from('users_profile').update({
                    xp_total: this.profile.xpTotal,
                    updated_at: new Date().toISOString()
                }).eq('user_id', this.profile.userId);
            } catch(e) {
                console.warn("Async log error:", e);
            }
        }
    },

    renderPersonalSpaceUI() {
        // Render Profile Hero Card Elements
        const userNameEl = document.getElementById('profileHeroName');
        const userEmailEl = document.getElementById('profileHeroEmail');
        const userAvatarEl = document.getElementById('profileHeroAvatar');
        const streakEl = document.getElementById('profileStreakBadge');
        const xpEl = document.getElementById('profileXpBadge');
        const levelEl = document.getElementById('profileCefrBadge');

        if (userNameEl) userNameEl.innerText = this.profile.fullName;
        if (userEmailEl) userEmailEl.innerText = this.profile.email;
        if (userAvatarEl) userAvatarEl.innerText = this.profile.fullName.charAt(0).toUpperCase();
        if (streakEl) streakEl.innerText = `🔥 ${this.profile.streakDays}-Day Streak`;
        if (xpEl) xpEl.innerText = `⭐ ${this.profile.xpTotal} XP`;
        if (levelEl) levelEl.innerText = `CEFR ${this.profile.cefrLevel}`;

        // Render Service Inter-Connected Matrix Numbers
        const aiStats = document.getElementById('psStatAiTutor');
        const ipaStats = document.getElementById('psStatIpaLab');
        const quizStats = document.getElementById('psStatQuiz');
        const jobStats = document.getElementById('psStatJobViva');
        const vocabStats = document.getElementById('psStatVocab');

        if (aiStats) aiStats.innerText = `${this.profile.serviceStats.aiTutor.sentencesSpoken} Sentences (${this.profile.serviceStats.aiTutor.durationMinutes} mins)`;
        if (ipaStats) ipaStats.innerText = `${this.profile.serviceStats.ipaLab.soundsMastered} / 44 Sounds Mastered`;
        if (quizStats) quizStats.innerText = `${this.profile.serviceStats.quizTab.quizzesCompleted} Quizzes (${this.profile.serviceStats.quizTab.avgScore} Avg)`;
        if (jobStats) jobStats.innerText = `${this.profile.serviceStats.jobViva.starPitchesBuilt} STAR Pitches Built`;
        if (vocabStats) vocabStats.innerText = `${this.profile.serviceStats.vocabBankTab.wordsMastered} Mastered Words`;

        // Render Action Items List
        const actionContainer = document.getElementById('profileActionItemsList');
        if (actionContainer && this.profile.actionItems) {
            actionContainer.innerHTML = this.profile.actionItems.map(item => `
                <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:10px 14px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="font-size:12px; color:#0F172A; display:block;">• ${item.title}</strong>
                        <span style="font-size:10px; color:#64748B;">Category: ${item.category}</span>
                    </div>
                    <button onclick="openServiceWorkspace('${item.serviceId}')" style="background:#E0F2FE; color:#0284C7; border:1px solid #0284C7; border-radius:8px; padding:4px 10px; font-size:10px; font-weight:800; cursor:pointer;">
                        [ ${item.completedDrills} / ${item.totalDrills} ] Practice ➔
                    </button>
                </div>
            `).join('');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ProfileEngine.init();
});
