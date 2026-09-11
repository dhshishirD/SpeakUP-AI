/**
 * SpeakUP AI - Native Prosody, Stress & Dynamic Intonation Engine
 * 60fps Siri-Style Web Audio Wave Animation & Real-Time Pitch Engine (v17.0.0)
 * Real-Time Microphone & TTS Audio Reactive Visualizer
 */

const ProsodyEngine = {
    animationId: null,
    wavePhase: 0,
    currentType: 'falling',
    audioCtx: null,
    micAnalyser: null,
    micDataArray: null,
    isMicActive: false,
    isTtsActive: false,
    currentCanvasId: 'nativePitchCanvas',

    drawIntonationCurve(canvasId, type = 'falling') {
        this.currentType = type;
        this.currentCanvasId = canvasId || 'nativePitchCanvas';
        const canvas = document.getElementById(this.currentCanvasId);
        if (!canvas) return;
        
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.animateWave(canvas, type);
    },

    async startMicListening() {
        try {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.audioCtx.state === 'suspended') {
                await this.audioCtx.resume();
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = this.audioCtx.createMediaStreamSource(stream);
            this.micAnalyser = this.audioCtx.createAnalyser();
            this.micAnalyser.fftSize = 64;
            source.connect(this.micAnalyser);
            this.micDataArray = new Uint8Array(this.micAnalyser.frequencyBinCount);
            this.isMicActive = true;
            this.micStream = stream;
            console.log("🎙️ Microphone Analyser Connected to Prosody Engine");
        } catch (e) {
            console.warn("Microphone access not available or denied:", e);
            this.isMicActive = false;
        }
    },

    stopMicListening() {
        this.isMicActive = false;
        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
            this.micStream = null;
        }
        if (this.micAnalyser) {
            this.micAnalyser.disconnect();
            this.micAnalyser = null;
        }
    },

    setTtsActive(active) {
        this.isTtsActive = active;
    },

    animateWave(canvas, type) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const loop = () => {
            this.wavePhase += 0.06;
            ctx.clearRect(0, 0, w, h);

            // Compute dynamic amplitude based on real audio input
            let dynamicAmp = 5; // default ambient
            let speedMult = 1;

            if (this.isMicActive && this.micAnalyser) {
                this.micAnalyser.getByteFrequencyData(this.micDataArray);
                let sum = 0;
                for (let i = 0; i < this.micDataArray.length; i++) {
                    sum += this.micDataArray[i];
                }
                const avg = sum / this.micDataArray.length;
                dynamicAmp = Math.min(30, 4 + (avg / 255) * 35);
                speedMult = 1.5;
            } else if (this.isTtsActive) {
                dynamicAmp = 12 + Math.sin(this.wavePhase * 2.5) * 8 + Math.cos(this.wavePhase * 4) * 4;
                speedMult = 1.8;
            }

            this.wavePhase += (speedMult - 1) * 0.03;

            // Background subtle grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }

            // Base Intonation Curve Points
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
            ctx.lineWidth = (this.isMicActive || this.isTtsActive) ? 5 : 3.5;
            const gradient = ctx.createLinearGradient(0, 0, w, 0);
            gradient.addColorStop(0, mainColor);
            gradient.addColorStop(0.5, subColor);
            gradient.addColorStop(1, mainColor);
            ctx.strokeStyle = gradient;

            ctx.moveTo(10, startY);

            for (let x = 10; x < w - 10; x += 4) {
                const progress = x / w;
                let baseY = startY + (endY - startY) * progress;
                if (type === 'fallrise') {
                    baseY = startY + Math.sin(progress * Math.PI) * (midY - startY);
                }
                const waveOffset = Math.sin(progress * 12 + this.wavePhase) * dynamicAmp;
                ctx.lineTo(x, baseY + waveOffset);
            }
            ctx.stroke();

            // Draw Frequency Stress Nodes / Particles along the wave
            const nodeX = (Math.sin(this.wavePhase * 0.8) + 1) * 0.4 * w + w * 0.1;
            const nodeProgress = nodeX / w;
            let nodeY = startY + (endY - startY) * nodeProgress;
            if (type === 'fallrise') nodeY = startY + Math.sin(nodeProgress * Math.PI) * (midY - startY);
            nodeY += Math.sin(nodeProgress * 12 + this.wavePhase) * dynamicAmp;

            ctx.beginPath();
            ctx.arc(nodeX, nodeY, (this.isMicActive || this.isTtsActive) ? 7 : 5, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = mainColor;
            ctx.shadowBlur = (this.isMicActive || this.isTtsActive) ? 18 : 10;
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
        this.stopMicListening();
        this.isTtsActive = false;
    }
};

console.log("🌊 ProsodyEngine Audio-Reactive Intonation Engine Loaded (v17.0.0)");
