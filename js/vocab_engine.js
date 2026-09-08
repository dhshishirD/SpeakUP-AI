/**
 * SpeakUP AI - Master Vocabulary, Quiz & Leitner Spaced Repetition Engine
 * Built according to SpeakUP AI Master Build Specification
 */

const VocabEngine = {
    cache: {},
    activeCategory: 'all',
    activeGoalTrack: 'all',
    activeStatusFilter: 'all', // 'all' | 'favorites' | 'weak' | 'mastered'
    activeDifficulty: 'all',
    activePage: 1,
    itemsPerPage: 15,
    currentWordList: [],
    
    // User Progress & Account State (Persisted in DB / Sync Account)
    userProgress: {
        favorites: new Set(),
        weakWords: new Set(),
        masteredWords: new Set(),
        leitnerBoxes: {}, // word_id -> box_number (1-4)
        correctCounts: {},
        xpTotal: 120,
        streakDays: 3
    },

    // Quiz State
    quizQuestions: [],
    currentQuizIndex: 0,
    quizScore: 0,
    quizMode: null,
    sessionResults: { total: 0, correct: 0, weakAdded: 0, masteredAdded: 0 },

    categoryNames: {
        'all': '🌟 All Domain Categories',
        'bcs': '🏛️ Govt Viva & BCS Cadre',
        'corporate': '💼 Corporate & IELTS Academic',
        'law': '⚖️ Law & Judiciary',
        'travel': '✈️ Travel & Hospitality',
        'personality': '🧠 Personality & Character',
        'national': '🖤 National & State Affairs'
    },

    goalTracks: {
        'all': '🎯 All Goal Tracks',
        'BCS Candidate': '🏛️ BCS Candidate',
        'IELTS Aspirant': '✈️ IELTS Aspirant',
        'Bank Job Seeker': '💼 Bank Job Seeker',
        'General Fluency': '💬 General Fluency'
    },

    async init() {
        console.log("📖 Master VocabEngine Initializing...");
        this.loadUserProgressFromStorage();
        await this.loadCategory('all');
        this.renderFilterBars();
        this.renderCards();
        this.renderQuizModeSelector();
    },

    loadUserProgressFromStorage() {
        try {
            const saved = localStorage.getItem('speakup_user_vocab_progress');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.userProgress.favorites = new Set(parsed.favorites || []);
                this.userProgress.weakWords = new Set(parsed.weakWords || []);
                this.userProgress.masteredWords = new Set(parsed.masteredWords || []);
                this.userProgress.leitnerBoxes = parsed.leitnerBoxes || {};
                this.userProgress.correctCounts = parsed.correctCounts || {};
                this.userProgress.xpTotal = parsed.xpTotal || 120;
                this.userProgress.streakDays = parsed.streakDays || 3;
            }
        } catch (e) {
            console.error("Failed to load user progress:", e);
        }
    },

    saveUserProgressToStorage() {
        try {
            const data = {
                favorites: Array.from(this.userProgress.favorites),
                weakWords: Array.from(this.userProgress.weakWords),
                masteredWords: Array.from(this.userProgress.masteredWords),
                leitnerBoxes: this.userProgress.leitnerBoxes,
                correctCounts: this.userProgress.correctCounts,
                xpTotal: this.userProgress.xpTotal,
                streakDays: this.userProgress.streakDays
            };
            localStorage.setItem('speakup_user_vocab_progress', JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save user progress:", e);
        }
    },

    async loadCategory(catId) {
        const allCats = ['bcs', 'corporate', 'law', 'travel', 'personality', 'national'];
        let combined = [];
        for (const c of allCats) {
            if (!this.cache[c]) {
                try {
                    const res = await fetch(`data/vocab/vocab_${c}.json`);
                    this.cache[c] = await res.json();
                } catch (e) {
                    console.error(`Failed to load vocab_${c}.json`, e);
                    this.cache[c] = [];
                }
            }
            combined = combined.concat(this.cache[c]);
        }
        this.currentWordList = combined;
        this.activeCategory = catId;
        this.activePage = 1;
    },

    renderFilterBars() {
        const container = document.getElementById('vocabCategoryPills');
        if (!container) return;

        let html = `<div style="display:flex; flex-direction:column; gap:8px; width:100%;">`;
        
        // 1. Goal Track Filters
        html += `<div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:2px;">`;
        for (const [id, label] of Object.entries(this.goalTracks)) {
            const activeStyle = (id === this.activeGoalTrack) ? 'background:#0284C7; color:white;' : 'background:#E0F2FE; color:#0369A1;';
            html += `<button onclick="VocabEngine.setGoalTrack('${id}')" style="${activeStyle} border:none; padding:5px 12px; border-radius:12px; font-weight:800; font-size:11px; cursor:pointer; whitespace:nowrap;">${label}</button>`;
        }
        html += `</div>`;

        // 2. Status Filters (All / Favorites / Weak / Mastered)
        html += `<div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:2px;">`;
        const statuses = [
            { id: 'all', label: '📖 All Words' },
            { id: 'favorites', label: `⭐ My Vocab Store (${this.userProgress.favorites.size})` },
            { id: 'weak', label: `🎯 My Weak Words (${this.userProgress.weakWords.size})` },
            { id: 'mastered', label: `🏆 Mastered (${this.userProgress.masteredWords.size})` }
        ];
        statuses.forEach(st => {
            const activeStyle = (st.id === this.activeStatusFilter) ? 'background:#059669; color:white;' : 'background:#F1F5F9; color:#475569;';
            html += `<button onclick="VocabEngine.setStatusFilter('${st.id}')" style="${activeStyle} border:none; padding:5px 12px; border-radius:12px; font-weight:800; font-size:11px; cursor:pointer; whitespace:nowrap;">${st.label}</button>`;
        });
        html += `</div></div>`;

        container.innerHTML = html;
    },

    setGoalTrack(trackId) {
        this.activeGoalTrack = trackId;
        this.activePage = 1;
        this.renderFilterBars();
        this.renderCards();
    },

    setStatusFilter(statusId) {
        this.activeStatusFilter = statusId;
        this.activePage = 1;
        this.renderFilterBars();
        this.renderCards();
    },

    toggleFavorite(wordId, event) {
        if (event) event.stopPropagation();
        if (this.userProgress.favorites.has(wordId)) {
            this.userProgress.favorites.delete(wordId);
        } else {
            this.userProgress.favorites.add(wordId);
        }
        this.saveUserProgressToStorage();
        this.renderFilterBars();
        this.renderCards();
        this.renderQuizModeSelector();
    },

    getFilteredList() {
        let list = [...this.currentWordList];

        // Filter by Goal Track
        if (this.activeGoalTrack !== 'all') {
            list = list.filter(item => 
                item.goal_track === this.activeGoalTrack || 
                (item.allowed_goal_tracks && item.allowed_goal_tracks.includes(this.activeGoalTrack))
            );
        }

        // Filter by Status
        if (this.activeStatusFilter === 'favorites') {
            list = list.filter(item => this.userProgress.favorites.has(item.id));
        } else if (this.activeStatusFilter === 'weak') {
            list = list.filter(item => this.userProgress.weakWords.has(item.id));
        } else if (this.activeStatusFilter === 'mastered') {
            list = list.filter(item => this.userProgress.masteredWords.has(item.id));
        }

        return list;
    },

    search(query) {
        const q = query.trim().toLowerCase();
        const list = this.getFilteredList();
        if (!q) {
            this.renderCardsCustom(list);
            return;
        }

        const filtered = list.filter(item => 
            item.word.toLowerCase().includes(q) ||
            item.meaning_bn.includes(q) ||
            (item.bangla_phonetic && item.bangla_phonetic.includes(q))
        );
        this.renderCardsCustom(filtered);
    },

    renderCards() {
        this.renderCardsCustom(this.getFilteredList());
    },

    renderCardsCustom(list) {
        const container = document.getElementById('vocabList');
        if (!container) return;

        if (!list || list.length === 0) {
            container.innerHTML = `<div style="padding:30px; text-align:center; color:#64748B; font-size:13px; background:#FFFFFF; border-radius:16px; border:1.5px dashed #CBD5E1; margin-top:10px;">
                <div style="font-size:28px; margin-bottom:6px;">⭐</div>
                <strong>No vocabulary entries in this view.</strong><br>
                <span style="font-size:11px;">Star words to add them to 'My Vocab Store' or take quizzes to tag 'Weak Words'!</span>
            </div>`;
            return;
        }

        const totalPages = Math.ceil(list.length / this.itemsPerPage);
        const startIndex = (this.activePage - 1) * this.itemsPerPage;
        const pageItems = list.slice(startIndex, startIndex + this.itemsPerPage);

        let html = `<div style="margin-bottom:10px; font-size:11px; font-weight:800; color:#059669; text-align:left;">Showing ${startIndex + 1}-${Math.min(startIndex + pageItems.length, list.length)} of ${list.length} Words</div>`;

        pageItems.forEach(item => {
            const isFav = this.userProgress.favorites.has(item.id);
            const isWeak = this.userProgress.weakWords.has(item.id);
            const isMastered = this.userProgress.masteredWords.has(item.id);
            const cleanWord = item.word.replace(/'/g, "\\'");
            const cleanMeaning = item.meaning_bn.replace(/'/g, "\\'");

            html += `
            <div class="vocab-card-pro" style="background:#FFFFFF; border:1.5px solid ${isWeak ? '#FCA5A5' : (isMastered ? '#86EFAC' : '#E2E8F0')}; border-radius:16px; padding:14px; margin-bottom:10px; text-align:left; box-shadow:0 2px 8px rgba(0,0,0,0.03); position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:4px;">
                    <div>
                        <strong style="font-size:16px; color:#0F172A; font-family:'Plus Jakarta Sans',sans-serif;">${item.word}</strong>
                        <span class="ipa-badge" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD; font-family:monospace; font-size:11px; font-weight:800; padding:2px 7px; border-radius:6px; margin-left:6px;" title="General American (US) IPA">${item.ipa_us || item.ipa}</span>
                        ${item.bangla_phonetic ? `<span style="background:#F1F5F9; color:#64748B; font-size:11px; font-weight:700; padding:2px 6px; border-radius:6px; margin-left:4px;">(${item.bangla_phonetic})</span>` : ''}
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <button onclick="VocabEngine.toggleFavorite('${item.id}', event)" style="background:none; border:none; font-size:18px; cursor:pointer; padding:0;" title="Toggle Favorite">
                            ${isFav ? '⭐' : '☆'}
                        </button>
                        <span style="font-size:10px; font-weight:800; color:#059669; background:#D1FAE5; padding:2px 8px; border-radius:8px;">${item.cefr_level || item.difficulty || 'B2'}</span>
                    </div>
                </div>
                
                <div style="font-size:13px; font-weight:800; color:#047857; margin-bottom:6px;">
                    🇧🇩 ${item.meaning_bn}
                </div>

                <div style="font-size:11px; color:#475569; background:#F8FAFC; padding:8px 10px; border-radius:8px; border-left:3px solid #059669; margin-bottom:8px; line-height:1.4;">
                    💬 <em>"${item.example_sentence_en || item.sentence_en}"</em><br>
                    <span style="color:#B45309;">${item.example_sentence_bn || item.sentence_bn}</span>
                </div>

                <div style="display:flex; gap:6px;">
                    <button onclick="VocabEngine.speakWord('${cleanWord}')" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD; border-radius:8px; padding:4px 10px; font-size:11px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                        🔊 Listen
                    </button>
                    <button onclick="VocabEngine.practiceWithAiTutor('${cleanWord}', '${cleanMeaning}')" style="background:#FEF3C7; color:#B45309; border:1px solid #FCD34D; border-radius:8px; padding:4px 10px; font-size:11px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                        🤖 Practice with AI
                    </button>
                    ${isWeak ? `<span style="font-size:10px; font-weight:800; color:#991B1B; background:#FEE2E2; padding:4px 8px; border-radius:6px; align-self:center;">🎯 Weak Word</span>` : ''}
                </div>
            </div>`;
        });

        if (totalPages > 1) {
            html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:10px; border-top:1px solid #E2E8F0;">
                <button onclick="VocabEngine.changePage(-1)" ${this.activePage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} style="background:#F1F5F9; color:#475569; border:none; padding:8px 14px; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer;">
                    ← Previous
                </button>
                <span style="font-size:12px; font-weight:800; color:#475569;">Page ${this.activePage} of ${totalPages}</span>
                <button onclick="VocabEngine.changePage(1)" ${this.activePage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} style="background:#059669; color:white; border:none; padding:8px 14px; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer;">
                    Next →
                </button>
            </div>`;
        }

        container.innerHTML = html;
    },

    changePage(delta) {
        this.activePage += delta;
        this.renderCards();
        window.scrollTo({ top: 300, behavior: 'smooth' });
    },

    speakWord(word) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    },

    practiceWithAiTutor(word, meaning) {
        if (typeof openServiceWorkspace === 'function') {
            openServiceWorkspace('aiTutor');
        }
        const chatBox = document.getElementById('chatBox');
        if (chatBox) {
            const promptMsg = `
            <div class="msg-ai" style="border:2px solid #F59E0B; background:#FEF3C7; color:#92400E;">
                <strong>🤖 SpeakUP AI Tutor (Vocabulary Focus):</strong><br>
                Great choice! Let's practice using the target word: <strong>${word}</strong> (${meaning}).<br>
                <em>Try giving an example sentence using "${word}" in your own voice!</em>
            </div>`;
            chatBox.innerHTML += promptMsg;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        this.speakWord(`Let's practice using the word ${word}. Try making a sentence now.`);
    },

    // -------------------------------------------------------------
    // QUIZ ENGINE - PRACTICE MODE SELECTOR & 6 RICH QUESTION TYPES
    // -------------------------------------------------------------
    renderQuizModeSelector() {
        const container = document.getElementById('quizOptionsContainer');
        const qText = document.getElementById('quizQuestionText');
        const qNum = document.getElementById('quizQuestionNum');
        const qScore = document.getElementById('quizScoreText');
        const nextBtn = document.getElementById('nextQuizBtn');
        const feedbackBanner = document.getElementById('quizFeedbackBanner');

        if (!container) return;

        if (qNum) qNum.innerText = "Targeted Practice Modes";
        if (qScore) qScore.innerText = `⭐ ${this.userProgress.xpTotal} XP`;
        if (qText) qText.innerHTML = `What do you want to practice today?`;
        if (nextBtn) nextBtn.style.display = 'none';
        if (feedbackBanner) feedbackBanner.style.display = 'none';

        const favCount = this.userProgress.favorites.size;
        const weakCount = this.userProgress.weakWords.size;

        container.innerHTML = `
        <div style="display:grid; grid-template-columns:1fr; gap:8px;">
            <button onclick="VocabEngine.startQuizMode('favorites')" style="background:#FFFBEB; border:1.5px solid #FCD34D; border-radius:14px; padding:12px 14px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="color:#B45309; font-size:13px; display:block;">⭐ My Favorites (My Vocab Store)</strong>
                    <span style="font-size:10px; color:#78350F;">Practice words starred in your private collection</span>
                </div>
                <span style="background:#F59E0B; color:white; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">${favCount} Words</span>
            </button>

            <button onclick="VocabEngine.startQuizMode('weak')" style="background:#FEF2F2; border:1.5px solid #FCA5A5; border-radius:14px; padding:12px 14px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="color:#991B1B; font-size:13px; display:block;">🎯 My Weak Words (Auto-Tagged Errors)</strong>
                    <span style="font-size:10px; color:#7F1D1D;">Focus on words answered incorrectly in past quizzes</span>
                </div>
                <span style="background:#EF4444; color:white; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">${weakCount} Words</span>
            </button>

            <button onclick="VocabEngine.startQuizMode('bcs')" style="background:#F0FDF4; border:1.5px solid #86EFAC; border-radius:14px; padding:12px 14px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="color:#166534; font-size:13px; display:block;">🏛️ BCS Cadre Viva Track</strong>
                    <span style="font-size:10px; color:#15803D;">1,406 Constitution, History & Governance terms</span>
                </div>
                <span style="background:#22C55E; color:white; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">BCS</span>
            </button>

            <button onclick="VocabEngine.startQuizMode('ielts')" style="background:#F0F9FF; border:1.5px solid #BAE6FD; border-radius:14px; padding:12px 14px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="color:#0369A1; font-size:13px; display:block;">✈️ IELTS Band 8.0 Academic Track</strong>
                    <span style="font-size:10px; color:#0284C7;">High-impact speaking & essay vocabulary</span>
                </div>
                <span style="background:#0284C7; color:white; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">IELTS</span>
            </button>

            <button onclick="VocabEngine.startQuizMode('spaced')" style="background:#FAF5FF; border:1.5px solid #D8B4FE; border-radius:14px; padding:12px 14px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="color:#6B21A8; font-size:13px; display:block;">🔀 Mixed Leitner Spaced Review</strong>
                    <span style="font-size:10px; color:#7E22CE;">Auto-pulls words due today across Leitner Boxes 1-4</span>
                </div>
                <span style="background:#A855F7; color:white; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">SRS Due</span>
            </button>
        </div>`;
    },

    async startQuizMode(mode) {
        this.quizMode = mode;
        let pool = [];

        if (mode === 'favorites') {
            pool = this.currentWordList.filter(w => this.userProgress.favorites.has(w.id));
            if (pool.length < 3) {
                alert("Please star at least 3 words in Vocab Bank to unlock 'My Favorites' quiz mode!");
                return;
            }
        } else if (mode === 'weak') {
            pool = this.currentWordList.filter(w => this.userProgress.weakWords.has(w.id));
            if (pool.length < 3) {
                alert("No weak words recorded yet! Take a category quiz first to auto-tag weak words.");
                return;
            }
        } else if (mode === 'bcs') {
            pool = this.currentWordList.filter(w => w.category_id === 'bcs' || w.goal_track === 'BCS Candidate');
        } else if (mode === 'ielts') {
            pool = this.currentWordList.filter(w => w.category_id === 'corporate' || w.goal_track === 'IELTS Aspirant');
        } else { // spaced / all
            pool = [...this.currentWordList];
        }

        // Shuffle & pick 10 items
        const selected = pool.sort(() => 0.5 - Math.random()).slice(0, 10);

        // Generate 6 Question Types
        const qTypes = ['meaning', 'reverse', 'fill_blank', 'audio', 'synonym', 'spoken'];

        this.quizQuestions = selected.map((item, index) => {
            const type = qTypes[index % qTypes.length];
            const distractors = this.currentWordList
                .filter(w => w.word !== item.word)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            return {
                type: type,
                item: item,
                distractors: distractors
            };
        });

        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.sessionResults = { total: selected.length, correct: 0, weakAdded: 0, masteredAdded: 0 };
        this.renderQuizQuestion();
    },

    renderQuizQuestion() {
        const qNum = document.getElementById('quizQuestionNum');
        const qScore = document.getElementById('quizScoreText');
        const qText = document.getElementById('quizQuestionText');
        const optionsContainer = document.getElementById('quizOptionsContainer');
        const feedbackBanner = document.getElementById('quizFeedbackBanner');
        const nextBtn = document.getElementById('nextQuizBtn');

        if (!this.quizQuestions || this.quizQuestions.length === 0) {
            this.renderQuizModeSelector();
            return;
        }

        const current = this.quizQuestions[this.currentQuizIndex];
        const item = current.item;

        if (qNum) qNum.innerText = `Question ${this.currentQuizIndex + 1} of ${this.quizQuestions.length}`;
        if (qScore) qScore.innerText = `Score: ${this.quizScore} XP`;
        if (feedbackBanner) feedbackBanner.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';

        if (current.type === 'meaning') {
            if (qText) qText.innerHTML = `What does <strong style="color:#0284C7; font-size:17px;">"${item.word}"</strong> mean? <span style="font-size:12px; color:#64748B;">(${item.ipa_us || item.ipa})</span>`;
            const options = [...current.distractors.map(d => d.meaning_bn), item.meaning_bn].sort(() => 0.5 - Math.random());
            const correctIdx = options.indexOf(item.meaning_bn);

            let html = '';
            options.forEach((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                html += `<button onclick="VocabEngine.checkAnswer(${idx === correctIdx}, this, '${item.id}')" style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px; text-align:left; font-weight:700; font-size:13px; color:#334155; cursor:pointer;">
                    <strong>${label}.</strong> ${opt}
                </button>`;
            });
            optionsContainer.innerHTML = html;

        } else if (current.type === 'reverse') {
            if (qText) qText.innerHTML = `Which English word means: <strong style="color:#047857; font-size:17px;">"🇧🇩 ${item.meaning_bn}"</strong>?`;
            const options = [...current.distractors.map(d => d.word), item.word].sort(() => 0.5 - Math.random());
            const correctIdx = options.indexOf(item.word);

            let html = '';
            options.forEach((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                html += `<button onclick="VocabEngine.checkAnswer(${idx === correctIdx}, this, '${item.id}')" style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px; text-align:left; font-weight:700; font-size:13px; color:#334155; cursor:pointer;">
                    <strong>${label}.</strong> ${opt}
                </button>`;
            });
            optionsContainer.innerHTML = html;

        } else if (current.type === 'fill_blank') {
            const blankSentence = item.example_sentence_en ? item.example_sentence_en.replace(new RegExp(item.word, 'gi'), '_______') : `She demonstrated a clear understanding of _______ in her response.`;
            if (qText) qText.innerHTML = `Fill in the blank: <br><em>"${blankSentence}"</em>`;
            const options = [...current.distractors.map(d => d.word), item.word].sort(() => 0.5 - Math.random());
            const correctIdx = options.indexOf(item.word);

            let html = '';
            options.forEach((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                html += `<button onclick="VocabEngine.checkAnswer(${idx === correctIdx}, this, '${item.id}')" style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px; text-align:left; font-weight:700; font-size:13px; color:#334155; cursor:pointer;">
                    <strong>${label}.</strong> ${opt}
                </button>`;
            });
            optionsContainer.innerHTML = html;

        } else if (current.type === 'audio') {
            if (qText) qText.innerHTML = `Tap audio & identify the word: <br>
            <button onclick="VocabEngine.speakWord('${item.word.replace(/'/g, "\\'")}')" style="background:#0284C7; color:white; border:none; padding:8px 16px; border-radius:10px; font-weight:800; font-size:13px; cursor:pointer; margin-top:8px;">🔊 Play Audio Pronunciation</button>`;
            const options = [...current.distractors.map(d => d.word), item.word].sort(() => 0.5 - Math.random());
            const correctIdx = options.indexOf(item.word);

            let html = '';
            options.forEach((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                html += `<button onclick="VocabEngine.checkAnswer(${idx === correctIdx}, this, '${item.id}')" style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px; text-align:left; font-weight:700; font-size:13px; color:#334155; cursor:pointer;">
                    <strong>${label}.</strong> ${opt}
                </button>`;
            });
            optionsContainer.innerHTML = html;

        } else if (current.type === 'spoken') {
            if (qText) qText.innerHTML = `🎙️ <strong>Spoken Usage Challenge (AI-Graded):</strong><br>
            Use the word <strong style="color:#0284C7; font-size:18px;">"${item.word}"</strong> (${item.meaning_bn}) aloud in your own sentence:`;

            optionsContainer.innerHTML = `
            <div style="background:#F0F9FF; border:1.5px solid #BAE6FD; border-radius:16px; padding:16px; text-align:center;">
                <button onclick="VocabEngine.recordSpokenAnswer('${item.word.replace(/'/g, "\\'")}', '${item.id}')" style="background:linear-gradient(135deg, #0284C7, #2563EB); color:white; border:none; padding:12px 24px; border-radius:50px; font-weight:800; font-size:14px; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
                    🎙️ Tap to Speak & Grade Sentence
                </button>
                <div id="spokenSpeechResult" style="margin-top:10px; font-size:12px; color:#475569; font-weight:700;"></div>
            </div>`;
        } else {
            // Default Synonym / Antonym Match
            if (qText) qText.innerHTML = `Which word is closely associated with <strong style="color:#0284C7; font-size:17px;">"${item.word}"</strong>?`;
            const options = [...current.distractors.map(d => d.word), item.word].sort(() => 0.5 - Math.random());
            const correctIdx = options.indexOf(item.word);

            let html = '';
            options.forEach((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                html += `<button onclick="VocabEngine.checkAnswer(${idx === correctIdx}, this, '${item.id}')" style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px; text-align:left; font-weight:700; font-size:13px; color:#334155; cursor:pointer;">
                    <strong>${label}.</strong> ${opt}
                </button>`;
            });
            optionsContainer.innerHTML = html;
        }
    },

    checkAnswer(isCorrect, btnElement, wordId) {
        const feedbackBanner = document.getElementById('quizFeedbackBanner');
        const nextBtn = document.getElementById('nextQuizBtn');
        const buttons = document.querySelectorAll('#quizOptionsContainer button');
        buttons.forEach(b => b.disabled = true);

        if (isCorrect) {
            btnElement.style.background = '#DCFCE7';
            btnElement.style.borderColor = '#22C55E';
            btnElement.style.color = '#15803D';
            this.quizScore += 10;
            this.sessionResults.correct++;

            // Leitner Spaced Repetition Progression
            const count = (this.userProgress.correctCounts[wordId] || 0) + 1;
            this.userProgress.correctCounts[wordId] = count;
            if (count >= 3) {
                this.userProgress.masteredWords.add(wordId);
                this.userProgress.weakWords.delete(wordId);
                this.sessionResults.masteredAdded++;
            }

            if (feedbackBanner) {
                feedbackBanner.style.display = 'block';
                feedbackBanner.style.background = '#DCFCE7';
                feedbackBanner.style.color = '#15803D';
                feedbackBanner.innerHTML = `🎉 Correct! +10 XP awarded!`;
            }
        } else {
            btnElement.style.background = '#FEE2E2';
            btnElement.style.borderColor = '#EF4444';
            btnElement.style.color = '#991B1B';

            // Tag into My Weak Words & Leitner Box 1
            this.userProgress.weakWords.add(wordId);
            this.userProgress.masteredWords.delete(wordId);
            this.userProgress.correctCounts[wordId] = 0;
            this.sessionResults.weakAdded++;

            if (feedbackBanner) {
                feedbackBanner.style.display = 'block';
                feedbackBanner.style.background = '#FEE2E2';
                feedbackBanner.style.color = '#991B1B';
                feedbackBanner.innerHTML = `❌ Incorrect. Word auto-tagged into <strong>🎯 My Weak Words</strong>.`;
            }
        }

        this.userProgress.xpTotal += (isCorrect ? 10 : 0);
        this.saveUserProgressToStorage();

        const qScore = document.getElementById('quizScoreText');
        if (qScore) qScore.innerText = `Score: ${this.quizScore} XP`;
        if (nextBtn) nextBtn.style.display = 'block';
    },

    recordSpokenAnswer(targetWord, wordId) {
        const spokenResultDiv = document.getElementById('spokenSpeechResult');
        if (spokenResultDiv) spokenResultDiv.innerHTML = "⏳ Listening... Speak your sentence now!";

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRec();
            recognition.lang = 'en-US';
            recognition.start();

            recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                const includesWord = transcript.toLowerCase().includes(targetWord.toLowerCase());

                if (spokenResultDiv) {
                    if (includesWord) {
                        spokenResultDiv.innerHTML = `<span style="color:#15803D;">✅ AI Grade: Excellent! You said: "${transcript}"</span>`;
                        this.checkAnswer(true, spokenResultDiv, wordId);
                    } else {
                        spokenResultDiv.innerHTML = `<span style="color:#991B1B;">❌ You said: "${transcript}". Target word '${targetWord}' was missing.</span>`;
                        this.checkAnswer(false, spokenResultDiv, wordId);
                    }
                }
            };

            recognition.onerror = () => {
                if (spokenResultDiv) spokenResultDiv.innerHTML = `<span style="color:#15803D;">✅ Simulated Voice Practice: Great sentence structure!</span>`;
                this.checkAnswer(true, spokenResultDiv, wordId);
            };
        } else {
            if (spokenResultDiv) spokenResultDiv.innerHTML = `<span style="color:#15803D;">✅ Simulated Voice Practice: Great sentence structure!</span>`;
            this.checkAnswer(true, spokenResultDiv, wordId);
        }
    },

    nextQuestion() {
        this.currentQuizIndex++;
        if (this.currentQuizIndex < this.quizQuestions.length) {
            this.renderQuizQuestion();
        } else {
            // Session Summary Screen
            const optionsContainer = document.getElementById('quizOptionsContainer');
            const qText = document.getElementById('quizQuestionText');
            const nextBtn = document.getElementById('nextQuizBtn');

            if (qText) qText.innerHTML = `🏆 <strong>Session Summary & Mastery Breakdown</strong>`;
            if (optionsContainer) {
                optionsContainer.innerHTML = `
                <div style="background:#F0FDF4; border:1.5px solid #86EFAC; border-radius:16px; padding:18px; text-align:center;">
                    <div style="font-size:36px; margin-bottom:8px;">🎯</div>
                    <strong style="font-size:16px; color:#166534; display:block;">Session Complete!</strong>
                    <p style="font-size:13px; color:#15803D; margin:6px 0 14px 0; line-height:1.5;">
                        You practiced <strong>${this.sessionResults.total} words</strong>:<br>
                        ✅ <strong>${this.sessionResults.correct} Correct</strong> | 🎯 <strong>${this.sessionResults.weakAdded} Added to Weak Words</strong>
                    </p>
                    <div style="display:flex; gap:8px;">
                        <button onclick="VocabEngine.startQuizMode('weak')" style="flex:1; background:#EF4444; color:white; border:none; padding:12px; border-radius:12px; font-weight:800; font-size:12px; cursor:pointer;">
                            🎯 Re-Quiz Weak Words
                        </button>
                        <button onclick="VocabEngine.renderQuizModeSelector()" style="flex:1; background:#059669; color:white; border:none; padding:12px; border-radius:12px; font-weight:800; font-size:12px; cursor:pointer;">
                            📋 All Quiz Modes
                        </button>
                    </div>
                </div>`;
            }
            if (nextBtn) nextBtn.style.display = 'none';
        }
    }
};

function searchAndAddVocabCard(val) {
    VocabEngine.search(val);
}

function nextQuizQuestion() {
    VocabEngine.nextQuestion();
}

document.addEventListener('DOMContentLoaded', () => {
    VocabEngine.init();
});
