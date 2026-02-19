import { useEffect } from 'react';
import ArkaLogo from './ArkaLogo.jsx';

const ArkaAnimation = ({ onAnimationComplete }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onAnimationComplete]);

  useEffect(() => {
    // Arka Starting Animation Script
    var text = 'INNOVATE · CREATE · DELIVER';
    var typingDiv = document.getElementById('typingText');
    var i = 0;

    // Clear any existing content first
    if (typingDiv) {
      typingDiv.innerHTML = '';
    }

    // WebAudio typing sound: mechanical keyboard/typewriter-like
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    try { audioCtx = new AudioCtx(); } catch (e) { audioCtx = null; }

    // Create a short noise buffer for the "clack"
    function makeNoiseBuffer() {
      const duration = 0.03; // 30ms noise
      const sampleRate = audioCtx.sampleRate;
      const buffer = audioCtx.createBuffer(1, duration * sampleRate, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length); // slight decay
      }
      return buffer;
    }

    let noiseBuffer = null;

    function playTypeMech() {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      if (!noiseBuffer) noiseBuffer = makeNoiseBuffer();

      // Noise burst (key click)
      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(4000 + Math.random() * 1000, now);
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.2, now + 0.006);
      noiseGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.06);
      noise.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.05);

      // Low thump (mechanical action)
      const thump = audioCtx.createOscillator();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(120 + Math.random() * 40, now);
      const thumpGain = audioCtx.createGain();
      thumpGain.gain.setValueAtTime(0.0001, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.10, now + 0.012);
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.10);
      thump.connect(thumpGain).connect(audioCtx.destination);
      thump.start(now);
      thump.stop(now + 0.08);
    }

    function playTypeBell() {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const bell = audioCtx.createOscillator();
      bell.type = 'triangle';
      bell.frequency.setValueAtTime(880, now);
      const bellGain = audioCtx.createGain();
      bellGain.gain.setValueAtTime(0.0001, now);
      bellGain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      bell.connect(bellGain).connect(audioCtx.destination);
      bell.start(now);
      bell.stop(now + 0.55);
    }

    function typeWriter() {
      if (i < text.length && typingDiv) {
        const ch = text.charAt(i);
        typingDiv.innerHTML += ch;
        // attempt to resume context in case it was suspended by autoplay policy
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => { });
        }
        // Play click only for letters (A-Z)
        if (/[A-Za-z]/.test(ch)) {
          playTypeMech();
        }
        i++;
        setTimeout(typeWriter, 85);
      } else {
        // end-of-line bell once typing completes
        playTypeBell();
        // Start the final convergence sequence after typing is complete
        setTimeout(startFinalSequence, 500);
      }
    }

    function startFinalSequence() {
      const mainContainer = document.getElementById('mainContainer');
      const fadeTextContainer = document.querySelector('.fade-text-container');
      const fadeText = document.querySelector('.fade-text');
      const ArkaLogo = document.getElementById('ArkaLogo');

      if (!mainContainer || !fadeTextContainer || !fadeText || !ArkaLogo) return;

      // Add final state class to container
      mainContainer.classList.add('final-state');

      // First: Show the logo with animation
      ArkaLogo.classList.add('visible');

      // Immediately start fading and minimizing the text when logo appears
      setTimeout(() => {
        fadeTextContainer.classList.add('converged');
        fadeText.classList.add('converged');
      }, 100);

      const finishDelay = isMobile ? 2000 : 800;

      // Show main content after the delay
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, finishDelay);
    }

    const isMobile = window.innerWidth <= 1024;

    let typingTimer;
    let moveTimer;

    // Show full animation on both mobile and desktop
    // Mobile gets slightly faster timing
    const typingDelay = isMobile ? 2000 : 3500;
    const moveDelay = isMobile ? 5500 : 7500;

    typingTimer = setTimeout(typeWriter, typingDelay);

    // Move ARKAA to top after delay
    moveTimer = setTimeout(function () {
      const mainContainer = document.getElementById('mainContainer');
      if (mainContainer && !mainContainer.classList.contains('final-state')) {
        mainContainer.classList.add('top-center');
      }
    }, moveDelay);

    // Show borders after Arka moves to top
    const mainContainer = document.getElementById('mainContainer');
    const fadeTextContainer = document.querySelector('.fade-text-container');

    const handleTransitionEnd = function () {
      if (mainContainer && mainContainer.classList.contains('top-center') && fadeTextContainer) {
        fadeTextContainer.classList.add('borders-visible');
      }
    };

    if (mainContainer) {
      mainContainer.addEventListener('transitionend', handleTransitionEnd);
    }

    // Cleanup function
    return () => {
      if (typingTimer) clearTimeout(typingTimer);
      if (moveTimer) clearTimeout(moveTimer);
      if (mainContainer) {
        mainContainer.removeEventListener('transitionend', handleTransitionEnd);
      }
      // Reset typing div
      if (typingDiv) {
        typingDiv.innerHTML = '';
      }
    };
  }, [onAnimationComplete]);

  return (
    <div className="center-container" id="mainContainer">
      <div className="fade-text-container">
        <div className="fade-text">
          ARKAA
          <div className="black-div" id="typingText"></div>
        </div>
      </div>
      <ArkaLogo />
    </div>
  );
};

export default ArkaAnimation;