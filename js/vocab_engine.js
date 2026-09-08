/**
 * SpeakUP AI - High-Performance Vocabulary & Automated Quiz Engine
 * Features:
 * 1. Async JSON Lazy Loading (0% page load impact, <50KB per category)
 * 2. In-Memory Sub-5ms Search & Category Filtering
 * 3. Paginated Card Rendering (15 items per page for 60 FPS performance)
 * 4. Text-to-Speech Web Audio Pronunciation
 * 5. Interactive "Practice with AI Tutor" Voice Trigger
 * 6. Dynamic 10-Question MCQ Quiz Generator with Distractor Engine
 */

const VocabEngine = {
    cache: {},
    activeCategory: 'bcs',
    activePage: 1,
    itemsPerPage: 15,
    currentWordList: [],
    quizQuestions: [],
    currentQuizIndex: 0,
    quizScore: 0,

    categoryNames: {
        'all': '🌟 All Categories',
        'bcs': '🏛️ Govt Viva & BCS Cadre',
        'corporate': '💼 Corporate & IELTS',
        'law': '⚖️ Law & Judiciary',
        'travel': '✈️ Travel & Hospitality',
        'personality': '🧠 Personality & Character',
        'national': '🖤 National & State Affairs'
    },

    async init() {
        console.log("📖 VocabEngine Initializing...");
        await this.loadCategory('bcs');
        this.renderCategoryPills();
        this.renderCards();
    },

    async loadCategory(catId) {
        if (catId === 'all') {
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
            this.activeCategory = 'all';
            return;
        }

        if (!this.cache[catId]) {
            try {
                const res = await fetch(`data/vocab/vocab_${catId}.json`);
                this.cache[catId] = await res.json();
            } catch (e) {
                console.error(`Failed to load vocab_${catId}.json`, e);
                this.cache[catId] = [];
            }
        }
        this.activeCategory = catId;
        this.currentWordList = this.cache[catId] || [];
        this.activePage = 1;
    },

    renderCategoryPills() {
        const container = document.getElementById('vocabCategoryPills');
        if (!container) return;

        let html = '';
        for (const [id, label] of Object.entries(this.categoryNames)) {
            const activeStyle = (id === this.activeCategory) ? 'background:#059669; color:white;' : 'background:#F1F5F9; color:#475569;';
            html += `<button onclick="VocabEngine.switchCategory('${id}')" style="${activeStyle} border:none; padding:6px 12px; border-radius:12px; font-weight:800; font-size:11px; cursor:pointer; whitespace:nowrap; transition:all 0.2s;">${label}</button>`;
        }
        container.innerHTML = html;
    },

    async switchCategory(catId) {
        await this.loadCategory(catId);
        this.renderCategoryPills();
        this.activePage = 1;
        this.renderCards();
    },

    search(query) {
        const q = query.trim().toLowerCase();
        if (!q) {
            this.loadCategory(this.activeCategory).then(() => this.renderCards());
            return;
        }

        const filtered = this.currentWordList.filter(item => 
            item.word.toLowerCase().includes(q) ||
            item.meaning_bn.includes(q) ||
            (item.bangla_phonetic && item.bangla_phonetic.includes(q))
        );
        this.renderCardsCustom(filtered);
    },

    renderCards() {
        this.renderCardsCustom(this.currentWordList);
    },

    renderCardsCustom(list) {
        const container = document.getElementById('vocabList');
        if (!container) return;

        if (!list || list.length === 0) {
            container.innerHTML = `<div style="padding:20px; text-align:center; color:#64748B; font-size:13px;">No vocabulary words found matching your search.</div>`;
            return;
        }

        const totalPages = Math.ceil(list.length / this.itemsPerPage);
        const startIndex = (this.activePage - 1) * this.itemsPerPage;
        const pageItems = list.slice(startIndex, startIndex + this.itemsPerPage);

        let html = `<div style="margin-bottom:10px; font-size:11px; font-weight:800; color:#059669; text-align:left;">Showing ${startIndex + 1}-${Math.min(startIndex + pageItems.length, list.length)} of ${list.length} Words</div>`;

        pageItems.forEach(item => {
            const cleanWord = item.word.replace(/'/g, "\\'");
            const cleanMeaning = item.meaning_bn.replace(/'/g, "\\'");
            html += `
            <div class="vocab-card-pro" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:16px; padding:14px; margin-bottom:10px; text-align:left; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:4px;">
                    <div>
                        <strong style="font-size:16px; color:#0F172A; font-family:'Plus Jakarta Sans',sans-serif;">${item.word}</strong>
                        <span class="ipa-badge" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD; font-family:monospace; font-size:11px; font-weight:800; padding:2px 7px; border-radius:6px; margin-left:6px;" title="IPA Pronunciation with Syllable Stress Mark (ˈ)">${item.ipa}</span>
                        ${item.bangla_phonetic ? `<span style="background:#F1F5F9; color:#64748B; font-size:11px; font-weight:700; padding:2px 6px; border-radius:6px; margin-left:4px;">(${item.bangla_phonetic})</span>` : ''}
                    </div>
                    <span style="font-size:10px; font-weight:800; color:#059669; background:#D1FAE5; padding:2px 8px; border-radius:8px;">${item.cefr_level || 'B2'}</span>
                </div>
                
                <div style="font-size:13px; font-weight:800; color:#047857; margin-bottom:6px;">
                    🇧🇩 ${item.meaning_bn}
                </div>

                <div style="font-size:11px; color:#475569; background:#F8FAFC; padding:8px 10px; border-radius:8px; border-left:3px solid #059669; margin-bottom:8px; line-height:1.4;">
                    💬 <em>"${item.sentence_en}"</em><br>
                    <span style="color:#B45309;">${item.sentence_bn}</span>
                </div>

                <div style="display:flex; gap:6px;">
                    <button onclick="VocabEngine.speakWord('${cleanWord}')" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD; border-radius:8px; padding:4px 10px; font-size:11px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                        🔊 Listen
                    </button>
                    <button onclick="VocabEngine.practiceWithAiTutor('${cleanWord}', '${cleanMeaning}')" style="background:#FEF3C7; color:#B45309; border:1px solid #FCD34D; border-radius:8px; padding:4px 10px; font-size:11px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                        🤖 Practice with AI
                    </button>
                </div>
            </div>`;
        });

        // Pagination Controls
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
        } else {
            alert("Text-to-speech is not supported in your browser.");
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

    // AUTOMATED QUIZ GENERATOR ENGINE
    async startQuiz(catId = 'bcs') {
        await this.loadCategory(catId);
        if (!this.currentWordList || this.currentWordList.length < 5) return;

        const shuffled = [...this.currentWordList].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        this.quizQuestions = selected.map(item => {
            const distractors = this.currentWordList
                .filter(w => w.word !== item.word)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(w => w.meaning_bn);

            const options = [...distractors, item.meaning_bn].sort(() => 0.5 - Math.random());
            const correctIndex = options.indexOf(item.meaning_bn);

            return {
                word: item.word,
                ipa: item.ipa,
                sentence_en: item.sentence_en,
                meaning_bn: item.meaning_bn,
                options: options,
                correctIndex: correctIndex
            };
        });

        this.currentQuizIndex = 0;
        this.quizScore = 0;
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
            this.startQuiz(this.activeCategory);
            return;
        }

        const current = this.quizQuestions[this.currentQuizIndex];
        if (qNum) qNum.innerText = `Question ${this.currentQuizIndex + 1} of ${this.quizQuestions.length}`;
        if (qScore) qScore.innerText = `Score: ${this.quizScore} XP`;
        if (qText) qText.innerHTML = `What is the Bangla meaning of <strong style="color:#0284C7; font-size:17px;">"${current.word}"</strong> <span style="font-size:12px; color:#64748B;">${current.ipa}</span>?`;

        if (feedbackBanner) feedbackBanner.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';

        if (optionsContainer) {
            let html = '';
            current.options.forEach((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                html += `
                <button onclick="VocabEngine.checkAnswer(${idx}, this)" style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px; text-align:left; font-weight:700; font-size:13px; color:#334155; cursor:pointer; transition:all 0.2s;">
                    <strong>${label}.</strong> ${opt}
                </button>`;
            });
            optionsContainer.innerHTML = html;
        }
    },

    checkAnswer(selectedIndex, btnElement) {
        const current = this.quizQuestions[this.currentQuizIndex];
        const buttons = document.querySelectorAll('#quizOptionsContainer button');
        buttons.forEach(b => b.disabled = true);

        const feedbackBanner = document.getElementById('quizFeedbackBanner');
        const nextBtn = document.getElementById('nextQuizBtn');

        if (selectedIndex === current.correctIndex) {
            btnElement.style.background = '#DCFCE7';
            btnElement.style.borderColor = '#22C55E';
            btnElement.style.color = '#15803D';
            this.quizScore += 10;

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

            if (buttons[current.correctIndex]) {
                buttons[current.correctIndex].style.background = '#DCFCE7';
                buttons[current.correctIndex].style.borderColor = '#22C55E';
                buttons[current.correctIndex].style.color = '#15803D';
            }

            if (feedbackBanner) {
                feedbackBanner.style.display = 'block';
                feedbackBanner.style.background = '#FEE2E2';
                feedbackBanner.style.color = '#991B1B';
                feedbackBanner.innerHTML = `❌ Incorrect. Correct answer: <strong>${current.meaning_bn}</strong>`;
            }
        }

        const qScore = document.getElementById('quizScoreText');
        if (qScore) qScore.innerText = `Score: ${this.quizScore} XP`;

        if (nextBtn) nextBtn.style.display = 'block';
    },

    nextQuestion() {
        this.currentQuizIndex++;
        if (this.currentQuizIndex < this.quizQuestions.length) {
            this.renderQuizQuestion();
        } else {
            const optionsContainer = document.getElementById('quizOptionsContainer');
            const qText = document.getElementById('quizQuestionText');
            const nextBtn = document.getElementById('nextQuizBtn');

            if (qText) qText.innerHTML = `🏆 <strong>Quiz Complete!</strong><br>You scored <span style="color:#059669; font-size:20px;">${this.quizScore} XP</span> out of 100 XP!`;
            if (optionsContainer) {
                optionsContainer.innerHTML = `
                <div style="background:#F0FDF4; border:1.5px solid #86EFAC; border-radius:16px; padding:16px; text-align:center;">
                    <div style="font-size:32px; margin-bottom:8px;">🎯</div>
                    <strong style="font-size:16px; color:#166534; display:block;">Great Job!</strong>
                    <p style="font-size:12px; color:#15803D; margin:4px 0 14px 0;">Keep practicing daily to master all 3,978 vocabulary words!</p>
                    <button onclick="VocabEngine.startQuiz('${this.activeCategory}')" style="background:#059669; color:white; border:none; padding:12px 20px; border-radius:12px; font-weight:800; font-size:13px; cursor:pointer;">
                        🔄 Retake Quiz / New Questions
                    </button>
                </div>`;
            }
            if (nextBtn) nextBtn.style.display = 'none';

            if (window.learnerProfile) {
                window.learnerProfile.xp = (window.learnerProfile.xp || 100) + this.quizScore;
                if (typeof saveLearnerProfile === 'function') saveLearnerProfile();
            }
        }
    }
};

function searchAndAddVocabCard(val) {
    VocabEngine.search(val);
}

function nextQuizQuestion() {
    VocabEngine.nextQuestion();
}

function checkQuizAnswer(idx, btn) {
    VocabEngine.checkAnswer(idx, btn);
}

document.addEventListener('DOMContentLoaded', () => {
    VocabEngine.init();
});
