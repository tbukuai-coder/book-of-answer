import { useState, useRef, useCallback } from 'react';
import './App.css';
import answers from './answers';

const TOTAL = answers.length; // 100

function App() {
  const [phase, setPhase] = useState('idle');
  // idle | spinning | shimmer | revealed
  const [currentNumber, setCurrentNumber] = useState(null);
  const [answerIndex, setAnswerIndex] = useState(null);
  const [shimmerProgress, setShimmerProgress] = useState(0);
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);

  const startSpin = useCallback(() => {
    if (phase !== 'idle' && phase !== 'revealed') return;
    setPhase('spinning');

    const target = Math.floor(Math.random() * TOTAL);
    setAnswerIndex(target);

    let count = 0;
    const totalSteps = 35 + Math.floor(Math.random() * 15);
    let speed = 45;

    const tick = () => {
      count++;
      setCurrentNumber(Math.floor(Math.random() * TOTAL));

      if (count >= totalSteps) {
        // Number lands — immediately start shimmer
        setCurrentNumber(target);
        startShimmer();
        return;
      }

      // Progressive slowdown
      if (count > totalSteps * 0.55) speed += 25;
      if (count > totalSteps * 0.75) speed += 50;
      if (count > totalSteps * 0.88) speed += 100;
      if (count > totalSteps * 0.95) speed += 200;

      timeoutRef.current = setTimeout(tick, speed);
    };

    timeoutRef.current = setTimeout(tick, speed);
  }, [phase]);

  const startShimmer = () => {
    setPhase('shimmer');
    setShimmerProgress(0);

    const duration = 1400;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setShimmerProgress(progress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('revealed');
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (rfRef.current) cancelAnimationFrame(rafRef.current);
    setPhase('idle');
    setCurrentNumber(null);
    setAnswerIndex(null);
    setShimmerProgress(0);
  };

  const shimmerParticles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    distance: 40 + Math.random() * 60,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="app">
      <div className="bg-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
          }} />
        ))}
      </div>

      <header className="header">
        <h1 className="title">
          <span className="title-icon">📖</span>
          The Book of Answers
        </h1>
        <p className="subtitle">Ask your question in your mind. Click to reveal.</p>
      </header>

      <main className="main">
        <div className={`book ${phase}`}>
          <div className="book-spine" />

          <div className="book-display">
            {/* ---- IDLE ---- */}
            {phase === 'idle' && (
              <div className="book-inner">
                <div className="book-question">?</div>
                <div className="book-hint">Click to open</div>
              </div>
            )}

            {/* ---- SPINNING ---- */}
            {phase === 'spinning' && (
              <div className="book-inner spinning">
                <div className="number-label">Turning the pages...</div>
                <div className="number-display">
                  {currentNumber !== null ? String(currentNumber + 1).padStart(2, '0') : '--'}
                </div>
              </div>
            )}

            {/* ---- SHIMMER ---- */}
            {phase === 'shimmer' && (
              <div className="book-inner shimmer">
                <div className="shimmer-container">
                  {shimmerParticles.map((p) => {
                    const rad = (p.angle * Math.PI) / 180;
                    const tx = Math.cos(rad) * p.distance * shimmerProgress;
                    const ty = Math.sin(rad) * p.distance * shimmerProgress;
                    const opacity = shimmerProgress > 0.1
                      ? Math.max(0, 1 - (shimmerProgress - p.delay) / (1 - p.delay))
                      : 0;

                    return (
                      <span
                        key={p.id}
                        className="shimmer-particle"
                        style={{
                          width: p.size,
                          height: p.size,
                          transform: `translate(${tx}px, ${ty}px)`,
                          opacity,
                          transitionDelay: `${p.delay}s`,
                        }}
                      />
                    );
                  })}

                  <div
                    className="number-display shimmer-out"
                    style={{
                      opacity: 1 - shimmerProgress * 1.5,
                      transform: `scale(${1 + shimmerProgress * 0.3})`,
                      filter: `blur(${shimmerProgress * 8}px)`,
                    }}
                  >
                    {currentNumber !== null ? String(currentNumber + 1).padStart(2, '0') : '--'}
                  </div>

                  <div
                    className="shimmer-answer"
                    style={{
                      opacity: shimmerProgress > 0.4 ? (shimmerProgress - 0.4) / 0.6 : 0,
                      transform: `scale(${0.8 + (shimmerProgress > 0.4 ? (shimmerProgress - 0.4) / 0.6 : 0) * 0.2})`,
                      filter: `blur(${Math.max(0, (1 - shimmerProgress) * 6)}px)`,
                    }}
                  >
                    <p className="answer-text">{answerIndex !== null ? answers[answerIndex] : ''}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ---- REVEALED ---- */}
            {phase === 'revealed' && answerIndex !== null && (
              <div className="book-inner revealed">
                <div className="answer-number">Page {currentNumber !== null ? currentNumber + 1 : '--'}</div>
                <div className="answer-divider">✦</div>
                <p className="answer-text">{answers[answerIndex]}</p>
              </div>
            )}
          </div>
        </div>

        <div className="controls">
          {(phase === 'idle' || phase === 'revealed') && (
            <button
              className={`btn btn-primary ${phase === 'idle' ? 'pulse' : ''}`}
              onClick={startSpin}
            >
              {phase === 'revealed' ? 'Ask Again' : 'Open the Book'}
            </button>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>100 answers from beyond • what you seek is seeking you</p>
      </footer>
    </div>
  );
}

export default App;
