/**
 * SpeakUP AI - 60-Day Bangladeshi Learner Master Curriculum Engine
 * Version: 20.0.0
 * 
 * Provides day-by-day structured progression, diagnostic tips, studio launches,
 * local storage + Supabase persistence, phase filtering, and roadmap UI rendering.
 */

window.SpeakUPCurriculum = (function() {
    const STORAGE_KEY = 'speakup_curriculum_progress_v1';
    
    // Complete 60-Day Catalog tailored for BD Learners
    const CURRICULUM_DATA = [
        // PHASE 1: Sound Foundation & MTI Sound Elimination (Days 1–15)
        {
            day: 1, phase: 1, category: "Phonetics & MTI", targetEngine: "ipa_lab", targetSound: "/v/", xpAward: 100,
            titleEn: "The /v/ vs /b/ Sound Drill", titleBn: "/v/ এবং /b/ উচ্চারণের সঠিক নিয়ম",
            diagnosticTipBn: "Bangladeshi learners standardly confuse /v/ with /b/, turning 'Very' into 'Bery'. Place upper teeth gently on your lower lip and blow air for /v/.",
            drillPrompt: "Say clearly: 'Victory in daily voice practice is very valuable.'"
        },
        {
            day: 2, phase: 1, category: "Phonetics & MTI", targetEngine: "ipa_lab", targetSound: "/f/", xpAward: 100,
            titleEn: "The /f/ vs /p/ Friction Fix", titleBn: "/f/ এবং /p/ ঘর্ষণ ধ্বনি অনুশীলন",
            diagnosticTipBn: "Don't press your lips together for /f/. Touch upper teeth to lower lip for 'Fine' instead of bilabial 'Pine'.",
            drillPrompt: "Say clearly: 'Five fine friends perform phonetic speech flawlessly.'"
        },
        {
            day: 3, phase: 1, category: "Phonetics & MTI", targetEngine: "word_stress", targetSound: "/ʃ/", xpAward: 100,
            titleEn: "The /s/ vs /ʃ/ Distinctions", titleBn: "/s/ এবং /ʃ/ (স ও শ) পার্থক্যকরণ",
            diagnosticTipBn: "Many BD learners say 'See' when they mean 'She'. Pull your tongue back slightly for the unvoiced /ʃ/ sound.",
            drillPrompt: "Say clearly: 'She sells sea shells on the shiny sea shore.'"
        },
        {
            day: 4, phase: 1, category: "Phonetics & MTI", targetEngine: "ipa_lab", targetSound: "/θ/", xpAward: 100,
            titleEn: "Dental Fricative /θ/ (Unvoiced)", titleBn: "জিহ্বার ডগা দিয়ে /θ/ (Think) উচ্চারণ",
            diagnosticTipBn: "Do not say 'Tink' or 'Think' with teeth closed. Place tip of tongue between your upper and lower teeth.",
            drillPrompt: "Say clearly: 'I think thirty-three thousand people thought deeply.'"
        },
        {
            day: 5, phase: 1, category: "Phonetics & MTI", targetEngine: "ipa_lab", targetSound: "/ð/", xpAward: 100,
            titleEn: "Dental Fricative /ð/ (Voiced)", titleBn: "সঘোষ দন্ত্য ধ্বনি /ð/ (This, That) চর্চা",
            diagnosticTipBn: "Similar to /θ/, put tongue tip between teeth but vibrate your vocal cords for 'This', 'That', and 'Brother'.",
            drillPrompt: "Say clearly: 'This father and that mother live together peacefully.'"
        },
        {
            day: 6, phase: 1, category: "Phonetics & MTI", targetEngine: "word_stress", targetSound: "Silent", xpAward: 100,
            titleEn: "Silent Letters in English", titleBn: "ইংরেজি অনুচ্চারিত বর্ণমালা (Silent Letters)",
            diagnosticTipBn: "Avoid pronouncing every written letter! Don't pronounce 'b' in subtle/debt, or 'd' in Wednesday.",
            drillPrompt: "Say clearly: 'On Wednesday, the honest plumber examined the subtle debt.'"
        },
        {
            day: 7, phase: 1, category: "Phonetics & MTI", targetEngine: "ipa_lab", targetSound: "/iː/", xpAward: 100,
            titleEn: "Vowel Duration: Short /ɪ/ vs Long /iː/", titleBn: "হ্রস্ব ও দীর্ঘ স্বরধ্বনি (Ship vs Sheep)",
            diagnosticTipBn: "Short /ɪ/ is quick ('Ship'), while long /iː/ smiles and stretches ('Sheep'). Don't confuse 'Live' and 'Leave'.",
            drillPrompt: "Say clearly: 'The ship carries sheep across the deep blue sea.'"
        },
        {
            day: 8, phase: 1, category: "Phonetics & MTI", targetEngine: "ipa_lab", targetSound: "/uː/", xpAward: 100,
            titleEn: "Vowel Duration: Short /ʊ/ vs Long /uː/", titleBn: "হ্রস্ব ও দীর্ঘ উ-ধ্বনি (Full vs Fool)",
            diagnosticTipBn: "'Full' uses a relaxed short vowel, whereas 'Fool' rounds the lips firmly. Precision prevents miscommunication.",
            drillPrompt: "Say clearly: 'The good cook pulled the fool away from the full room.'"
        },
        {
            day: 9, phase: 1, category: "Phonetics & MTI", targetEngine: "ai_tutor", targetSound: "Fluency", xpAward: 100,
            titleEn: "Daily Self-Introduction without MTI", titleBn: "আঞ্চলিকতা মুক্ত আত্মপরিচয় প্রদান",
            diagnosticTipBn: "Speak 4 sentences introducing your name, hometown, and passion without dropping final consonants or MTI sounds.",
            drillPrompt: "Speak: 'Hello! I am [Name] from [Hometown]. I am passionate about technology and communication.'"
        },
        {
            day: 10, phase: 1, category: "Phonetics & MTI", targetEngine: "ai_tutor", targetSound: "Greeting", xpAward: 100,
            titleEn: "Professional Greetings & Tone Warm-up", titleBn: "মার্জিত অভিবাদন ও প্রাতিষ্ঠানিক কণ্ঠস্বর",
            diagnosticTipBn: "Avoid abrupt greetings like 'Tell me'. Use polite rising intonation with 'Good morning, how may I assist you today?'",
            drillPrompt: "Speak: 'Good morning! It is a pleasure to meet you today.'"
        },
        {
            day: 11, phase: 1, category: "Phonetics & MTI", targetEngine: "ipa_lab", targetSound: "Finals", xpAward: 100,
            titleEn: "Ending Consonant Sounds (/t/, /d/, /k/)", titleBn: "শব্দের শেষ বর্ণমালার স্পষ্ট উচ্চারণ",
            diagnosticTipBn: "Bangladeshi speakers often drop ending stop sounds. Clearly release the final /t/ in 'Cat' and /k/ in 'Work'.",
            drillPrompt: "Say clearly: 'Robert worked late at night to complete the exact project.'"
        },
        {
            day: 12, phase: 1, category: "Phonetics & MTI", targetEngine: "word_stress", targetSound: "-ed", xpAward: 100,
            titleEn: "Past Tense Regular Endings (/t/, /d/, /ɪd/)", titleBn: "অতীতকালের -ed উচ্চারণের ৩টি নিয়ম",
            diagnosticTipBn: "-ed isn't always pronounced 'ed'! 'Worked' ends in /t/, 'Played' ends in /d/, and 'Wanted' ends in /ɪd/.",
            drillPrompt: "Say clearly: 'She walked to school, played football, and wanted ice cream.'"
        },
        {
            day: 13, phase: 1, category: "Phonetics & MTI", targetEngine: "ai_tutor", targetSound: "Descriptive", xpAward: 100,
            titleEn: "Describing Your Hometown", titleBn: "নিজের শহর বা গ্রামের সাবলীল বর্ণনা",
            diagnosticTipBn: "Describe 3 key features of your home district in Bangladesh using rich adjectives and correct /v/ and /f/ sounds.",
            drillPrompt: "Speak: 'My hometown is famous for its vibrant culture, green landscapes, and welcoming people.'"
        },
        {
            day: 14, phase: 1, category: "Phonetics & MTI", targetEngine: "ai_tutor", targetSound: "Routine", xpAward: 100,
            titleEn: "Daily Routine & Time Expressions", titleBn: "দৈনন্দিন কাজের বিবরণ ও সময় প্রকাশ",
            diagnosticTipBn: "Practice smooth transitions between morning, afternoon, and evening tasks without unnecessary pauses.",
            drillPrompt: "Speak: 'Every morning I wake up at six, review my goals, and prepare for productive work.'"
        },
        {
            day: 15, phase: 1, category: "Phonetics & MTI", targetEngine: "diagnostic", targetSound: "Capstone", xpAward: 200,
            titleEn: "Phase 1 Capstone Test: 10 MTI Sentences", titleBn: "ফেজ ১ ক্যাপস্টোন পরীক্ষা: ১০টি ফনেটিক চ্যালেন্জ",
            diagnosticTipBn: "Full assessment of your /v/, /f/, /θ/, /ð/, /s/, and /ʃ/ sounds. Scored live by the diagnostic engine.",
            drillPrompt: "Complete the 10 MTI Challenge sentence evaluation in the Diagnostic Engine."
        },

        // PHASE 2: Rhythm, Word Stress & Sentence Grammar Repair (Days 16–30)
        {
            day: 16, phase: 2, category: "Grammar & Rhythm", targetEngine: "word_stress", targetSound: "Noun/Verb", xpAward: 120,
            titleEn: "Word Stress: Noun vs Verb Syllable Shifts", titleBn: "বিশেষ্য ও ক্রিয়াপদের শব্দের স্ট্রেস পরিবর্তন",
            diagnosticTipBn: "Nouns stress the FIRST syllable (`REcord`), while Verbs stress the SECOND syllable (`reCORD`).",
            drillPrompt: "Say clearly: 'Please REcord this video so we have a permanent reCORD.'"
        },
        {
            day: 17, phase: 2, category: "Grammar & Rhythm", targetEngine: "word_stress", targetSound: "Suffixes", xpAward: 120,
            titleEn: "Suffix Stress Rules (-tion, -ity, -ic)", titleBn: "-tion, -ity সাফিক্স যুক্ত শব্দের সঠিক স্ট্রেস",
            diagnosticTipBn: "Words ending in `-tion` stress the syllable right BEFORE `-tion` (e.g. EduCA-tion, InforMA-tion).",
            drillPrompt: "Say clearly: 'EduCATION and CommuniCATION create endless OPPORtunity.'"
        },
        {
            day: 18, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Stative", xpAward: 120,
            titleEn: "Eliminating 'I am agree' & Stative Errors", titleBn: "'I am agree' সহ কমন ব্যাকরণ ভুল দূরীকরণ",
            diagnosticTipBn: "Never say 'I am agree'! Say 'I agree' or 'I am in agreement'. 'Agree' is already a verb.",
            drillPrompt: "Speak: 'I completely agree with your proposal because it solves our primary challenge.'"
        },
        {
            day: 19, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Prepositions", xpAward: 120,
            titleEn: "Correcting Preposition Overuse", titleBn: "অপ্রয়োজনীয় প্রিপজিশন ব্যবহার বন্ধকরণ",
            diagnosticTipBn: "Don't say 'discuss about the topic' or 'order for food'. Say 'discuss the topic' and 'order food'.",
            drillPrompt: "Speak: 'We will discuss the strategy today and order dinner afterwards.'"
        },
        {
            day: 20, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Tenses", xpAward: 120,
            titleEn: "Present Perfect vs Past Simple Storytelling", titleBn: "গল্প বলায় অতীত ও পুরাঘটিত বর্তমানের সঠিক প্রয়োগ",
            diagnosticTipBn: "Use Past Simple for finished specific times ('Yesterday I saw') and Present Perfect for life experience ('I have seen').",
            drillPrompt: "Speak: 'I have visited Cox’s Bazar three times, and last year I enjoyed a memorable sunset there.'"
        },
        {
            day: 21, phase: 2, category: "Grammar & Rhythm", targetEngine: "native_stories", targetSound: "SentenceStress", xpAward: 120,
            titleEn: "Sentence Stress: Content vs Function Words", titleBn: "বাক্যের মূল শব্দের গুরুত্ব ও রিদম মেকিং",
            diagnosticTipBn: "Stress nouns, main verbs, and adjectives. Glide quickly over articles, prepositions, and pronouns.",
            drillPrompt: "Shadow pitch contour: 'GREAT LEADERS EMPOWER THEIR TEAMS TO ACHIEVE EXTRAORDINARY GOALS.'"
        },
        {
            day: 22, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "STAR", xpAward: 120,
            titleEn: "Master the STAR Framework", titleBn: "STAR মেথডে পেশাদার উত্তর প্রদান (Situation, Task, Action, Result)",
            diagnosticTipBn: "Structure interview answers: Situation (context), Task (goal), Action (what YOU did), Result (quantifiable outcome).",
            drillPrompt: "Speak: 'When our project faced a deadline, I reorganized the workflow, resulting in a 20% faster delivery.'"
        },
        {
            day: 23, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Service", xpAward: 120,
            titleEn: "Ordering at a Restaurant / Cafe Pitch", titleBn: "রেস্তোরাঁ ও ক্যাফেতে মার্জিত কথোপকথন",
            diagnosticTipBn: "Use polite phrasing: 'I would like to order...' or 'Could I please have...' instead of direct imperatives.",
            drillPrompt: "Speak: 'Hello! I would like to order a black coffee and a fresh croissant, please.'"
        },
        {
            day: 24, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Politeness", xpAward: 120,
            titleEn: "Direct vs Polite Indirect Questions", titleBn: "পরোক্ষ প্রশ্নের মাধ্যমে ভদ্রতা প্রকাশ",
            diagnosticTipBn: "Instead of 'Where is the room?', ask 'Could you please tell me where the conference room is located?'",
            drillPrompt: "Speak: 'Could you kindly let me know when the afternoon session will begin?'"
        },
        {
            day: 25, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Disagreement", xpAward: 120,
            titleEn: "Expressing Agreement & Polite Disagreement", titleBn: "পেশাদার দ্বিমত ও সম্মত পোষণের কায়দা",
            diagnosticTipBn: "Softening disagreement: 'I see your point, however, we should also consider...' maintains professional rapport.",
            drillPrompt: "Speak: 'I understand your perspective, but we might achieve better efficiency with an alternative approach.'"
        },
        {
            day: 26, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Opinion", xpAward: 120,
            titleEn: "Expressing Opinions with Nuance", titleBn: "সূক্ষ্মতা ও দৃঢ়তার সাথে মতামত ব্যক্তকরণ",
            diagnosticTipBn: "Vary your openers: 'From my standpoint', 'It appears to me that', 'The evidence suggests'.",
            drillPrompt: "Speak: 'From my standpoint, investing in renewable energy is crucial for long-term sustainability.'"
        },
        {
            day: 27, phase: 2, category: "Grammar & Rhythm", targetEngine: "native_stories", targetSound: "Narrative", xpAward: 120,
            titleEn: "Describing Memories & Past Experiences", titleBn: "অতীত স্মৃতি ও অভিজ্ঞতার প্রাঞ্জল বিবরণ",
            diagnosticTipBn: "Use expressive intonation to convey emotion when recounting an inspiring childhood or academic memory.",
            drillPrompt: "Shadow story line: 'I still vividly remember the day I received my university admission letter.'"
        },
        {
            day: 28, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Comparison", xpAward: 120,
            titleEn: "Comparing Places & Career Options", titleBn: "স্থান ও কর্মক্ষেত্রের তুলনামূলক আলোচনা",
            diagnosticTipBn: "Use comparative structures smoothly: 'significantly more impactful than', 'far preferable to'.",
            drillPrompt: "Speak: 'Working in a fast-paced environment is significantly more rewarding for my skill development.'"
        },
        {
            day: 29, phase: 2, category: "Grammar & Rhythm", targetEngine: "ai_tutor", targetSound: "Advice", xpAward: 120,
            titleEn: "Giving Recommendations & Advice", titleBn: "পরামর্শ প্রদান ও কন্ডিশনাল বাক্যের সঠিক ব্যবহার",
            diagnosticTipBn: "Use second conditional for hypothetical advice: 'If I were in your position, I would focus on public speaking.'",
            drillPrompt: "Speak: 'If I were in your position, I would prioritize building a strong daily vocabulary habit.'"
        },
        {
            day: 30, phase: 2, category: "Grammar & Rhythm", targetEngine: "diagnostic", targetSound: "Capstone2", xpAward: 250,
            titleEn: "Phase 2 Capstone Fluency & Rhythm Test", titleBn: "ফেজ ২ ক্যাপস্টোন পরীক্ষা: ৩ মিনিটের রিদম ও ব্যাকরণ টেস্ট",
            diagnosticTipBn: "3-minute narrative evaluation scoring your word stress, stative verb corrections, and STAR structure.",
            drillPrompt: "Complete the Phase 2 Capstone evaluation in the Diagnostic Engine."
        },

        // PHASE 3: Connected Speech, Intonation Curves & IELTS Monologues (Days 31–45)
        {
            day: 31, phase: 3, category: "Connected Speech & IELTS", targetEngine: "native_stories", targetSound: "Linking", xpAward: 150,
            titleEn: "Connected Speech: Consonant to Vowel", titleBn: "শব্দের যুক্ত উচ্চারণ (Consonant to Vowel Linking)",
            diagnosticTipBn: "Native speakers link final consonants to starting vowels. 'An apple' sounds like 'a-napple'.",
            drillPrompt: "Shadow curve: 'Turn off the light and pick up an apple.'"
        },
        {
            day: 32, phase: 3, category: "Connected Speech & IELTS", targetEngine: "native_stories", targetSound: "Intrusive", xpAward: 150,
            titleEn: "Connected Speech: Intrusive /r/, /w/, /j/", titleBn: "শব্দের মধ্যে অতিরিক্ত ধ্বনি সংযোগ (/r/, /w/, /j/)",
            diagnosticTipBn: "When two vowels meet, insert subtle intrusive sounds: 'Law and order' -> 'Law-r-and order', 'Go out' -> 'Go-w-out'.",
            drillPrompt: "Shadow curve: 'I saw an interesting idea about media and art.'"
        },
        {
            day: 33, phase: 3, category: "Connected Speech & IELTS", targetEngine: "native_stories", targetSound: "FallingTone", xpAward: 150,
            titleEn: "Intonation: Falling Tone for Statements", titleBn: "বিবৃতিমূলক বাক্যে নামতা স্বর (Falling Intonation)",
            diagnosticTipBn: "Drop your voice pitch at the end of definitive statements and WH-questions to sound confident.",
            drillPrompt: "Shadow pitch: 'Our team successfully completed the final project today.'"
        },
        {
            day: 34, phase: 3, category: "Connected Speech & IELTS", targetEngine: "native_stories", targetSound: "RisingTone", xpAward: 150,
            titleEn: "Intonation: Rising Tone for Yes/No Questions", titleBn: "প্রশ্নবোধক বাক্যে উঠতি স্বর (Rising Intonation)",
            diagnosticTipBn: "Raise pitch at the end of Yes/No questions to indicate curiosity and invitation to respond.",
            drillPrompt: "Shadow pitch: 'Are you planning to join the international conference tomorrow?'"
        },
        {
            day: 35, phase: 3, category: "Connected Speech & IELTS", targetEngine: "native_stories", targetSound: "FallRise", xpAward: 150,
            titleEn: "Intonation: Fall-Rise Tone for Polite Reservation", titleBn: "অনুরোধ ও মৃদু দ্বিমতে পতন-উত্থান স্বর (Fall-Rise)",
            diagnosticTipBn: "A fall-rise contour indicates partial agreement or hesitation: 'I agree with the goal, but...'",
            drillPrompt: "Shadow pitch: 'I understand your point, but the budget might be limited.'"
        },
        {
            day: 36, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ielts_studio", targetSound: "Part1", xpAward: 150,
            titleEn: "IELTS Part 1: Warm-up Questions", titleBn: "IELTS পার্ট ১: ব্যক্তিগত বিষয়ভিত্তিক প্রশ্নের উত্তর",
            diagnosticTipBn: "Give 2-3 sentence answers without simple 'Yes/No'. Add a reason and an example for Band 7.0+.",
            drillPrompt: "Record IELTS Part 1: 'Do you prefer working individually or in a team? Why?'"
        },
        {
            day: 37, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ielts_studio", targetSound: "CueCard1", xpAward: 150,
            titleEn: "IELTS Part 2: Cue Card 1 - Describe a Person", titleBn: "IELTS পার্ট ২: ব্যক্তিত্ব বর্ণনা (২ মিনিটের মনোলগ)",
            diagnosticTipBn: "Use past and present tenses cleanly to describe an influential teacher, mentor, or family member.",
            drillPrompt: "Record 2-Min Cue Card: 'Describe a person who has influenced your career or life choices.'"
        },
        {
            day: 38, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ielts_studio", targetSound: "CueCard2", xpAward: 150,
            titleEn: "IELTS Part 2: Cue Card 2 - Describe a Journey", titleBn: "IELTS পার্ট ২: ভ্রমণের বিবরণ (২ মিনিটের মনোলগ)",
            diagnosticTipBn: "Incorporate sensory details, transition markers ('Initially', 'Unexpectedly'), and clear pacing.",
            drillPrompt: "Record 2-Min Cue Card: 'Describe a memorable journey you took in Bangladesh or abroad.'"
        },
        {
            day: 39, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ielts_studio", targetSound: "CueCard3", xpAward: 150,
            titleEn: "IELTS Part 2: Cue Card 3 - Describe Technology", titleBn: "IELTS পার্ট ২: প্রযুক্তি ব্যবহারের বিবরণ",
            diagnosticTipBn: "Focus on technical vocabulary ('user interface', 'efficiency', 'digital landscape') without hesitation.",
            drillPrompt: "Record 2-Min Cue Card: 'Describe a mobile application or technological device you use daily.'"
        },
        {
            day: 40, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ielts_studio", targetSound: "Part3", xpAward: 150,
            titleEn: "IELTS Part 3: Abstract Discussion & Cause/Effect", titleBn: "IELTS পার্ট ৩: বিশ্লেষণাত্মক আলোচনা ও যুক্তি উপস্থাপন",
            diagnosticTipBn: "Answer abstract questions by evaluating societal impact, economic factors, and future outlook.",
            drillPrompt: "Record IELTS Part 3: 'How will artificial intelligence impact employment in developing nations over the next decade?'"
        },
        {
            day: 41, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ai_tutor", targetSound: "Presentation", xpAward: 150,
            titleEn: "Corporate Presentation Hooks", titleBn: "করপোরেট প্রেজেন্টেশনের আকর্ষণীয় সূচনা",
            diagnosticTipBn: "Start with a compelling statistic or provocative question to instantly capture audience focus.",
            drillPrompt: "Speak: 'Did you know that 80% of project failures stem from misaligned communication?'"
        },
        {
            day: 42, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ai_tutor", targetSound: "ExecutiveUpdate", xpAward: 150,
            titleEn: "Structuring a 2-Minute Project Update", titleBn: "২ মিনিটের এক্সিকিউটিভ প্রজেক্ট আপডেট প্রদান",
            diagnosticTipBn: "Deliver: Current Status -> Key Achievement -> Impending Risk -> Next Milestone in under 120 seconds.",
            drillPrompt: "Speak: 'I am pleased to report that Phase 1 is on schedule, with key milestones achieved ahead of time.'"
        },
        {
            day: 43, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ai_tutor", targetSound: "QnA", xpAward: 150,
            titleEn: "Handling Q&A & Challenging Questions", titleBn: "কঠিন প্রশ্ন ও Q&A সেশন সফলভাবে সামলানো",
            diagnosticTipBn: "Buy time gracefully: 'That is an insightful question. Let me break down our strategic rationale...'",
            drillPrompt: "Speak: 'That is an excellent point. While risks exist, our mitigation strategy ensures steady growth.'"
        },
        {
            day: 44, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ai_tutor", targetSound: "VirtualEtiquette", xpAward: 150,
            titleEn: "Telephone & Virtual Meeting Etiquette", titleBn: "অনলাইন মিটিং ও টেলিফোনে বাকপটুতা",
            diagnosticTipBn: "Maintain clarity over digital audio: 'Am I audible?', 'To summarize our action items...', 'Allow me to share my screen.'",
            drillPrompt: "Speak: 'Thank you for joining. Before we conclude, let us confirm the primary action items for next week.'"
        },
        {
            day: 45, phase: 3, category: "Connected Speech & IELTS", targetEngine: "ielts_studio", targetSound: "Capstone3", xpAward: 300,
            titleEn: "Phase 3 Capstone Test: Timed IELTS Cue Card", titleBn: "ফেজ ৩ ক্যাপস্টোন পরীক্ষা: সম্পূর্ণ ২ মিনিটের IELTS কিউ কার্ড মূল্যায়ণ",
            diagnosticTipBn: "Evaluated by acoustic pause detector and IELTS Band scoring algorithm in IELTS Studio.",
            drillPrompt: "Complete the full IELTS Cue Card Monologue assessment in IELTS Studio."
        },

        // PHASE 4: High-Stakes BCS/Bank Viva, Executive Pitch & C1/C2 Native Mastery (Days 46–60)
        {
            day: 46, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "viva_studio", targetSound: "SelfIntroFormal", xpAward: 200,
            titleEn: "BCS PSC Viva: Formal Self-Introduction", titleBn: "বিসিএস ভাইভা বোর্ড: ক্যাডার উপযোগী প্রাতিষ্ঠানিক আত্মপরিচয়",
            diagnosticTipBn: "Address the Honorable Board Chairman respectfully. State academic credentials and public service aspiration concisely.",
            drillPrompt: "Answer Viva Panel: 'Honorable Chairman and members of the board, I am honored to present my credentials today.'"
        },
        {
            day: 47, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "viva_studio", targetSound: "LiberationWar", xpAward: 200,
            titleEn: "BCS PSC Viva: Liberation War & History", titleBn: "বিসিএস ভাইভা: মুক্তিযুদ্ধ ও জাতীয় ইতিহাসের ইংরেজি প্রকাশ",
            diagnosticTipBn: "Master terminology: 'historic 7th March speech', 'unconditional surrender', 'sovereign nation', 'martyred intellectuals'.",
            drillPrompt: "Answer Viva Panel: 'The 7th March address by the Father of the Nation Bangabandhu Sheikh Mujibur Rahman inspired our independence movement.'"
        },
        {
            day: 48, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "viva_studio", targetSound: "Constitution", xpAward: 200,
            titleEn: "BCS PSC Viva: Constitution & Foreign Policy", titleBn: "বিসিএস ভাইভা: সংবিধান, পররাষ্ট্রনীতি ও সুশাসন",
            diagnosticTipBn: "State foreign policy cornerstone smoothly: 'Friendship to all, malice towards none' and key constitutional fundamental principles.",
            drillPrompt: "Answer Viva Panel: 'Bangladesh follows a constitutional foreign policy of friendship to all and malice towards none.'"
        },
        {
            day: 49, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "viva_studio", targetSound: "CadreChoice", xpAward: 200,
            titleEn: "BCS PSC Viva: Cadre Choice Justification", titleBn: "বিসিএস ভাইভা: ক্যাডার পছন্দের যুক্তিযুক্ত কারণ উপস্থাপন",
            diagnosticTipBn: "Justify why your academic background matches your first choice (Admin, Foreign Affairs, Police, Audit, Tax).",
            drillPrompt: "Answer Viva Panel: 'My academic training in economics equips me to contribute effectively to administrative policy execution.'"
        },
        {
            day: 50, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "viva_studio", targetSound: "StressViva", xpAward: 200,
            titleEn: "BCS PSC Viva: Handling Pressure Questions", titleBn: "বিসিএস ভাইভা: স্ট্রেস ও চাপের মুখে শান্ত উত্তরদান",
            diagnosticTipBn: "When challenged aggressively by panel members, stay calm, smile respectfully, and state factual counter-arguments.",
            drillPrompt: "Answer Viva Panel: 'Respectfully sir, while I appreciate that concern, recent economic data demonstrates positive growth.'"
        },
        {
            day: 51, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "viva_studio", targetSound: "BankingViva", xpAward: 200,
            titleEn: "Bank Job Viva: Monetary Policy & Fintech", titleBn: "ব্যাংক ভাইভা: মনিটারি পলিসি ও ফিনটেক বিষয়ক প্রশ্নের উত্তর",
            diagnosticTipBn: "Use financial terminology: 'inflation control', 'repo rate', 'financial inclusion', 'mobile financial services (MFS)'.",
            drillPrompt: "Answer Viva Panel: 'Financial inclusion driven by digital banking has greatly empowered rural entrepreneurs across Bangladesh.'"
        },
        {
            day: 52, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "vocab_bank", targetSound: "Idioms", xpAward: 200,
            titleEn: "Advanced Idioms & Metaphors in Speech", titleBn: "উন্নত বাগধারা (Idioms) ও রূপক প্রয়োগের কৌশল",
            diagnosticTipBn: "Incorporate high-level idioms naturally: 'blessing in disguise', 'hit the nail on the head', 'touching upon the tip of the iceberg'.",
            drillPrompt: "Speak: 'Although the initial delay was challenging, it turned out to be a blessing in disguise for our team.'"
        },
        {
            day: 53, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "native_stories", targetSound: "FastShadow", xpAward: 200,
            titleEn: "Fast-Talk Native Speed Shadowing", titleBn: "দ্রুতগতির নেটিভ ইংরেজিতে শ্যাডোয়িং চর্চা (C1-C2 Level)",
            diagnosticTipBn: "Match natural C1 native pace (150-170 words per minute) without losing phonetic clarity or sentence stress.",
            drillPrompt: "Shadow fast speech: 'In an increasingly interconnected global economy, adaptability is the ultimate competitive advantage.'"
        },
        {
            day: 54, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "ai_tutor", targetSound: "Debate", xpAward: 200,
            titleEn: "Complex Debate: Argumentation & Rebuttal", titleBn: "জটিল বিতর্ক ও যুক্ত খণ্ডনের পারদর্শিতা",
            diagnosticTipBn: "Structure rebuttal: Acknowledge opponent claim -> Identify logical flaw -> Present empirical evidence.",
            drillPrompt: "Speak: 'While my colleague highlights short-term costs, long-term return on investment far outweighs initial expenditure.'"
        },
        {
            day: 55, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "ai_tutor", targetSound: "ElevatorPitch", xpAward: 200,
            titleEn: "Pitching an Idea / 60-Second Elevator Pitch", titleBn: "৬০ সেকেণ্ডের প্রভাববিস্তারী এলিভেটর পিচ",
            diagnosticTipBn: "Deliver Hook -> Problem -> Solution -> Value Proposition -> Call to Action in 60 sharp seconds.",
            drillPrompt: "Speak: 'We solve spoken hesitation for Bangladeshi learners through real-time AI phonetic feedback. Join our beta today!'"
        },
        {
            day: 56, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "native_stories", targetSound: "BBCStyle", xpAward: 200,
            titleEn: "BBC News Style Clear Broadcast Delivery", titleBn: "বিবিসি নিউজের ন্যায় নিরপেক্ষ ও স্পষ্ট বাচনভঙ্গি",
            diagnosticTipBn: "Emulate broadcast clarity: measured cadence, neutral stress, impeccably clear consonant endings.",
            drillPrompt: "Shadow broadcast: 'Good evening. Here are the principal headlines from around the world today.'"
        },
        {
            day: 57, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "ai_tutor", targetSound: "VoiceModulation", xpAward: 200,
            titleEn: "Public Speaking & Voice Modulation", titleBn: "পাবলিক স্পিকিংয়ে কণ্ঠের ওঠানামা ও রেজোন্যান্স",
            diagnosticTipBn: "Use chest voice resonance and intentional strategic pauses to emphasize key milestones.",
            drillPrompt: "Speak: 'Transformation... does not happen by chance. It happens by consistent, deliberate daily practice.'"
        },
        {
            day: 58, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "viva_studio", targetSound: "FullMockViva", xpAward: 300,
            titleEn: "Comprehensive BCS/Bank Mock Viva Simulation", titleBn: "সম্পূর্ণ ১৫ মিনিটের বিসিএস/ব্যাংক ভাইভা সিমুলেশন",
            diagnosticTipBn: "Full 15-minute simulated PSC viva panel testing national affairs, cadre choice, international policy, and stress control.",
            drillPrompt: "Complete the 15-Minute Full Mock Viva Panel Session in BCS Viva Studio."
        },
        {
            day: 59, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "profile", targetSound: "Audit", xpAward: 250,
            titleEn: "60-Day Progress Review & Skill Audit", titleBn: "৬০ দিনের সার্বিক অগ্রগতি পর্যালোচনা ও অডিট",
            diagnosticTipBn: "Inspect your 3-Tier Mastery Dashboard, review your early Day 1 recordings vs Day 58 recordings.",
            drillPrompt: "Perform complete Skill Audit and inspect your Mastered 🟢 list in Personal Space."
        },
        {
            day: 60, phase: 4, category: "BCS Viva & Native Mastery", targetEngine: "profile", targetSound: "Graduation", xpAward: 500,
            titleEn: "Grand Graduation & Official Certification", titleBn: "গ্র্যান্ড গ্র্যাজুয়েশন ও অফিশিয়াল সার্টিফিকেট অর্জন",
            diagnosticTipBn: "Congratulations! You have completed the 60-Day Master Progression System. Claim your official high-res certificate.",
            drillPrompt: "Unlock your Official High-Resolution Graduation Certificate and export your portfolio."
        }
    ];

    // Core State
    let userProgress = {
        activeDay: 1,
        completedDays: [],
        streakCount: 0,
        lastCompletedDate: null,
        totalXp: 0,
        scores: {}
    };

    function init() {
        loadProgress();
        console.log("SpeakUP 60-Day Curriculum Engine Initialized. Active Day:", userProgress.activeDay);
    }

    function loadProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                userProgress = Object.assign({}, userProgress, JSON.parse(raw));
            }
        } catch(e) {
            console.warn("Failed to load curriculum progress from localStorage", e);
        }
    }

    function saveProgress() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
            // Sync to Supabase if logged in
            if (window.SpeakUPSupabase && typeof window.SpeakUPSupabase.saveCurriculumProgress === 'function') {
                window.SpeakUPSupabase.saveCurriculumProgress(userProgress);
            }
        } catch(e) {
            console.warn("Failed to save curriculum progress", e);
        }
    }

    function getCurriculumProgress() {
        const completedCount = userProgress.completedDays.length;
        const totalDays = CURRICULUM_DATA.length;
        const percent = Math.round((completedCount / totalDays) * 100);
        return {
            activeDay: userProgress.activeDay,
            completedDays: userProgress.completedDays,
            completedCount: completedCount,
            totalDays: totalDays,
            percent: percent,
            streakCount: userProgress.streakCount,
            totalXp: userProgress.totalXp
        };
    }

    function getDayDetails(dayNum) {
        return CURRICULUM_DATA.find(item => item.day === parseInt(dayNum)) || CURRICULUM_DATA[0];
    }

    function markDayComplete(dayNum, score = 85) {
        const dNum = parseInt(dayNum);
        if (!userProgress.completedDays.includes(dNum)) {
            userProgress.completedDays.push(dNum);
            
            const dayData = getDayDetails(dNum);
            userProgress.totalXp += (dayData.xpAward || 100);
            userProgress.scores[dNum] = score;

            // Calculate streak
            const todayStr = new Date().toISOString().split('T')[0];
            if (userProgress.lastCompletedDate) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yestStr = yesterday.toISOString().split('T')[0];
                if (userProgress.lastCompletedDate === yestStr) {
                    userProgress.streakCount += 1;
                } else if (userProgress.lastCompletedDate !== todayStr) {
                    userProgress.streakCount = 1;
                }
            } else {
                userProgress.streakCount = 1;
            }
            userProgress.lastCompletedDate = todayStr;

            // Unlock next day
            if (dNum < 60) {
                userProgress.activeDay = Math.max(userProgress.activeDay, dNum + 1);
            }

            saveProgress();

            // Notify UI & Profile engine
            if (window.SpeakUPProfile && typeof window.SpeakUPProfile.updateStats === 'function') {
                window.SpeakUPProfile.updateStats();
            }
        }
    }

    function launchDayStudio(dayNum) {
        const dayData = getDayDetails(dayNum);
        if (!dayData) return;

        console.log(`Launching studio '${dayData.targetEngine}' for Day ${dayNum}`);
        
        // Hide curriculum modal if open
        const modal = document.getElementById('curriculumModal');
        if (modal) modal.style.display = 'none';

        // Navigate to workspace tab or modal
        switch(dayData.targetEngine) {
            case 'ipa_lab':
                if (typeof window.openIpaLab === 'function') window.openIpaLab();
                else alert(`Day ${dayNum} Practice: ${dayData.drillPrompt}`);
                break;
            case 'word_stress':
                if (typeof window.openWordStressStudio === 'function') window.openWordStressStudio();
                else alert(`Day ${dayNum} Practice: ${dayData.drillPrompt}`);
                break;
            case 'native_stories':
                if (typeof window.openNativeStoriesStudio === 'function') window.openNativeStoriesStudio();
                else alert(`Day ${dayNum} Practice: ${dayData.drillPrompt}`);
                break;
            case 'ielts_studio':
                if (typeof window.openIeltsStudio === 'function') window.openIeltsStudio();
                else alert(`Day ${dayNum} Practice: ${dayData.drillPrompt}`);
                break;
            case 'viva_studio':
                if (typeof window.openVivaStudio === 'function') window.openVivaStudio();
                else alert(`Day ${dayNum} Practice: ${dayData.drillPrompt}`);
                break;
            case 'vocab_bank':
                if (typeof window.openVocabBank === 'function') window.openVocabBank();
                else alert(`Day ${dayNum} Practice: ${dayData.drillPrompt}`);
                break;
            case 'diagnostic':
                if (typeof window.openDiagnosticEngine === 'function') window.openDiagnosticEngine();
                else alert(`Day ${dayNum} Practice: ${dayData.drillPrompt}`);
                break;
            case 'profile':
                if (typeof window.openProfileModal === 'function') window.openProfileModal();
                break;
            case 'ai_tutor':
            default:
                // Focus AI tutor input or mic
                const micBtn = document.getElementById('micBtn');
                if (micBtn) micBtn.scrollIntoView({ behavior: 'smooth' });
                alert(`🎯 Day ${dayNum} Goal: ${dayData.titleEn}\n\nBangla Tip: ${dayData.diagnosticTipBn}\n\nPrompt: "${dayData.drillPrompt}"`);
                break;
        }
    }

    function renderDashboardCard(containerId = 'curriculumTodayCard') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const progress = getCurriculumProgress();
        const activeDayData = getDayDetails(progress.activeDay);
        const isCompleted = progress.completedDays.includes(activeDayData.day);

        container.innerHTML = `
            <div style="background: linear-gradient(135deg, #0284C7 0%, #1E40AF 100%); border-radius: 20px; padding: 16px 20px; color: white; margin-bottom: 14px; text-align: left; box-shadow: 0 10px 25px rgba(2, 132, 199, 0.25); position: relative; overflow: hidden;">
                <div style="position: absolute; right: -10px; top: -10px; font-size: 80px; opacity: 0.08; font-weight: 900; pointer-events: none;">60</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="background: #FEF08A; color: #854D0E; font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 12px;">DAY ${activeDayData.day} OF 60</span>
                        <span style="background: rgba(255,255,255,0.2); color: white; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px;">Phase ${activeDayData.phase}</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 800; color: #BAE6FD; cursor: pointer;" onclick="SpeakUPCurriculum.openRoadmapModal()">
                        🔥 Streak: ${progress.streakCount} Days | View Roadmap ➔
                    </div>
                </div>

                <div style="font-size: 15px; font-weight: 900; margin-bottom: 4px; color: #FFFFFF;">
                    ${activeDayData.titleEn}
                </div>
                <div style="font-size: 11px; color: #E0F2FE; margin-bottom: 10px; line-height: 1.4;">
                    💡 <b>Bangla Tip:</b> ${activeDayData.diagnosticTipBn}
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #BAE6FD; margin-bottom: 4px;">
                            <span>Overall Progress</span>
                            <span>${progress.completedCount} / 60 Days (${progress.percent}%)</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 10px; overflow: hidden;">
                            <div style="background: #38BDF8; width: ${progress.percent}%; height: 100%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    <button onclick="SpeakUPCurriculum.launchDayStudio(${activeDayData.day})" style="background: #FACC15; color: #713F12; border: none; border-radius: 12px; padding: 8px 14px; font-size: 12px; font-weight: 900; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 10px rgba(250, 204, 21, 0.3);">
                        ${isCompleted ? 'Replay Drill 🔄' : 'Start Lesson ➔'}
                    </button>
                </div>
            </div>
        `;
    }

    function openRoadmapModal() {
        let modal = document.getElementById('curriculumModal');
        if (!modal) {
            modal = createCurriculumModalHTML();
            document.body.appendChild(modal);
        }
        renderCurriculumModalContent();
        modal.style.display = 'flex';
    }

    function createCurriculumModalHTML() {
        const div = document.createElement('div');
        div.id = 'curriculumModal';
        div.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.75); backdrop-filter:blur(6px); z-index:99999; justify-content:center; align-items:center; padding:15px;';
        div.innerHTML = `
            <div style="background:#FFFFFF; border-radius:24px; max-width:850px; width:100%; max-height:90vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 50px rgba(0,0,0,0.3); border:2px solid #38BDF8;">
                <div style="padding:16px 20px; background:linear-gradient(135deg,#0284C7,#0369A1); color:white; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="margin:0; font-size:18px; font-weight:900; display:flex; align-items:center; gap:8px;">
                            🗺️ 60-Day Master Progression Roadmap
                        </h3>
                        <p style="margin:2px 0 0 0; font-size:11px; color:#BAE6FD;">Bangladeshi Learner Customized Path | 100% Free Lifetime Progress</p>
                    </div>
                    <button onclick="document.getElementById('curriculumModal').style.display='none'" style="background:rgba(255,255,255,0.2); border:none; color:white; width:32px; height:32px; border-radius:50%; font-size:16px; font-weight:900; cursor:pointer;">✕</button>
                </div>
                
                <div style="padding:12px 20px; background:#F8FAFC; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; gap:6px; overflow-x:auto;" id="curriculumPhaseTabs">
                        <button onclick="SpeakUPCurriculum.filterPhase(0)" class="curr-phase-btn active" data-phase="0">All 60 Days</button>
                        <button onclick="SpeakUPCurriculum.filterPhase(1)" class="curr-phase-btn" data-phase="1">Phase 1: Phonetics</button>
                        <button onclick="SpeakUPCurriculum.filterPhase(2)" class="curr-phase-btn" data-phase="2">Phase 2: Rhythm</button>
                        <button onclick="SpeakUPCurriculum.filterPhase(3)" class="curr-phase-btn" data-phase="3">Phase 3: IELTS</button>
                        <button onclick="SpeakUPCurriculum.filterPhase(4)" class="curr-phase-btn" data-phase="4">Phase 4: BCS Viva</button>
                    </div>
                    <input type="text" id="curriculumSearchInput" oninput="SpeakUPCurriculum.handleSearch(this.value)" placeholder="Search topics (e.g. /v/, IELTS, Viva)..." style="padding:6px 12px; border:1px solid #CBD5E1; border-radius:12px; font-size:11px; width:180px; outline:none;" />
                </div>

                <div id="curriculumGridContainer" style="padding:20px; overflow-y:auto; flex:1; display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px; background:#F1F5F9;">
                    <!-- Rendered Grid Cards -->
                </div>
            </div>
        `;
        return div;
    }

    let activeFilterPhase = 0;
    let activeSearchQuery = '';

    function filterPhase(phaseNum) {
        activeFilterPhase = phaseNum;
        renderCurriculumModalContent();
    }

    function handleSearch(query) {
        activeSearchQuery = query.toLowerCase();
        renderCurriculumModalContent();
    }

    function renderCurriculumModalContent() {
        const grid = document.getElementById('curriculumGridContainer');
        if (!grid) return;

        const progress = getCurriculumProgress();
        let filtered = CURRICULUM_DATA;

        if (activeFilterPhase > 0) {
            filtered = filtered.filter(item => item.phase === activeFilterPhase);
        }

        if (activeSearchQuery) {
            filtered = filtered.filter(item => 
                item.titleEn.toLowerCase().includes(activeSearchQuery) || 
                item.titleBn.toLowerCase().includes(activeSearchQuery) ||
                item.category.toLowerCase().includes(activeSearchQuery) ||
                item.targetEngine.toLowerCase().includes(activeSearchQuery)
            );
        }

        grid.innerHTML = filtered.map(item => {
            const isCompleted = progress.completedDays.includes(item.day);
            const isActive = item.day === progress.activeDay;
            const isUnlocked = item.day <= progress.activeDay;

            let badgeBg = '#E2E8F0', badgeColor = '#64748B', statusIcon = '🔒', statusText = 'Locked';
            if (isCompleted) {
                badgeBg = '#DCFCE7'; badgeColor = '#15803D'; statusIcon = '🟢'; statusText = 'Completed';
            } else if (isActive) {
                badgeBg = '#FEF3C7'; badgeColor = '#92400E'; statusIcon = '🔵'; statusText = 'Today’s Goal';
            } else if (isUnlocked) {
                badgeBg = '#E0F2FE'; badgeColor = '#0369A1'; statusIcon = '🔓'; statusText = 'Unlocked';
            }

            return `
                <div style="background:#FFFFFF; border-radius:16px; padding:14px; border:${isActive ? '2px solid #F59E0B' : '1px solid #E2E8F0'}; box-shadow:0 4px 10px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-space-between; position:relative;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:10px; font-weight:900; color:#0284C7;">DAY ${item.day}</span>
                        <span style="background:${badgeBg}; color:${badgeColor}; font-size:9.5px; font-weight:800; padding:2px 6px; border-radius:8px;">${statusIcon} ${statusText}</span>
                    </div>
                    
                    <div style="font-size:12px; font-weight:800; color:#0F172A; margin-bottom:4px; line-height:1.3;">
                        ${item.titleEn}
                    </div>
                    <div style="font-size:10px; color:#64748B; margin-bottom:10px; line-height:1.3;">
                        ${item.titleBn}
                    </div>
                    
                    <div style="margin-top:auto; display:flex; gap:6px;">
                        <button onclick="SpeakUPCurriculum.showDayDetailModal(${item.day})" style="flex:1; background:#F8FAFC; color:#0F172A; border:1px solid #CBD5E1; border-radius:10px; padding:6px; font-size:10px; font-weight:700; cursor:pointer;">
                            View Guide 💡
                        </button>
                        <button onclick="SpeakUPCurriculum.launchDayStudio(${item.day})" style="flex:1; background:${isUnlocked ? '#0284C7' : '#94A3B8'}; color:white; border:none; border-radius:10px; padding:6px; font-size:10px; font-weight:800; cursor:${isUnlocked ? 'pointer' : 'not-allowed'};" ${isUnlocked ? '' : 'disabled'}>
                            ${isCompleted ? 'Replay' : 'Launch'} ➔
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function showDayDetailModal(dayNum) {
        const dayData = getDayDetails(dayNum);
        if (!dayData) return;

        const isCompleted = userProgress.completedDays.includes(dayData.day);

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:100000; display:flex; justify-content:center; align-items:center; padding:15px;';
        overlay.onclick = (e) => { if (e.target === overlay) document.body.removeChild(overlay); };

        overlay.innerHTML = `
            <div style="background:#FFFFFF; border-radius:20px; max-width:500px; width:100%; padding:20px; text-align:left; box-shadow:0 20px 40px rgba(0,0,0,0.25); border:2px solid #0284C7; position:relative;">
                <button onclick="this.closest('div').parentElement.remove()" style="position:absolute; top:12px; right:12px; background:#F1F5F9; border:none; border-radius:50%; width:28px; height:28px; font-size:14px; font-weight:800; cursor:pointer;">✕</button>

                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                    <span style="background:#E0F2FE; color:#0369A1; font-size:10px; font-weight:900; padding:3px 8px; border-radius:10px;">DAY ${dayData.day}</span>
                    <span style="background:#FEF3C7; color:#92400E; font-size:10px; font-weight:800; padding:3px 8px; border-radius:10px;">Phase ${dayData.phase}: ${dayData.category}</span>
                </div>

                <h3 style="margin:0 0 4px 0; font-size:16px; font-weight:900; color:#0F172A;">${dayData.titleEn}</h3>
                <p style="margin:0 0 12px 0; font-size:12px; font-weight:700; color:#0284C7;">${dayData.titleBn}</p>

                <div style="background:#F0F9FF; border:1px solid #BAE6FD; border-radius:14px; padding:12px; margin-bottom:12px; font-size:11.5px; color:#0369A1; line-height:1.5;">
                    💡 <b>Bangladeshi Learner Diagnostic Tip:</b><br/>
                    ${dayData.diagnosticTipBn}
                </div>

                <div style="background:#FEFCE8; border:1px solid #FEF08A; border-radius:14px; padding:12px; margin-bottom:16px; font-size:11.5px; color:#713F12; line-height:1.5;">
                    🎯 <b>Daily Practice Goal:</b><br/>
                    "${dayData.drillPrompt}"
                </div>

                <div style="display:flex; gap:10px;">
                    <button onclick="SpeakUPCurriculum.markDayComplete(${dayData.day}); this.closest('div').parentElement.remove(); alert('Day ${dayData.day} marked complete! +${dayData.xpAward} XP'); SpeakUPCurriculum.renderDashboardCard();" style="flex:1; background:#22C55E; color:white; border:none; border-radius:12px; padding:10px; font-size:11px; font-weight:900; cursor:pointer;">
                        ${isCompleted ? '✓ Completed' : 'Mark Completed (+ ' + dayData.xpAward + ' XP)'}
                    </button>
                    <button onclick="this.closest('div').parentElement.remove(); SpeakUPCurriculum.launchDayStudio(${dayData.day});" style="flex:1.2; background:#0284C7; color:white; border:none; border-radius:12px; padding:10px; font-size:11px; font-weight:900; cursor:pointer;">
                        Launch Practice Studio ➔
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    return {
        init: init,
        getCurriculumProgress: getCurriculumProgress,
        getDayDetails: getDayDetails,
        markDayComplete: markDayComplete,
        launchDayStudio: launchDayStudio,
        renderDashboardCard: renderDashboardCard,
        openRoadmapModal: openRoadmapModal,
        filterPhase: filterPhase,
        handleSearch: handleSearch,
        showDayDetailModal: showDayDetailModal
    };
})();

// Auto Init on DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.SpeakUPCurriculum.init());
} else {
    window.SpeakUPCurriculum.init();
}
