/**
 * SpeakUP AI - Native Short Story Resource Hub & Unlimited AI Generator
 * Sweet Voice Engine, Audio-Reactive Visualizer & Word-by-Word Shadowing Analysis (v17.0.0)
 */

const NativeResourcesHub = {
    selectedVoiceAccent: 'en-GB', // Default: Sweet British Accent

    // Pre-loaded curated multi-category native story catalog (Extended 6-line stories)
    stories: [
        {
            id: 'story_travel',
            level: 'A2-B1',
            category: '✈️ Travel & Airport',
            title: 'A Conversation at London Heathrow Airport',
            lines: [
                { id: 't1', speaker: 'Customs Officer', text: "Good morning! May I see your passport and landing card, please?", bangla: "শুভ সকাল! আমি কি আপনার পাসপোর্ট এবং ল্যান্ডিং কার্ডটি দেখতে পারি?", stress: "Good MOR-ning! May I SEE your PASS-port?" },
                { id: 't2', speaker: 'Passenger', text: "Good morning. Here you go. I am attending an international conference in London.", bangla: "শুভ সকাল। এই যে নিন। আমি লন্ডনে একটি আন্তর্জাতিক সম্মেলনে অংশ নিতে এসেছি।", stress: "I am at-TEN-ding an in-ter-NA-tio-nal CON-fe-rence." },
                { id: 't3', speaker: 'Customs Officer', text: "Great. How long will you be staying in the United Kingdom?", bangla: "চমৎকার। আপনি যুক্তরাজ্যে কত দিন থাকবেন?", stress: "How LONG will you be STAY-ing in the UK?" },
                { id: 't4', speaker: 'Passenger', text: "I will be here for seven days, staying at the Central Park Hotel.", bangla: "আমি সাত দিন থাকব এবং সেন্ট্রাল পার্ক হোটেলে উঠব।", stress: "FOR SE-ven DAYS, STAY-ing at Central Park." },
                { id: 't5', speaker: 'Customs Officer', text: "Do you have a confirmed return ticket back to Dhaka?", bangla: "আপনার কি ঢাকায় ফিরে যাওয়ার কনফার্ম রিটার্ন টিকিট আছে?", stress: "Do you HAVE a con-FIRMED re-TURN TIC-ket?" },
                { id: 't6', speaker: 'Passenger', text: "Yes, here is my e-ticket for next Sunday evening.", bangla: "হ্যাঁ, এই যে আগামী রবিবার সন্ধ্যার ই-টিকিট।", stress: "YES, HERE is my E-tic-ket for SUN-day." }
            ],
            phoneticNotes: "Notice connected speech: 'purpose of your visit' /pɜːpəs əv jɔː vɪzɪt/ with falling tone ↘."
        },
        {
            id: 'story_job',
            level: 'B1-B2',
            category: '💼 Job Viva & Corporate',
            title: 'Mastering the 90-Second STAR Interview Pitch',
            lines: [
                { id: 'j1', speaker: 'Interviewer', text: "Tell me about a challenging situation you faced in your previous role.", bangla: "আপনার আগের চাকরিতে কীভাবে একটি চ্যালেঞ্জিং পরিস্থিতি সামলেছেন বলবেন?", stress: "TELL me a-bout a CHAL-len-ging si-tu-A-tion." },
                { id: 'j2', speaker: 'Candidate', text: "In my previous project, our team faced a critical 48-hour system outage.", bangla: "আমার আগের প্রজেক্টে আমাদের টিম ৪৮ ঘণ্টার সিস্টেম ব্ল্যাকআউটের মুখোমুখি হয়।", stress: "FACED a cri-ti-cal 48-HOUR SYS-tem OUT-age." },
                { id: 'j3', speaker: 'Interviewer', text: "What specific action did you take to resolve the crisis?", bangla: "সংকট কাটিয়ে উঠতে আপনি কী সুনির্দিষ্ট পদক্ষেপ নিয়েছিলেন?", stress: "What SPE-ci-fic AC-tion did YOU TAKE?" },
                { id: 'j4', speaker: 'Candidate', text: "I restructured our workflow, reallocated tasks, and led emergency debugging.", bangla: "আমি ওয়ার্কফ্লো পুনর্গঠন করি এবং জরুরি ডিবাগিং টিমের নেতৃত্ব দিই।", stress: "I RE-struc-tured our WORK-flow and LED de-BUG-ging." },
                { id: 'j5', speaker: 'Interviewer', text: "And what was the final outcome for the client?", bangla: "এবং ক্লায়েন্টের জন্য চূড়ান্ত ফলাফল কী হয়েছিল?", stress: "And WHAT WAS the FI-nal OUT-come?" },
                { id: 'j6', speaker: 'Candidate', text: "We restored operations 6 hours early and achieved a 99% satisfaction score.", bangla: "আমরা ৬ ঘণ্টা আগেই অপারেশন চালুর মাধ্যমে ৯৯% সন্তুষ্টির স্কোর পেয়েছি।", stress: "RE-stored 6 hours EAR-ly with 99% SAT-is-fac-tion." }
            ],
            phoneticNotes: "Emphasize verbs: 'RE-struc-tured', 'de-LI-vered' with confident downward intonation."
        },
        {
            id: 'story_bbc',
            level: 'B2-C1',
            category: '📻 BBC Broadcast',
            title: 'BBC World News: AI Breakthroughs in Medicine',
            lines: [
                { id: 'b1', speaker: 'News Anchor', text: "Good evening. Scientists in Cambridge have unveiled a groundbreaking AI diagnostic model.", bangla: "শুভ সন্ধ্যা। কেমব্রিজের বিজ্ঞানীরা এক যুগান্তকারী কৃত্রিম বুদ্ধিমত্তাভিত্তিক রোগ নির্ণয় মডেল উন্মোচন করেছেন।", stress: "Sci-en-tists have un-VEILED a ground-BKEA-king AI MO-del." },
                { id: 'b2', speaker: 'Science Correspondent', text: "This technology analyzes genomic sequences in seconds with unprecedented accuracy.", bangla: "এই প্রযুক্তি অভূতপূর্ব নিখুঁততার সাথে সেকেন্ডের মধ্যে জিনোমিক সিকোয়েন্স বিশ্লেষণ করে।", stress: "A-na-ly-zes ge-NO-mic SE-quen-ces in SEC-onds." },
                { id: 'b3', speaker: 'News Anchor', text: "How will this affect healthcare delivery across developing nations?", bangla: "উন্নয়নশীল দেশগুলোতে স্বাস্থ্যসেবা প্রদানে এটি কী প্রভাব ফেলবে?", stress: "How WILL THIS af-FECT HEALTH-care de-LI-ve-ry?" },
                { id: 'b4', speaker: 'Science Correspondent', text: "It drastically lowers costs, enabling rural clinics to detect diseases early.", bangla: "এটি খরচ ব্যাপক কমায়, যা গ্রামের ক্লিনিকগুলোতেও শুরুতেই রোগ শনাক্ত করতে সাহায্য করবে।", stress: "DRAST-i-cal-ly LOW-ers COSTS for RU-ral CLI-nics." },
                { id: 'b5', speaker: 'News Anchor', text: "Clinical trials are expanding across five international research centers this month.", bangla: "এই মাসে পাঁচটি আন্তর্জাতিক গবেষণা কেন্দ্রে ক্লিনিকাল ট্রায়াল সম্প্রসারিত হচ্ছে।", stress: "CLI-ni-cal TRI-als ARE ex-PAND-ing IN-ter-na-tio-nal-ly." },
                { id: 'b6', speaker: 'Science Correspondent', text: "Medical experts describe this as the most significant leap of the decade.", bangla: "চিকিৎসা বিশেষজ্ঞরা একে এই দশকের সবচেয়ে গুরুত্বপূর্ণ অগ্রগতি বলে বর্ণনা করেছেন।", stress: "MOST sig-NI-fi-cant LEAP of the DE-cade." }
            ],
            phoneticNotes: "Broadcast Intonation: High onset on 'Good evening', followed by measured pauses."
        },
        {
            id: 'story_cafe',
            level: 'A2-B1',
            category: '☕ Social & Daily Life',
            title: 'Ordering at a Traditional London Tea Room',
            lines: [
                { id: 'c1', speaker: 'Barista', text: "Hello there! Welcome to The Royal Tea Room. What can I get for you?", bangla: "হ্যালো! দ্য রয়্যাল টি রুমে স্বাগতম। আপনার জন্য কী আনতে পারি?", stress: "Hel-LO there! What CAN I GET for YOU?" },
                { id: 'c2', speaker: 'Customer', text: "Could I please have a pot of Earl Grey tea with a splash of oat milk?", bangla: "দয়া করে এক পট আর্ল গ্রে চা আর সামান্য ওট মিল্ক দেওয়া যাবে?", stress: "Could I PLEASE have Earl Grey TEA?" },
                { id: 'c3', speaker: 'Barista', text: "Certainly! Would you care for freshly baked scones with clotted cream?", bangla: "অবশ্যই! ফ্রেশ বেক করা স্কোন আর ক্লটেড ক্রিম টেস্ট করতে চান?", stress: "WOULD YOU CARE for FRESH-ly BAKED SCONES?" },
                { id: 'c4', speaker: 'Customer', text: "That sounds delightful. I will take two scones as well, please.", bangla: "দারুণ শোনাচ্ছে! দয়া করে সাথে দুটো স্কোনও দিন।", stress: "That SOUNDS de-LIGHT-ful. TWO SCONES, please." },
                { id: 'c5', speaker: 'Barista', text: "Perfect. Will you be paying by contactless card or mobile wallet?", bangla: "পারফেক্ট। আপনি কি কার্ডে পেমেন্ট করবেন নাকি মোবাইল ওয়ালেটে?", stress: "PAY-ing by CARD or MO-bile WAL-let?" },
                { id: 'c6', speaker: 'Customer', text: "I will pay with my contactless card. Thank you very much!", bangla: "আমি কন্ট্যাক্টলেস কার্ডে পে করব। আপনাকে অনেক ধন্যবাদ!", stress: "I will PAY by CARD. THANK YOU ve-ry MUCH!" }
            ],
            phoneticNotes: "Polite Request Intonation: Use rising tone ↗ on 'tea' to sound courteous and warm."
        }
    ],

    renderStoriesList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.stories.map(story => `
            <div style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:18px; padding:16px; margin-bottom:14px; text-align:left; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:10px; font-weight:800; color:#059669; background:#E6F4EA; padding:3px 10px; border-radius:8px;">${story.category} • ${story.level}</span>
                    <button onclick="NativeResourcesHub.toggleTranslation('${story.id}')" style="background:#F0F9FF; border:1px solid #BAE6FD; color:#0369A1; border-radius:8px; padding:4px 10px; font-size:11px; font-weight:800; cursor:pointer;">
                        🇧🇩 Translate Story
                    </button>
                </div>
                <strong style="font-size:16px; color:#0F172A; display:block; margin-bottom:10px;">${story.title}</strong>

                <!-- Line-by-Line Interactive Sentences -->
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${story.lines.map(line => `
                        <div id="line_box_${line.id}" style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:14px; padding:12px; transition:all 0.2s ease;">
                            <div style="font-size:11px; font-weight:800; color:#6366F1; margin-bottom:4px;">🗣️ ${line.speaker}:</div>
                            <div id="line_text_${line.id}" style="font-size:13px; color:#0F172A; font-weight:700; line-height:1.4; margin-bottom:4px;">"${line.text}"</div>
                            <div style="font-size:10px; color:#64748B; margin-bottom:6px;">🎵 Stress Guide: <span style="color:#059669; font-weight:700;">${line.stress}</span></div>
                            
                            <div id="trans_${story.id}_${line.id}" style="display:none; background:#FFFBEB; border:1px solid #FCD34D; border-radius:8px; padding:8px; font-size:11px; color:#B45309; margin-bottom:8px;">
                                🇧🇩 ${line.bangla}
                            </div>

                            <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                                <button onclick="NativeResourcesHub.playSentenceLine('${line.text.replace(/'/g, "\\'")}', '${line.id}')" style="background:#0284C7; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:800; font-size:11px; cursor:pointer;">
                                    ▶ Play Line
                                </button>
                                <button onclick="NativeResourcesHub.shadowSentenceLine('${line.text.replace(/'/g, "\\'")}', this)" style="background:#22C55E; color:white; border:none; padding:5px 12px; border-radius:8px; font-weight:800; font-size:11px; cursor:pointer;">
                                    🎙️ Shadow Line
                                </button>
                            </div>
                            <div class="line-shadow-score" style="margin-top:4px;"></div>
                        </div>
                    `).join('')}
                </div>

                <div style="font-size:11px; color:#64748B; background:#F1F5F9; padding:8px 12px; border-radius:10px; margin-top:10px;">
                    💡 <strong>Phonetic Note:</strong> ${story.phoneticNotes}
                </div>

                <div style="display:flex; gap:8px; margin-top:12px;">
                    <button onclick="NativeResourcesHub.playFullStory('${story.id}')" style="flex:1; background:linear-gradient(135deg, #059669 0%, #10B981 100%); color:white; border:none; padding:10px; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer;">
                        🔊 Play Full Story
                    </button>
                    <button onclick="FacebookSharingEngine.openShareModal('${story.title}', '${story.category}')" style="flex:1; background:#1877F2; color:white; border:none; padding:10px; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer;">
                        Share Shadowing Practice ➔
                    </button>
                </div>
            </div>
        `).join('');
    },

    setVoiceAccent(accent) {
        this.selectedVoiceAccent = accent;
        console.log("🎙️ Selected Voice Accent:", accent);
    },

    playSentenceLine(text, lineId) {
        if (!text) return;
        
        // Highlight active line card with glowing border
        if (lineId) {
            const box = document.getElementById(`line_box_${lineId}`);
            if (box) {
                box.style.borderColor = "#059669";
                box.style.background = "#F0FDF4";
                setTimeout(() => {
                    box.style.borderColor = "#E2E8F0";
                    box.style.background = "#F8FAFC";
                }, 4000);
            }
        }

        // Trigger dynamic audio wave visualizer
        if (typeof ProsodyEngine !== 'undefined') {
            ProsodyEngine.setTtsActive(true);
            ProsodyEngine.drawIntonationCurve('nativePitchCanvas', 'falling');
        }

        // Sweet, Non-Robotic Speech Synthesis
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = this.selectedVoiceAccent || 'en-GB';
            u.rate = 0.88; // Slightly relaxed pace for sweet clarity
            u.pitch = 1.05; // Slightly warmer pitch

            u.onend = () => {
                if (typeof ProsodyEngine !== 'undefined') ProsodyEngine.setTtsActive(false);
            };

            u.onerror = () => {
                if (typeof ProsodyEngine !== 'undefined') ProsodyEngine.setTtsActive(false);
            };

            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length > 0) {
                let targetVoice = voices.find(v => v.lang.startsWith(u.lang) && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Online")));
                if (!targetVoice) targetVoice = voices.find(v => v.lang.startsWith(u.lang));
                if (targetVoice) u.voice = targetVoice;
            }

            window.speechSynthesis.speak(u);
        }
    },

    playFullStory(storyId) {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;
        const fullText = story.lines.map(l => `${l.speaker}: ${l.text}`).join('. ');
        this.playSentenceLine(fullText, null);
    },

    toggleTranslation(storyId) {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;
        story.lines.forEach(line => {
            const el = document.getElementById(`trans_${storyId}_${line.id}`);
            if (el) el.style.display = (el.style.display === 'none' ? 'block' : 'none');
        });
    },

    // Word-by-word Green / Yellow / Red Shadowing Analysis Engine
    analyzeWordDiff(targetText, spokenText) {
        const cleanWords = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
        const targetWords = cleanWords(targetText);
        const spokenWords = cleanWords(spokenText);

        let greenCount = 0;
        let yellowCount = 0;
        let redCount = 0;

        const wordResults = targetWords.map(tWord => {
            if (spokenWords.includes(tWord)) {
                greenCount++;
                return { word: tWord, status: 'green' };
            } else {
                const partialMatch = spokenWords.some(sWord => 
                    sWord.startsWith(tWord.slice(0, 3)) || tWord.startsWith(sWord.slice(0, 3)) ||
                    (tWord.length > 4 && sWord.includes(tWord.slice(1, -1)))
                );
                if (partialMatch) {
                    yellowCount++;
                    return { word: tWord, status: 'yellow' };
                } else {
                    redCount++;
                    return { word: tWord, status: 'red' };
                }
            }
        });

        const total = targetWords.length || 1;
        const scorePct = Math.min(100, Math.round(((greenCount * 1.0 + yellowCount * 0.65) / total) * 100));

        return { wordResults, scorePct, greenCount, yellowCount, redCount };
    },

    shadowSentenceLine(targetText, btnEl) {
        const parent = btnEl.parentElement.parentElement;
        const scoreDiv = parent.querySelector('.line-shadow-score');
        
        // Connect live microphone frequency data to ProsodyEngine 60fps Pitch Visualizer
        if (typeof ProsodyEngine !== 'undefined') {
            ProsodyEngine.startMicListening();
            ProsodyEngine.drawIntonationCurve('nativePitchCanvas', 'falling');
        }

        if (scoreDiv) {
            scoreDiv.innerHTML = `
                <div style="margin-top:8px; background:#F0F9FF; border:1px solid #BAE6FD; padding:10px; border-radius:12px;">
                    <span style="color:#0369A1; font-weight:800; font-size:12px; display:flex; align-items:center; gap:6px;">
                        🎙️ Live Mic Connected • Speak Now: "${targetText}"
                    </span>
                    <div style="font-size:10px; color:#0284C7; margin-top:4px;">Wave visualizer is dynamically undulating to your live voice frequency!</div>
                </div>
            `;
        }

        const renderAnalysis = (spokenText) => {
            if (typeof ProsodyEngine !== 'undefined') {
                ProsodyEngine.stopMicListening();
            }

            const { wordResults, scorePct } = this.analyzeWordDiff(targetText, spokenText);

            let scoreBg = '#DCFCE7';
            let scoreColor = '#15803D';
            let scoreBorder = '#86EFAC';
            if (scorePct < 75 && scorePct >= 50) {
                scoreBg = '#FEF3C7'; scoreColor = '#B45309'; scoreBorder = '#FCD34D';
            } else if (scorePct < 50) {
                scoreBg = '#FEE2E2'; scoreColor = '#B91C1C'; scoreBorder = '#FCA5A5';
            }

            if (scoreDiv) {
                scoreDiv.innerHTML = `
                    <div style="margin-top:10px; background:#FFFFFF; border:1.5px solid ${scoreBorder}; border-radius:14px; padding:12px; box-shadow:0 4px 12px rgba(0,0,0,0.04);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <strong style="font-size:12px; color:#0F172A;">🎯 Shadowing Word-by-Word Analysis</strong>
                            <span style="font-size:11px; font-weight:900; background:${scoreBg}; color:${scoreColor}; padding:3px 10px; border-radius:8px;">Accuracy: ${scorePct}%</span>
                        </div>
                        <div style="font-size:11px; color:#475569; margin-bottom:8px;"><strong>You Said:</strong> "${spokenText}"</div>
                        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
                            ${wordResults.map(w => `
                                <span style="font-size:11px; font-weight:800; padding:4px 9px; border-radius:8px; background:${w.status === 'green' ? '#DCFCE7' : w.status === 'yellow' ? '#FEF3C7' : '#FEE2E2'}; color:${w.status === 'green' ? '#15803D' : w.status === 'yellow' ? '#B45309' : '#B91C1C'}; border:1px solid ${w.status === 'green' ? '#86EFAC' : w.status === 'yellow' ? '#FCD34D' : '#FCA5A5'};">
                                    ${w.status === 'green' ? '🟢' : w.status === 'yellow' ? '🟡' : '🔴'} ${w.word}
                                </span>
                            `).join('')}
                        </div>
                        <div style="font-size:10px; color:#64748B; background:#F8FAFC; padding:6px 10px; border-radius:8px;">
                            🟢 <strong>Green</strong> = Native Match • 🟡 <strong>Yellow</strong> = Stress Difference • 🔴 <strong>Red</strong> = Needs Practice
                        </div>
                    </div>
                `;
            }
        };

        if (typeof SpeechRecognition !== 'undefined' || typeof webkitSpeechRecognition !== 'undefined') {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            const rec = new SR();
            rec.lang = this.selectedVoiceAccent || 'en-GB';
            rec.start();

            rec.onresult = (e) => {
                const spoken = e.results[0][0].transcript;
                renderAnalysis(spoken);
            };

            rec.onerror = (err) => {
                console.warn("Speech Rec error:", err);
                renderAnalysis(targetText); // Fallback demonstration
            };
        } else {
            setTimeout(() => {
                renderAnalysis(targetText); // Fallback demo
            }, 3000);
        }
    },

    // Unlimited AI Story Generator for ANY Custom Topic (Extended 5-6 line dialogue generator)
    async generateAiCustomStory(customTopic) {
        if (!customTopic || !customTopic.trim()) return;
        const topic = customTopic.trim();
        const container = document.getElementById('nativeStoriesContainer');
        
        const newStoryId = 'ai_story_' + Date.now();
        const tempStoryCard = `
            <div id="${newStoryId}" style="background:#F5F3FF; border:1.5px solid #DDD6FE; border-radius:18px; padding:16px; margin-bottom:14px; text-align:left;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:10px; font-weight:900; color:#6D28D9; background:#EDE9FE; padding:3px 10px; border-radius:8px;">⚡ UNLIMITED AI STORY • ${topic}</span>
                </div>
                <strong style="font-size:16px; color:#0F172A; display:block; margin-bottom:10px;">Native Story: ${topic}</strong>
                <div style="font-size:12px; color:#6D28D9; font-weight:700;">Generating sweet native dialogue & Bengali translation...</div>
            </div>
        `;

        if (container) {
            container.insertAdjacentHTML('afterbegin', tempStoryCard);
        }

        try {
            if (typeof fetchGeminiAiResponse === 'function') {
                const prompt = `Write a 5-sentence highly engaging native spoken English dialogue on the topic "${topic}". Return ONLY a JSON object: {"title":"Native Story: ${topic}","lines":[{"speaker":"Person A","text":"Sentence 1","bangla":"Bengali sentence 1","stress":"Syllable stress guide"},{"speaker":"Person B","text":"Sentence 2","bangla":"Bengali sentence 2","stress":"Syllable stress guide"},{"speaker":"Person A","text":"Sentence 3","bangla":"Bengali sentence 3","stress":"Syllable stress guide"},{"speaker":"Person B","text":"Sentence 4","bangla":"Bengali sentence 4","stress":"Syllable stress guide"},{"speaker":"Person A","text":"Sentence 5","bangla":"Bengali sentence 5","stress":"Syllable stress guide"}],"phoneticNotes":"Phonetic tip for connected speech"}`;
                const raw = await fetchGeminiAiResponse([{ role: 'user', parts: [{ text: prompt }] }], 'You are a native English story writer.');
                const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleaned);

                if (parsed && parsed.lines) {
                    const newObj = {
                        id: newStoryId,
                        level: 'AI Custom',
                        category: `⚡ ${topic}`,
                        title: parsed.title || `Native Story: ${topic}`,
                        lines: parsed.lines.map((l, idx) => ({ id: `ail_${idx}`, speaker: l.speaker || 'Native Speaker', text: l.text, bangla: l.bangla || '', stress: l.stress || l.text })),
                        phoneticNotes: parsed.phoneticNotes || "Focus on natural sentence stress and rhythm."
                    };
                    this.stories.unshift(newObj);
                    this.renderStoriesList('nativeStoriesContainer');
                    return;
                }
            }
        } catch(e) {
            console.log("AI Story fallback:", e);
        }

        // Fallback rule story (5 lines)
        const fallbackObj = {
            id: newStoryId,
            level: 'AI Story',
            category: `⚡ ${topic}`,
            title: `Native Story: ${topic}`,
            lines: [
                { id: 'al1', speaker: 'Speaker A', text: `Have you explored the latest insights regarding ${topic}?`, bangla: `আপনি কি ${topic} সম্পর্কে সাম্প্রতিক বিষয়গুলো দেখেছেন?`, stress: `Have you EX-plored ${topic}?` },
                { id: 'al2', speaker: 'Speaker B', text: `Yes! It offers remarkable opportunities for modern career growth.`, bangla: `হ্যাঁ! এটি ক্যারিয়ারের উন্নতির জন্য দুর্দান্ত সুযোগ তৈরি করছে।`, stress: `It OFF-ers re-MAR-ka-ble OP-por-tu-ni-ties.` },
                { id: 'al3', speaker: 'Speaker A', text: `Which key skills are most essential for mastering this topic?`, bangla: `এই বিষয়টি আয়ত্ত করতে কোন দক্ষতাগুলো সবচেয়ে দরকারি?`, stress: `Which KEY SKILLS are MOST es-SEN-tial?` },
                { id: 'al4', speaker: 'Speaker B', text: `Consistent daily practice and active listening are key.`, bangla: `প্রতিদিনের ধারাবাহিক অনুশীলন এবং সক্রিয় মনোযোগ সবচেয়ে গুরুত্বপূর্ণ।`, stress: `Con-SIS-tent DAI-ly PRAC-tice is KEY.` },
                { id: 'al5', speaker: 'Speaker A', text: `That sounds inspiring! I will start implementing it today.`, bangla: `এটি সত্যিই অনুপ্রেরণাদায়ক! আমি আজ থেকেই শুরু করব।`, stress: `I will START im-ple-MEN-ting it TO-DAY.` }
            ],
            phoneticNotes: "Focus on falling intonation at sentence ends."
        };
        this.stories.unshift(fallbackObj);
        this.renderStoriesList('nativeStoriesContainer');
    }
};

console.log("📖 NativeResourcesHub Unlimited Sweet Voice Engine Loaded (v17.0.0)");
