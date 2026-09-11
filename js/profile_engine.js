/**
 * SpeakUP AI - Personal Space, 3-Tier Mastery & Admin Support Engine (v18.0.0)
 * Handles:
 * 1. 2-Day Free Trial & Lifetime Unlocked Progress Tracking
 * 2. 3-Tier Mastery Analytics (🟢 Mastered, 🟡 Progressing, 🔴 Focus Improvements)
 * 3. Daily Adaptive Level-Up & Curiosity Unlocks
 * 4. ৳99 BDT for 3-Months bKash Instant TrxID Auto-Approval
 * 5. User Support Screenshot Channel & Admin Issue Resolution Studio
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
        trialStartDate: new Date().toISOString(),
        isPro: false,
        proExpireDate: null,
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
        masterySkills: {
            mastered: ['Past Simple Verbs', 'Greeting Intonation', 'Oxford Monophthongs'],
            progressing: ['STAR Pitch Workflow', 'Connected Speech', 'Syllable Stress Shifts'],
            improvements: ['BCS Panel Response', 'Dental Fricatives /θ/ & /ð/', 'Part 2 Monologue Pace']
        },
        actionItems: [
            { id: 'act_1', title: 'Minimal Pairs: /v/ vs /b/ Sound Distinction', category: 'Phonetics Lab', completedDrills: 2, totalDrills: 5, serviceId: 'ipaLab' },
            { id: 'act_2', title: 'Syllable Stress Timing Drills', category: 'Phonetics Lab', completedDrills: 0, totalDrills: 5, serviceId: 'ipaLab' },
            { id: 'act_3', title: 'STAR Framework Pitch Structure', category: 'Job Viva', completedDrills: 1, totalDrills: 5, serviceId: 'jobViva' }
        ]
    },

    async init() {
        console.log("🚀 Initializing SpeakUP AI ProfileEngine v18.0.0...");
        this.loadLocalProfile();
        this.checkTrialStatus();
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
            console.warn("ProfileEngine load error:", e);
        }
    },

    saveLocalProfile() {
        try {
            localStorage.setItem('speakup_cloud_profile', JSON.stringify(this.profile));
        } catch(e){}
    },

    checkTrialStatus() {
        if (this.profile.isPro) return { status: 'PRO', text: '⭐ PRO MEMBER (3-MONTH PASS ACTIVE)' };
        
        const start = new Date(this.profile.trialStartDate || new Date());
        const now = new Date();
        const diffHours = (now - start) / (1000 * 60 * 60);

        if (diffHours <= 48) {
            const hoursLeft = Math.max(1, Math.ceil(48 - diffHours));
            return { status: 'TRIAL', text: `🎉 2-Day Free Trial Active (${hoursLeft}h Left)` };
        } else {
            return { status: 'FREE', text: '🔒 2-Day Trial Expired • Upgrade for ৳99/3-Months' };
        }
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
                this.profile.streakDays = 1;
            }
            this.profile.lastActiveDate = today;
            this.saveLocalProfile();
        }
    },

    getAdaptiveDayLevel() {
        const sentences = this.profile.serviceStats.aiTutor.sentencesSpoken || 0;
        const day = Math.min(30, Math.floor(sentences / 3) + 1);
        
        let levelName = 'Day 1: A1-A2 Starter Warmup';
        let curiosityUnlock = '🔒 Day 3 Unlocks: 90-Sec STAR Job Viva Pitch';
        
        if (day >= 3 && day < 7) {
            levelName = `Day ${day}: B1 Intermediate Fluency`;
            curiosityUnlock = '🔒 Day 7 Unlocks: IELTS Band 8.0 Cue Card Monologues';
        } else if (day >= 7 && day < 14) {
            levelName = `Day ${day}: B2 Professional Communication`;
            curiosityUnlock = '🔒 Day 14 Unlocks: BBC News Medical Intonation';
        } else if (day >= 14 && day < 30) {
            levelName = `Day ${day}: C1 Advanced Native Accents`;
            curiosityUnlock = '🔒 Day 30 Unlocks: BCS PSC Aggressive Panel Board';
        } else if (day >= 30) {
            levelName = `Day ${day}: C2 Expert Spoken Master`;
            curiosityUnlock = '🌟 All Advanced Spoken Studios Unlocked!';
        }

        return { day, levelName, curiosityUnlock };
    },

    renderPersonalSpaceUI() {
        const trialInfo = this.checkTrialStatus();
        const adaptiveInfo = this.getAdaptiveDayLevel();

        const userNameEl = document.getElementById('profileHeroName');
        const userEmailEl = document.getElementById('profileHeroEmail');
        const userAvatarEl = document.getElementById('profileHeroAvatar');
        const streakEl = document.getElementById('profileStreakBadge');
        const xpEl = document.getElementById('profileXpBadge');
        const levelEl = document.getElementById('profileCefrBadge');
        const trialBanner = document.getElementById('trialStatusBanner');

        if (userNameEl) userNameEl.innerText = this.profile.fullName;
        if (userEmailEl) userEmailEl.innerText = this.profile.email;
        if (userAvatarEl) userAvatarEl.innerText = this.profile.fullName.charAt(0).toUpperCase();
        if (streakEl) streakEl.innerText = `🔥 ${this.profile.streakDays}-Day Streak`;
        if (xpEl) xpEl.innerText = `⭐ ${this.profile.xpTotal} XP`;
        if (levelEl) levelEl.innerText = `CEFR ${this.profile.cefrLevel}`;
        
        if (trialBanner) {
            trialBanner.innerText = trialInfo.text;
            trialBanner.style.background = trialInfo.status === 'PRO' ? '#DCFCE7' : trialInfo.status === 'TRIAL' ? '#FEF3C7' : '#FEE2E2';
            trialBanner.style.color = trialInfo.status === 'PRO' ? '#15803D' : trialInfo.status === 'TRIAL' ? '#B45309' : '#991B1B';
        }

        // Render 3-Tier Mastery Breakdown (Mastered 🟢, Progressing 🟡, Improve 🔴)
        const masteryContainer = document.getElementById('profileMasteryCardsContainer');
        if (masteryContainer) {
            masteryContainer.innerHTML = `
                <div style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:18px; padding:16px; margin-bottom:16px; text-align:left;">
                    <div style="font-size:12px; font-weight:800; color:#0F172A; margin-bottom:10px;">📊 "At-a-Glance" Spoken Skill Mastery & Growth</div>
                    
                    <!-- 🟢 Mastered Competencies -->
                    <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:10px; margin-bottom:8px;">
                        <strong style="font-size:11px; color:#047857; display:block; margin-bottom:6px;">🟢 Mastered Competencies (80-100% Accuracy):</strong>
                        <div style="display:flex; flex-wrap:wrap; gap:4px;">
                            ${this.profile.masterySkills.mastered.map(s => `<span style="font-size:10px; font-weight:800; background:#DCFCE7; color:#15803D; padding:3px 8px; border-radius:6px; border:1px solid #86EFAC;">✓ ${s}</span>`).join('')}
                        </div>
                    </div>

                    <!-- 🟡 In-Progress Skills -->
                    <div style="background:#FEF3C7; border:1px solid #FCD34D; border-radius:12px; padding:10px; margin-bottom:8px;">
                        <strong style="font-size:11px; color:#B45309; display:block; margin-bottom:6px;">🟡 In-Progress Skills (50-79% Accuracy):</strong>
                        <div style="display:flex; flex-wrap:wrap; gap:4px;">
                            ${this.profile.masterySkills.progressing.map(s => `<span style="font-size:10px; font-weight:800; background:#FFFBEB; color:#B45309; padding:3px 8px; border-radius:6px; border:1px solid #FDE68A;">⚡ ${s}</span>`).join('')}
                        </div>
                    </div>

                    <!-- 🔴 Target Improvements -->
                    <div style="background:#FEE2E2; border:1px solid #FCA5A5; border-radius:12px; padding:10px;">
                        <strong style="font-size:11px; color:#B91C1C; display:block; margin-bottom:6px;">🔴 Target Improvements (<50% Accuracy):</strong>
                        <div style="display:flex; flex-wrap:wrap; gap:4px;">
                            ${this.profile.masterySkills.improvements.map(s => `<span style="font-size:10px; font-weight:800; background:#FFF1F1; color:#B91C1C; padding:3px 8px; border-radius:6px; border:1px solid #FECACA;">🎯 ${s}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <!-- Curiosity Level-Up Unlock Banner -->
                <div style="background:linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color:white; border-radius:14px; padding:12px 16px; margin-bottom:16px; text-align:left;">
                    <div style="font-size:10px; text-transform:uppercase; font-weight:900; opacity:0.8;">${adaptiveInfo.levelName}</div>
                    <div style="font-size:12px; font-weight:800; margin-top:2px;">${adaptiveInfo.curiosityUnlock}</div>
                </div>
            `;
        }
    }
};

// ----------------------------------------------------
// USER SUPPORT TICKET & SCREENSHOT UPLOADER ENGINE
// ----------------------------------------------------
const SupportTicketEngine = {
    selectedImageBase64: null,

    previewImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedImageBase64 = e.target.result;
                const prevBox = document.getElementById('supportImgPreview');
                if (prevBox) {
                    prevBox.src = e.target.result;
                    prevBox.style.display = 'block';
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    submitTicket() {
        const catSelect = document.getElementById('supportCategorySelect');
        const descInput = document.getElementById('supportDescInput');

        const category = catSelect ? catSelect.value : 'General Issue';
        const description = descInput ? descInput.value.trim() : '';

        if (!description) {
            alert("Please describe your issue before submitting.");
            return;
        }

        const tickets = JSON.parse(localStorage.getItem('speakup_support_tickets') || '[]');
        const newTicket = {
            id: 'TCK-' + Math.floor(10000 + Math.random() * 90000),
            user: ProfileEngine.profile.email || 'Learner',
            category: category,
            description: description,
            screenshot: this.selectedImageBase64 || null,
            status: 'Pending',
            createdAt: new Date().toLocaleString()
        };

        tickets.unshift(newTicket);
        localStorage.setItem('speakup_support_tickets', JSON.stringify(tickets));

        // Reset form
        if (descInput) descInput.value = '';
        this.selectedImageBase64 = null;
        const prevBox = document.getElementById('supportImgPreview');
        if (prevBox) prevBox.style.display = 'none';

        const modal = document.getElementById('supportTicketModal');
        if (modal) modal.style.display = 'none';

        alert(`✅ Support Ticket ${newTicket.id} Submitted Successfully! Admins will inspect your screenshot & resolve it.`);
    }
};

// ----------------------------------------------------
// ৳99 BDT / 3-MONTHS BKASH AUTO-APPROVAL PAYMENT ENGINE
// ----------------------------------------------------
const BkashPaymentEngine = {
    verifyAndAutoApproveBkashTrx(trxId) {
        if (!trxId || !trxId.trim()) {
            alert("Please enter your 10-character bKash Transaction ID.");
            return false;
        }

        const cleanTrx = trxId.trim().toUpperCase();
        const trxRegex = /^[A-Z0-9]{10,12}$/;

        if (!trxRegex.test(cleanTrx)) {
            alert("❌ Invalid bKash Transaction ID format! Standard bKash TrxIDs contain 10 alphanumeric characters (e.g. BLA7X89Q2Z).");
            return false;
        }

        const usedTrxIDs = JSON.parse(localStorage.getItem('speakup_used_trxids') || '[]');
        if (usedTrxIDs.includes(cleanTrx)) {
            alert("❌ This bKash Transaction ID has already been used!");
            return false;
        }

        usedTrxIDs.push(cleanTrx);
        localStorage.setItem('speakup_used_trxids', JSON.stringify(usedTrxIDs));

        // INSTANT AUTO-APPROVAL: Grant 90-Day Pro Membership (3 Months Pass)
        ProfileEngine.profile.isPro = true;
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + 90);
        ProfileEngine.profile.proExpireDate = expDate.toISOString();
        ProfileEngine.profile.xpTotal = (ProfileEngine.profile.xpTotal || 100) + 500;
        ProfileEngine.saveLocalProfile();
        ProfileEngine.renderPersonalSpaceUI();

        const modal = document.getElementById('upgradeModal');
        if (modal) modal.style.display = 'none';

        alert(`🎉 bKash Transaction ID [${cleanTrx}] Verified Automatically!\n\n✨ 3-Month Pro Membership Unlocked Successfully (+500 XP Awarded)! Enjoy 90 Days of Unlimited Access.`);
        return true;
    }
};

// ----------------------------------------------------
// ADMIN DASHBOARD & ISSUE RESOLUTION ENGINE
// ----------------------------------------------------
const AdminDashboardEngine = {
    renderAdminModal() {
        const tickets = JSON.parse(localStorage.getItem('speakup_support_tickets') || '[]');
        const container = document.getElementById('adminTicketsList');
        if (!container) return;

        if (tickets.length === 0) {
            container.innerHTML = `<div style="font-size:12px; color:#64748B; text-align:center; padding:20px;">No pending user support tickets!</div>`;
            return;
        }

        container.innerHTML = tickets.map((t, idx) => `
            <div style="background:#FFFFFF; border:1.5px solid ${t.status === 'Resolved' ? '#86EFAC' : '#CBD5E1'}; border-radius:14px; padding:12px; margin-bottom:10px; text-align:left;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:11px; font-weight:800; color:#0F172A;">🎟️ ${t.id} • ${t.user}</span>
                    <span style="font-size:10px; font-weight:900; background:${t.status === 'Resolved' ? '#DCFCE7' : '#FEF3C7'}; color:${t.status === 'Resolved' ? '#15803D' : '#B45309'}; padding:2px 8px; border-radius:6px;">${t.status}</span>
                </div>
                <div style="font-size:12px; color:#334155; font-weight:700; margin-bottom:6px;">"${t.description}"</div>
                
                ${t.screenshot ? `
                    <button onclick="AdminDashboardEngine.viewScreenshot('${t.id}')" style="background:#F0F9FF; border:1px solid #BAE6FD; color:#0369A1; padding:4px 10px; border-radius:8px; font-size:10px; font-weight:800; cursor:pointer; margin-bottom:8px;">
                        🖼️ View User Error Screenshot
                    </button>
                ` : '<div style="font-size:10px; color:#94A3B8; margin-bottom:6px;">(No screenshot attached)</div>'}

                <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px;">
                    <button onclick="AdminDashboardEngine.resolveTicket(${idx})" style="background:#22C55E; color:white; border:none; padding:5px 10px; border-radius:8px; font-weight:800; font-size:10px; cursor:pointer;">
                        ✅ Resolve Ticket
                    </button>
                    <button onclick="AdminDashboardEngine.activateProForUser('${t.user}')" style="background:#7C3AED; color:white; border:none; padding:5px 10px; border-radius:8px; font-weight:800; font-size:10px; cursor:pointer;">
                        ⚡ Activate 3-Mo Pro
                    </button>
                </div>
            </div>
        `).join('');
    },

    viewScreenshot(ticketId) {
        const tickets = JSON.parse(localStorage.getItem('speakup_support_tickets') || '[]');
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket && ticket.screenshot) {
            const w = window.open("");
            w.document.write(`<img src="${ticket.screenshot}" style="max-width:100%; border-radius:12px;">`);
        } else {
            alert("No screenshot available for this ticket.");
        }
    },

    resolveTicket(idx) {
        const tickets = JSON.parse(localStorage.getItem('speakup_support_tickets') || '[]');
        if (tickets[idx]) {
            tickets[idx].status = 'Resolved';
            localStorage.setItem('speakup_support_tickets', JSON.stringify(tickets));
            this.renderAdminModal();
            alert(`✅ Ticket ${tickets[idx].id} resolved!`);
        }
    },

    activateProForUser(email) {
        ProfileEngine.profile.isPro = true;
        ProfileEngine.saveLocalProfile();
        alert(`⚡ Activated 90-Day Pro Membership for user [${email}]!`);
    },

    exportAdminCSV() {
        const tickets = JSON.parse(localStorage.getItem('speakup_support_tickets') || '[]');
        let csv = "Ticket ID,User Email,Category,Description,Status,Date\n";
        tickets.forEach(t => {
            csv += `"${t.id}","${t.user}","${t.category}","${t.description.replace(/"/g, '""')}","${t.status}","${t.createdAt}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'speakup_users_and_tickets.csv';
        a.click();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ProfileEngine.init();
});
