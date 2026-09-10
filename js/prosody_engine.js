/**
 * SpeakUP AI - Native Prosody, Stress & Intonation Engine
 * Renders HTML5 Intonation Pitch Curves, Word Stress Diagrams, and Sentence Rhythm rules.
 */

const ProsodyEngine = {
    drawIntonationCurve(canvasId, type = 'falling') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = (type === 'falling' ? '#DC2626' : (type === 'rising' ? '#0284C7' : '#7C3AED'));

        const w = canvas.width;
        const h = canvas.height;

        if (type === 'falling') {
            // Falling intonation (Statements & Wh-questions ↘)
            ctx.moveTo(10, h * 0.3);
            ctx.bezierCurveTo(w * 0.4, h * 0.2, w * 0.7, h * 0.8, w - 10, h * 0.85);
        } else if (type === 'rising') {
            // Rising intonation (Yes/No questions ↗)
            ctx.moveTo(10, h * 0.8);
            ctx.bezierCurveTo(w * 0.4, h * 0.75, w * 0.7, h * 0.3, w - 10, h * 0.15);
        } else {
            // Fall-Rise intonation (Politeness & Uncertainty ↘↗)
            ctx.moveTo(10, h * 0.3);
            ctx.bezierCurveTo(w * 0.3, h * 0.85, w * 0.7, h * 0.85, w - 10, h * 0.2);
        }
        ctx.stroke();
    }
};
