/**
 * SpeakUP AI - Facebook Group Oral Practice Sharing Integration Engine
 * Direct integration to official Facebook Practice Group (https://www.facebook.com/groups/1523999358877638)
 * Offloads 100% of video/audio hosting bandwidth directly to Facebook's infrastructure.
 */

const FB_GROUP_URL = 'https://www.facebook.com/groups/1523999358877638';

const FacebookSharingEngine = {
    currentSession: {
        title: 'Daily Spoken Practice',
        track: 'General Spoken',
        durationSec: 60,
        score: 'B1'
    },

    openShareModal(title = '60-Sec Spoken Challenge', track = 'General Spoken') {
        this.currentSession.title = title;
        this.currentSession.track = track;
        if (typeof ProfileEngine !== 'undefined') {
            this.currentSession.score = ProfileEngine.profile.cefrLevel || 'B1';
        }

        const modal = document.getElementById('fbShareModal');
        const titleEl = document.getElementById('fbShareModalTitle');
        const captionEl = document.getElementById('fbShareCaptionText');

        if (titleEl) titleEl.innerText = `🎙️ ${title}`;
        if (captionEl) {
            captionEl.value = `🎙️ My Daily Spoken Practice (${this.currentSession.score} Level) | SpeakUP AI Challenge Completed!\n🎯 Goal Track: ${track}\n🔥 Practice Link: https://www.speakupai.pro\n#SpeakUPAI #SpokenEnglish #DailySpeakingChallenge`;
        }

        if (modal) modal.style.display = 'flex';
    },

    closeShareModal() {
        const modal = document.getElementById('fbShareModal');
        if (modal) modal.style.display = 'none';
    },

    async copyCaptionAndLaunchFB() {
        const captionEl = document.getElementById('fbShareCaptionText');
        const textToCopy = captionEl ? captionEl.value : `🎙️ My Daily Spoken Practice | SpeakUP AI Challenge Completed! https://www.speakupai.pro`;

        try {
            await navigator.clipboard.writeText(textToCopy);
            alert("📋 Challenge Caption Copied! Redirecting to Facebook Group composer...");
        } catch(e) {
            console.warn("Clipboard copy note:", e);
        }

        // Record XP for community sharing in ProfileEngine
        if (typeof ProfileEngine !== 'undefined') {
            ProfileEngine.recordActivity('communityShare', { xpGained: 25, sharedTo: 'FacebookGroup' });
        }

        // Launch Facebook Group in new tab (bandwidth offloaded to Facebook)
        window.open(FB_GROUP_URL, '_blank');
        this.closeShareModal();
    }
};
