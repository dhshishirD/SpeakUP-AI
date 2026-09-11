/**
 * SpeakUP AI - Word Stress & Syllable Calibration Studio Engine
 * Modeled after Module C Word Stress Visualizer (v12.0.0)
 */

const WordStressEngine = {
    activeSection: 'all',
    searchQuery: '',

    // Section A: Noun/Verb Stress Shift Pairs (30 Pairs)
    nounVerbPairs: [
        { word: "Record", banglaNoun: "নথি / রেকর্ড (Noun)", banglaVerb: "নথিভুক্ত করা / রেকর্ড করা (Verb)", syllablesNoun: [{text:"RE", stress:1}, {text:"cord", stress:0}], syllablesVerb: [{text:"re", stress:0}, {text:"CORD", stress:1}], activeMode: "noun" },
        { word: "Object", banglaNoun: "বস্তু / উদ্দেশ্য (Noun)", banglaVerb: "আপত্তি করা (Verb)", syllablesNoun: [{text:"OB", stress:1}, {text:"ject", stress:0}], syllablesVerb: [{text:"ob", stress:0}, {text:"JECT", stress:1}], activeMode: "noun" },
        { word: "Present", banglaNoun: "উপহার / বর্তমান (Noun)", banglaVerb: "উপস্থাপন করা (Verb)", syllablesNoun: [{text:"PRE", stress:1}, {text:"sent", stress:0}], syllablesVerb: [{text:"pre", stress:0}, {text:"SENT", stress:1}], activeMode: "noun" },
        { word: "Produce", banglaNoun: "কৃষি পণ্য / উৎপাদন (Noun)", banglaVerb: "উৎপাদন করা (Verb)", syllablesNoun: [{text:"PRO", stress:1}, {text:"duce", stress:0}], syllablesVerb: [{text:"pro", stress:0}, {text:"DUCE", stress:1}], activeMode: "noun" },
        { word: "Project", banglaNoun: "প্রকল্প / স্কিম (Noun)", banglaVerb: "প্রক্ষেপণ করা / পরিকল্পনা করা (Verb)", syllablesNoun: [{text:"PRO", stress:1}, {text:"ject", stress:0}], syllablesVerb: [{text:"pro", stress:0}, {text:"JECT", stress:1}], activeMode: "noun" },
        { word: "Contract", banglaNoun: "চুক্তি / অঙ্গীকার (Noun)", banglaVerb: "সংকুচিত করা / চুক্তিবদ্ধ হওয়া (Verb)", syllablesNoun: [{text:"CON", stress:1}, {text:"tract", stress:0}], syllablesVerb: [{text:"con", stress:0}, {text:"TRACT", stress:1}], activeMode: "noun" },
        { word: "Conduct", banglaNoun: "আচরণ / পরিচালনা (Noun)", banglaVerb: "পরিচালনা করা (Verb)", syllablesNoun: [{text:"CON", stress:1}, {text:"duct", stress:0}], syllablesVerb: [{text:"con", stress:0}, {text:"DUCT", stress:1}], activeMode: "noun" },
        { word: "Permit", banglaNoun: "অনুমতিপত্র (Noun)", banglaVerb: "অনুমতি দেওয়া (Verb)", syllablesNoun: [{text:"PER", stress:1}, {text:"mit", stress:0}], syllablesVerb: [{text:"per", stress:0}, {text:"MIT", stress:1}], activeMode: "noun" },
        { word: "Export", banglaNoun: "রপ্তানি দ্রব্য (Noun)", banglaVerb: "রপ্তানি করা (Verb)", syllablesNoun: [{text:"EX", stress:1}, {text:"port", stress:0}], syllablesVerb: [{text:"ex", stress:0}, {text:"PORT", stress:1}], activeMode: "noun" },
        { word: "Import", banglaNoun: "আমদানি দ্রব্য (Noun)", banglaVerb: "আমদানি করা (Verb)", syllablesNoun: [{text:"IM", stress:1}, {text:"port", stress:0}], syllablesVerb: [{text:"im", stress:0}, {text:"PORT", stress:1}], activeMode: "noun" },
        { word: "Desert", banglaNoun: "মরুভূমি (Noun)", banglaVerb: "পরিত্যাগ করা (Verb)", syllablesNoun: [{text:"DES", stress:1}, {text:"ert", stress:0}], syllablesVerb: [{text:"di", stress:0}, {text:"SERT", stress:1}], activeMode: "noun" },
        { word: "Conflict", banglaNoun: "দ্বন্দ্ব / সংঘাত (Noun)", banglaVerb: "সাংঘর্ষিক হওয়া (Verb)", syllablesNoun: [{text:"CON", stress:1}, {text:"flict", stress:0}], syllablesVerb: [{text:"con", stress:0}, {text:"FLICT", stress:1}], activeMode: "noun" },
        { word: "Subject", banglaNoun: "বিষয় / প্রজা (Noun)", banglaVerb: "অধীনস্থ করা (Verb)", syllablesNoun: [{text:"SUB", stress:1}, {text:"ject", stress:0}], syllablesVerb: [{text:"sub", stress:0}, {text:"JECT", stress:1}], activeMode: "noun" },
        { word: "Rebel", banglaNoun: "বিদ্রোহী (Noun)", banglaVerb: "বিদ্রোহ করা (Verb)", syllablesNoun: [{text:"REB", stress:1}, {text:"el", stress:0}], syllablesVerb: [{text:"ri", stress:0}, {text:"BEL", stress:1}], activeMode: "noun" },
        { word: "Progress", banglaNoun: "উন্নতি / অগ্রগতি (Noun)", banglaVerb: "অগ্রসর হওয়া (Verb)", syllablesNoun: [{text:"PRO", stress:1}, {text:"gress", stress:0}], syllablesVerb: [{text:"pro", stress:0}, {text:"GRESS", stress:1}], activeMode: "noun" },
        { word: "Decrease", banglaNoun: "হ্রাস / হ্রাস পাওয়া পরিমাণ (Noun)", banglaVerb: "হ্রাস পাওয়া (Verb)", syllablesNoun: [{text:"DE", stress:1}, {text:"crease", stress:0}], syllablesVerb: [{text:"di", stress:0}, {text:"CREASE", stress:1}], activeMode: "noun" },
        { word: "Increase", banglaNoun: "বৃদ্ধি / বৃদ্ধিপ্রাপ্ত পরিমাণ (Noun)", banglaVerb: "বৃদ্ধি পাওয়া (Verb)", syllablesNoun: [{text:"IN", stress:1}, {text:"crease", stress:0}], syllablesVerb: [{text:"in", stress:0}, {text:"CREASE", stress:1}], activeMode: "noun" },
        { word: "Insult", banglaNoun: "অপমান (Noun)", banglaVerb: "অপমান করা (Verb)", syllablesNoun: [{text:"IN", stress:1}, {text:"sult", stress:0}], syllablesVerb: [{text:"in", stress:0}, {text:"SULT", stress:1}], activeMode: "noun" },
        { word: "Suspect", banglaNoun: "সন্দেহভাজন ব্যক্তি (Noun)", banglaVerb: "সন্দেহ করা (Verb)", syllablesNoun: [{text:"SUS", stress:1}, {text:"pect", stress:0}], syllablesVerb: [{text:"suh", stress:0}, {text:"SPECT", stress:1}], activeMode: "noun" },
        { word: "Upgrade", banglaNoun: "উন্নীত সংস্করণ (Noun)", banglaVerb: "উন্নীত করা (Verb)", syllablesNoun: [{text:"UP", stress:1}, {text:"grade", stress:0}], syllablesVerb: [{text:"up", stress:0}, {text:"GRADE", stress:1}], activeMode: "noun" },
        { word: "Transfer", banglaNoun: "বদলি / স্থানান্তর (Noun)", banglaVerb: "স্থানান্তর করা (Verb)", syllablesNoun: [{text:"TRANS", stress:1}, {text:"fer", stress:0}], syllablesVerb: [{text:"trans", stress:0}, {text:"FER", stress:1}], activeMode: "noun" },
        { word: "Protest", banglaNoun: "প্রতিবাদ (Noun)", banglaVerb: "প্রতিবাদ করা (Verb)", syllablesNoun: [{text:"PRO", stress:1}, {text:"test", stress:0}], syllablesVerb: [{text:"pro", stress:0}, {text:"TEST", stress:1}], activeMode: "noun" },
        { word: "Digest", banglaNoun: "সংক্ষিপ্ত বিবরণ (Noun)", banglaVerb: "হজম করা (Verb)", syllablesNoun: [{text:"DI", stress:1}, {text:"gest", stress:0}], syllablesVerb: [{text:"dai", stress:0}, {text:"JEST", stress:1}], activeMode: "noun" },
        { word: "Refuse", banglaNoun: "বর্জ্য পদার্থ (Noun)", banglaVerb: "প্রত্যাখ্যান করা (Verb)", syllablesNoun: [{text:"REF", stress:1}, {text:"use", stress:0}], syllablesVerb: [{text:"ri", stress:0}, {text:"FYUZ", stress:1}], activeMode: "noun" },
        { word: "Survey", banglaNoun: "জরিপ (Noun)", banglaVerb: "জরিপ করা (Verb)", syllablesNoun: [{text:"SUR", stress:1}, {text:"vey", stress:0}], syllablesVerb: [{text:"sur", stress:0}, {text:"VEY", stress:1}], activeMode: "noun" },
        { word: "Overflow", banglaNoun: "উপচে পড়া অংশ (Noun)", banglaVerb: "উপচে পড়া (Verb)", syllablesNoun: [{text:"OVER", stress:1}, {text:"flow", stress:0}], syllablesVerb: [{text:"over", stress:0}, {text:"FLOW", stress:1}], activeMode: "noun" },
        { word: "Escort", banglaNoun: "নিরাপত্তা প্রহরী (Noun)", banglaVerb: "পাহারা দিয়ে নিয়ে যাওয়া (Verb)", syllablesNoun: [{text:"ES", stress:1}, {text:"cort", stress:0}], syllablesVerb: [{text:"is", stress:0}, {text:"CORT", stress:1}], activeMode: "noun" },
        { word: "Extract", banglaNoun: "নির্যাস / উদ্ধৃতি (Noun)", banglaVerb: "বের করে আনা (Verb)", syllablesNoun: [{text:"EX", stress:1}, {text:"tract", stress:0}], syllablesVerb: [{text:"ik", stress:0}, {text:"STRACT", stress:1}], activeMode: "noun" },
        { word: "Contrast", banglaNoun: "বৈপরিত্য (Noun)", banglaVerb: "তুলনা করা / বৈপরিত্য দেখানো (Verb)", syllablesNoun: [{text:"CON", stress:1}, {text:"trast", stress:0}], syllablesVerb: [{text:"kun", stress:0}, {text:"TRAST", stress:1}], activeMode: "noun" }
    ],

    // Section B: Suffix Rules (-tion, -ic, -ity)
    suffixRulesList: [
        { word: "Education", bangla: "শিক্ষা", syllables: [{text:"ed", stress:0}, {text:"u", stress:0}, {text:"CA", stress:1}, {text:"tion", stress:0}], rule: "Stress syllable before -tion" },
        { word: "Economic", bangla: "অর্থনৈতিক", syllables: [{text:"e", stress:0}, {text:"co", stress:0}, {text:"NOM", stress:1}, {text:"ic", stress:0}], rule: "Stress syllable before -ic" },
        { word: "Photography", bangla: "আলোকচিত্রশিল্প", syllables: [{text:"pho", stress:0}, {text:"TOG", stress:1}, {text:"ra", stress:0}, {text:"phy", stress:0}], rule: "Stress 3rd from end" },
        { word: "Photograph", bangla: "ছবি / আলোকচিত্র", syllables: [{text:"PHO", stress:1}, {text:"to", stress:0}, {text:"graph", stress:0}], rule: "Primary on 1st" },
        { word: "Photographic", bangla: "আলোকচিত্র সংক্রান্ত", syllables: [{text:"pho", stress:0}, {text:"to", stress:0}, {text:"GRAPH", stress:1}, {text:"ic", stress:0}], rule: "Stress before -ic" },
        { word: "Curiosity", bangla: "কৌতূহল", syllables: [{text:"cu", stress:0}, {text:"ri", stress:0}, {text:"OS", stress:1}, {text:"i", stress:0}, {text:"ty", stress:0}], rule: "Stress before -ity" },
        { word: "Decision", bangla: "সিদ্ধান্ত", syllables: [{text:"de", stress:0}, {text:"CI", stress:1}, {text:"sion", stress:0}], rule: "Stress before -sion" },
        { word: "Electricity", bangla: "বিদ্যুৎ", syllables: [{text:"e", stress:0}, {text:"lec", stress:0}, {text:"TRIC", stress:1}, {text:"i", stress:0}, {text:"ty", stress:0}], rule: "Stress before -ity" }
    ],

    // Section C: Academic & Professional
    academicList: [
        { word: "Development", bangla: "উন্নয়ন", syllables: [{text:"de", stress:0}, {text:"VEL", stress:1}, {text:"op", stress:0}, {text:"ment", stress:0}] },
        { word: "Comfortable", bangla: "আরামদায়ক", syllables: [{text:"COMF", stress:1}, {text:"ort", stress:0}, {text:"a", stress:0}, {text:"ble", stress:0}] },
        { word: "Environment", bangla: "পরিবেশ", syllables: [{text:"en", stress:0}, {text:"VI", stress:1}, {text:"ron", stress:0}, {text:"ment", stress:0}] },
        { word: "Certificate", bangla: "সনদপত্র", syllables: [{text:"cer", stress:0}, {text:"TIF", stress:1}, {text:"i", stress:0}, {text:"cate", stress:0}] },
        { word: "Democracy", bangla: "গণতন্ত্র", syllables: [{text:"de", stress:0}, {text:"MOC", stress:1}, {text:"ra", stress:0}, {text:"cy", stress:0}] }
    ],

    // Section D: Compound Words
    compoundList: [
        { word: "Blackboard", bangla: "ব্ল্যাকবোর্ড / লেখার বোর্ড", syllables: [{text:"BLACK", stress:1}, {text:"board", stress:0}] },
        { word: "Software", bangla: "সফটওয়্যার / কম্পিউটার প্রোগ্রাম", syllables: [{text:"SOFT", stress:1}, {text:"ware", stress:0}] },
        { word: "Passport", bangla: "পাসপোর্ট / ছাড়পত্র", syllables: [{text:"PASS", stress:1}, {text:"port", stress:0}] }
    ],

    // Section E: Prefix Shift & Tone Rules
    prefixList: [
        { word: "Unbelievable", bangla: "অবিশ্বাস্য", syllables: [{text:"UN", stress:2}, {text:"be", stress:0}, {text:"LIEV", stress:1}, {text:"a", stress:0}, {text:"ble", stress:0}] },
        { word: "Rewrite", bangla: "পুনরায় লেখা", syllables: [{text:"RE", stress:2}, {text:"WRITE", stress:1}] }
    ],

    init() {
        console.log("🎙️ WordStressEngine Initializing...");
        this.renderCards();
    },

    setSection(secId) {
        this.activeSection = secId;
        const buttons = document.querySelectorAll('#wordStressSectionPills button');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-sec') === secId) {
                btn.style.background = "#6366F1";
                btn.style.color = "#FFFFFF";
                btn.style.borderColor = "#4F46E5";
            } else {
                btn.style.background = "#F1F5F9";
                btn.style.color = "#475569";
                btn.style.borderColor = "#CBD5E1";
            }
        });
        this.renderCards();
    },

    toggleNounVerbMode(index, mode) {
        if (this.nounVerbPairs[index]) {
            this.nounVerbPairs[index].activeMode = mode;
            this.renderCards();
        }
    },

    renderCards() {
        const container = document.getElementById('wordStressCardsContainer');
        if (!container) return;

        let html = "";
        const query = (this.searchQuery || "").trim().toLowerCase();

        // 1. Render Section A: Noun/Verb Shifts
        if (this.activeSection === 'all' || this.activeSection === 'secA') {
            const list = query ? this.nounVerbPairs.filter(p => p.word.toLowerCase().includes(query)) : this.nounVerbPairs;
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const isNoun = item.activeMode === 'noun';
                const currentBangla = isNoun ? item.banglaNoun : item.banglaVerb;
                const currentSyls = isNoun ? item.syllablesNoun : item.syllablesVerb;

                html += `
                    <div class="vocab-card-pro" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:18px; padding:16px; margin-bottom:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <div>
                                <span style="font-size:10px; background:#DCFCE7; color:#15803D; font-weight:900; padding:2px 8px; border-radius:6px; border:1px solid #86EFAC;">✨ STUDIO VERIFIED Sec A</span>
                                <strong style="font-size:18px; color:#0F172A; display:block; margin-top:2px;">${item.word}</strong>
                                <span style="font-size:11px; color:#64748B;">${currentBangla}</span>
                            </div>
                            <div style="display:flex; gap:4px; background:#F1F5F9; padding:3px; border-radius:10px; border:1px solid #CBD5E1;">
                                <button onclick="WordStressEngine.toggleNounVerbMode(${i}, 'noun')" style="background:${isNoun ? '#059669' : 'none'}; color:${isNoun ? 'white' : '#64748B'}; border:none; padding:4px 10px; border-radius:8px; font-weight:800; font-size:11px; cursor:pointer;">Noun</button>
                                <button onclick="WordStressEngine.toggleNounVerbMode(${i}, 'verb')" style="background:${!isNoun ? '#2563EB' : 'none'}; color:${!isNoun ? 'white' : '#64748B'}; border:none; padding:4px 10px; border-radius:8px; font-weight:800; font-size:11px; cursor:pointer;">Verb</button>
                            </div>
                        </div>

                        <!-- Syllable Stress Pills -->
                        <div style="display:flex; gap:6px; margin:10px 0;">
                            ${currentSyls.map(s => {
                                let bg = s.stress === 1 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#F1F5F9';
                                if (!isNoun && s.stress === 1) bg = 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
                                let color = s.stress === 1 ? '#FFFFFF' : '#475569';
                                let border = s.stress === 1 ? '#047857' : '#CBD5E1';
                                return `<div style="background:${bg}; border:1px solid ${border}; color:${color}; padding:6px 14px; border-radius:10px; font-weight:800; font-size:13px;">${s.text}</div>`;
                            }).join('')}
                        </div>

                        <button onclick="speakOut('${item.word}')" style="width:100%; background:#F8FAFC; border:1.5px solid #CBD5E1; color:#334155; padding:8px; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer;">🔊 Hear Stressed Pronunciation (${isNoun ? 'Noun' : 'Verb'})</button>
                    </div>
                `;
            }
        }

        // 2. Render Section B: Suffix Rules
        if (this.activeSection === 'all' || this.activeSection === 'secB') {
            const list = query ? this.suffixRulesList.filter(s => s.word.toLowerCase().includes(query)) : this.suffixRulesList;
            for (let item of list) {
                html += this.renderGenericStressCard(item, "Sec B (Suffix Rules)");
            }
        }

        // 3. Render Section C: Academic & Professional
        if (this.activeSection === 'all' || this.activeSection === 'secC') {
            const list = query ? this.academicList.filter(s => s.word.toLowerCase().includes(query)) : this.academicList;
            for (let item of list) {
                html += this.renderGenericStressCard(item, "Sec C (Academic)");
            }
        }

        // 4. Render Section D: Compound Words
        if (this.activeSection === 'all' || this.activeSection === 'secD') {
            const list = query ? this.compoundList.filter(s => s.word.toLowerCase().includes(query)) : this.compoundList;
            for (let item of list) {
                html += this.renderGenericStressCard(item, "Sec D (Compound)");
            }
        }

        // 5. Render Section E: Prefix Shifts
        if (this.activeSection === 'all' || this.activeSection === 'secE') {
            const list = query ? this.prefixList.filter(s => s.word.toLowerCase().includes(query)) : this.prefixList;
            for (let item of list) {
                html += this.renderGenericStressCard(item, "Sec E (Prefix)");
            }
        }

        container.innerHTML = html || `<div style="text-align:center; padding:30px; color:#64748B; font-weight:700;">No studio words found for "${query}". Try searching in Unlimited AI Lookup bar above!</div>`;
    },

    renderGenericStressCard(item, secLabel) {
        return `
            <div class="vocab-card-pro" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:18px; padding:16px; margin-bottom:12px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div>
                        <span style="font-size:10px; background:#DCFCE7; color:#15803D; font-weight:900; padding:2px 8px; border-radius:6px; border:1px solid #86EFAC;">✨ STUDIO VERIFIED ${secLabel}</span>
                        <strong style="font-size:18px; color:#0F172A; display:block; margin-top:2px;">${item.word}</strong>
                        <span style="font-size:11px; color:#64748B;">${item.bangla}</span>
                    </div>
                </div>
                <!-- Syllable Stress Pills -->
                <div style="display:flex; gap:6px; margin:10px 0;">
                    ${item.syllables.map(s => {
                        let bg = s.stress === 1 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : (s.stress === 2 ? 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' : '#F1F5F9');
                        let color = s.stress > 0 ? '#FFFFFF' : '#475569';
                        let border = s.stress === 1 ? '#047857' : (s.stress === 2 ? '#0369A1' : '#CBD5E1');
                        return `<div style="background:${bg}; border:1px solid ${border}; color:${color}; padding:6px 14px; border-radius:10px; font-weight:800; font-size:13px;">${s.text}</div>`;
                    }).join('')}
                </div>
                <button onclick="speakOut('${item.word}')" style="width:100%; background:#F8FAFC; border:1.5px solid #CBD5E1; color:#334155; padding:8px; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer;">🔊 Hear Stressed Pronunciation</button>
            </div>
        `;
    },

    async handleStudioSearch(val) {
        this.searchQuery = val;
        this.renderCards();

        if (val && val.trim().length > 2) {
            const card = document.getElementById('wordStressAiLookupCard');
            if (card) {
                card.style.display = 'block';
                document.getElementById('wsAiWord').innerText = val.trim();
                document.getElementById('wsAiIpa').innerText = 'Analyzing CMUDict...';
            }
            if (typeof CMUDictEngine !== 'undefined') {
                const res = await CMUDictEngine.lookupWord(val);
                if (res && card) {
                    document.getElementById('wsAiWord').innerText = res.word;
                    document.getElementById('wsAiIpa').innerText = res.ipa || '/--/';
                    document.getElementById('wsAiSyllables').innerHTML = CMUDictEngine.renderSyllableStressHTML(res.syllables);
                }
            }
        } else {
            const card = document.getElementById('wordStressAiLookupCard');
            if (card) card.style.display = 'none';
        }
    }
};

console.log("🎙️ WordStressEngine Loaded (v12.0.0)");
