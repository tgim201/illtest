/**
 * SoundEngine - Web Audio API를 활용한 순수 클라이언트 오디오 합성기
 * 외부 오디오 파일 없이 100% 오프라인으로 칩튠 및 SFX 효과음 재생
 */
const SoundEngine = (function() {
    let ctx = null;
    let isMuted = false;

    function getContext() {
        if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                ctx = new AudioCtx();
            }
        }
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
        return ctx;
    }

    return {
        toggleMute: function() {
            isMuted = !isMuted;
            return isMuted;
        },
        isMuted: function() {
            return isMuted;
        },
        playClick: function() {
            if (isMuted) return;
            const c = getContext();
            if (!c) return;

            const osc = c.createOscillator();
            const gain = c.createGain();
            const now = c.currentTime;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(c.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        },
        playSuccess: function() {
            if (isMuted) return;
            const c = getContext();
            if (!c) return;

            const now = c.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

            notes.forEach((freq, idx) => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                const startTime = now + idx * 0.08;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.2, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

                osc.connect(gain);
                gain.connect(c.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.25);
            });
        },
        playError: function() {
            if (isMuted) return;
            const c = getContext();
            if (!c) return;

            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(160, now + 0.12);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

            osc.connect(gain);
            gain.connect(c.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        },
        playTick: function() {
            if (isMuted) return;
            const c = getContext();
            if (!c) return;

            const now = c.currentTime;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

            osc.connect(gain);
            gain.connect(c.destination);

            osc.start(now);
            osc.stop(now + 0.03);
        },
        playFanfare: function() {
            if (isMuted) return;
            const c = getContext();
            if (!c) return;

            const now = c.currentTime;
            const sequence = [
                { f: 523.25, t: 0.0, d: 0.15 },
                { f: 659.25, t: 0.12, d: 0.15 },
                { f: 783.99, t: 0.24, d: 0.18 },
                { f: 1046.50, t: 0.40, d: 0.45 }
            ];

            sequence.forEach(item => {
                const osc = c.createOscillator();
                const gain = c.createGain();
                const s = now + item.t;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(item.f, s);

                gain.gain.setValueAtTime(0.25, s);
                gain.gain.exponentialRampToValueAtTime(0.001, s + item.d);

                osc.connect(gain);
                gain.connect(c.destination);

                osc.start(s);
                osc.stop(s + item.d);
            });
        }
    };
})();
