/**
 * SpeakUP AI - Native Prosody, Stress & Dynamic Intonation Engine
 * 60fps Siri-Style Web Audio Wave Animation & Real-Time Pitch Engine (v14.0.0)
 */

const ProsodyEngine = {
    animationId: null,
    wavePhase: 0,
    currentType: 'falling',

    drawIntonationCurve(canvasId, type = 'falling') {
        this.currentType = type;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Start fluid 60fps animation loop
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.animateWave(canvas, type);
    },

    animateWave(canvas, type) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const loop = () => {
            this.wavePhase += 0.05;
            ctx.clearRect(0, 0, w, h);

            // Background subtle grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }

            // Define Base Intonation Curve Points
            let startY = h * 0.35;
            let midY = h * 0.5;
            let endY = h * 0.75;
            let mainColor = '#EF4444'; // Falling (Red)
            let subColor = '#F87171';

            if (type === 'rising') {
                startY = h * 0.75;
                midY = h * 0.5;
                endY = h * 0.2;
                mainColor = '#0284C7'; // Rising (Sky Blue)
                subColor = '#38BDF8';
            } else if (type === 'fallrise') {
                startY = h * 0.3;
                midY = h * 0.85;
                endY = h * 0.25;
                mainColor = '#8B5CF6'; // Fall-Rise (Purple)
                subColor = '#A78BFA';
            }

            // Draw Glowing Sine Wave Overlay (Siri Effect)
            ctx.beginPath();
            ctx.lineWidth = 4;
            const gradient = ctx.createLinearGradient(0, 0, w, 0);
            gradient.addColorStop(0, mainColor);
            gradient.addColorStop(0.5, subColor);
            gradient.addColorStop(1, mainColor);
            ctx.strokeStyle = gradient;

            ctx.moveTo(10, startY);

            for (let x = 10; x < w - 10; x += 5) {
                const progress = x / w;
                let baseY = startY + (endY - startY) * progress;
                if (type === 'fallrise') {
                    baseY = startY + Math.sin(progress * Math.PI) * (midY - startY);
                }
                const waveOffset = Math.sin(progress * 10 + this.wavePhase) * 6;
                ctx.lineTo(x, baseY + waveOffset);
            }
            ctx.stroke();

            // Draw Frequency Stress Nodes / Particles along the wave
            const nodeX = (Math.sin(this.wavePhase * 0.7) + 1) * 0.4 * w + w * 0.1;
            const nodeProgress = nodeX / w;
            let nodeY = startY + (endY - startY) * nodeProgress;
            if (type === 'fallrise') nodeY = startY + Math.sin(nodeProgress * Math.PI) * (midY - startY);

            ctx.beginPath();
            ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = mainColor;
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset blur

            this.animationId = requestAnimationFrame(loop);
        };

        loop();
    },

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
};

console.log("🌊ProsodyEngine 60fps Intonation Wave Loaded (v14.0.0)");
