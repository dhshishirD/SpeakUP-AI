/**
 * SpeakUP AI - BBC & Native Short Story Resource Hub
 * Embedded native reference stories, transcripts, Bengali translations, and audio shadowing data.
 */

const NativeResourcesHub = {
    stories: [
        {
            id: 'story_1',
            level: 'A2-B1',
            title: 'A Conversation at London Heathrow Airport',
            category: 'Travel & Real-world',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            englishTranscript: "Customs Officer: 'Good morning! What is the purpose of your visit to the UK?'\nPassenger: 'Good morning. I am attending a 3-day international AI conference in London.'",
            bengaliTranslation: "কাস্টমস অফিসার: 'শুভ সকাল! যুক্তরাজ্যে আপনার সফরের উদ্দেশ্য কী?'\nযাত্রী: 'শুভ সকাল। আমি লন্ডনে ৩ দিনের আন্তর্জাতিক এআই কনফারেন্সে যোগ দিচ্ছি।'",
            phoneticNotes: "Notice how 'purpose of your visit' is spoken with connected speech: /pɜːpəs əv jɔː vɪzɪt/."
        },
        {
            id: 'story_2',
            level: 'B1-B2',
            title: 'Mastering the 90-Second STAR Job Interview Pitch',
            category: 'Career & Viva',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            englishTranscript: "Interviewer: 'Tell me about a challenging situation at work.'\nCandidate: 'In my previous project, we faced a tight 48-hour deadline. I restructured our workflow and delivered 100% on time.'",
            bengaliTranslation: "ইন্টারভিউয়ার: 'কাজে একটি চ্যালেঞ্জিং পরিস্থিতির কথা বলুন।'\nপ্রার্থী: 'আমার আগের প্রজেক্টে, আমরা ৪৮ ঘণ্টার জরুরি ডেডলাইনের মুখে পড়েছিলাম। আমি কাজের ফ্লো নতুনভাবে সাজিয়ে ১০০% সঠিক সময়ে ডেলিভারি দিই।'",
            phoneticNotes: "Focus on Word Stress: 'CHAL-len-ging', 'PRE-vi-ous', 'RE-struc-tured'."
        }
    ],

    renderStoriesList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.stories.map(story => `
            <div style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:16px; padding:14px; margin-bottom:12px; text-align:left;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:10px; font-weight:800; color:#059669; background:#E6F4EA; padding:3px 8px; border-radius:6px;">${story.level} • ${story.category}</span>
                    <button onclick="NativeResourcesHub.toggleTranslation('${story.id}')" style="background:#F0F9FF; border:1px solid #BAE6FD; color:#0369A1; border-radius:6px; padding:3px 8px; font-size:10px; font-weight:800; cursor:pointer;">
                        Translate ➔
                    </button>
                </div>
                <strong style="font-size:14px; color:#0F172A; display:block; margin-bottom:6px;">${story.title}</strong>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:10px; font-size:12px; color:#334155; line-height:1.5; font-family:sans-serif; margin-bottom:8px;">
                    ${story.englishTranscript.replace(/\n/g, '<br>')}
                </div>
                <div id="trans_${story.id}" style="display:none; background:#FFFBEB; border:1px solid #FCD34D; border-radius:10px; padding:10px; font-size:12px; color:#B45309; line-height:1.5; margin-bottom:8px;">
                    ${story.bengaliTranslation.replace(/\n/g, '<br>')}
                </div>
                <div style="font-size:10px; color:#64748B; background:#F1F5F9; padding:4px 8px; border-radius:6px; margin-bottom:8px;">
                    💡 Phonetic Note: ${story.phoneticNotes}
                </div>
                <button onclick="FacebookSharingEngine.openShareModal('${story.title}', '${story.category}')" style="background:#1877F2; color:white; border:none; padding:6px 12px; border-radius:8px; font-weight:800; font-size:11px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                    Share Shadowing Practice to Facebook Group ➔
                </button>
            </div>
        `).join('');
    },

    toggleTranslation(storyId) {
        const transEl = document.getElementById(`trans_${storyId}`);
        if (transEl) transEl.style.display = (transEl.style.display === 'none' ? 'block' : 'none');
    }
};
