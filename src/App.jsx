import { useState, useRef, useCallback } from 'react';
import './App.css';
import answers from './answers';

const TOTAL = answers.length; // 100

function App() {
  const [phase, setPhase] = useState('idle');
  // idle | spinning | stopping | pageflip | revealed
  const [currentNumber, setCurrentNumber] = useState(null);
  const [answerIndex, setAnswerIndex] = useState(null);
  const [flipProgress, setFlipProgress] = useState(0);
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);

  const startSpin = useCallback(() => {
    if (phase === 'spinning' || phase === 'stopping' || phase === 'pageflip') return;
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
        // Landed — show the landed number briefly, then start page flip
        setCurrentNumber(target);
        setPhase('stopping');
        timeoutRef.current = setTimeout(() => {
          startPageFlip(target);
        }, 800);
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

  const startPageFlip = (target) => {
    setPhase('pageflip');
    setFlipProgress(0);

    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setFlipProgress(progress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Flip complete — reveal the answer
        setPhase('revealed');
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase('idle');
    setCurrentNumber(null);
    setAnswerIndex(null);
    setFlipProgress(0);
  };

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

            {/* ---- STOPPING (number landed, brief pause) ---- */}
            {phase === 'stopping' && (
              <div className="book-inner stopping">
                <div className="number-label">Page found</div>
                <div className="number-display landed">
                  {currentNumber !== null ? String(currentNumber + 1).padStart(2, '0') : '--'}
                </div>
              </div>
            )}

            {/* ---- PAGE FLIP ---- */}
            {phase === 'pageflip' && (
              <div className="book-inner pageflip">
                <div className="page-flip-container">
                  <div
                    className="page-flip-right"
                    style={{
                      transform: `rotateY(${flipProgress * 180}deg)`,
                    }}
                  >
                    <div className="page-flip-face page-flip-front">
                      <div className="number-display">
                        {currentNumber !== null ? String(currentNumber + 1).padStart(2, '0') : '--'}
                      </div>
                      <div className="page-flip-hint">Page {currentNumber !== null ? currentNumber + 1 : '--'}</div>
                    </div>
                    <div className="page-flip-face page-flip-back">
                      <p className="answer-text-preview">
                        {answerIndex !== null ? answers[answerIndex] : ''}
                      </p>
                    </div>
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
          {phase === 'revealed' && (
            <button className="btn btn-secondary" onClick={reset}>
              Close
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
