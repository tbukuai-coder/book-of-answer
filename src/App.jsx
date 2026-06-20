import { useState, useRef, useCallback } from 'react';
import './App.css';
import answers from './answers';

const TOTAL = answers.length; // 100

function App() {
  const [phase, setPhase] = useState('idle'); // idle | spinning | revealed
  const [currentNumber, setCurrentNumber] = useState(null);
  const [answerIndex, setAnswerIndex] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const startSpin = useCallback(() => {
    if (phase === 'spinning') return;
    setPhase('spinning');

    // Pick a random target index (0–99)
    const target = Math.floor(Math.random() * TOTAL);
    setAnswerIndex(target);

    // Number cycling effect
    let count = 0;
    const totalSteps = 30 + Math.floor(Math.random() * 20); // 30-50 steps
    let speed = 50; // start fast

    const tick = () => {
      count++;
      const displayNum = Math.floor(Math.random() * TOTAL);
      setCurrentNumber(displayNum);

      if (count >= totalSteps) {
        // Land on the target
        setCurrentNumber(target);
        setPhase('revealed');
        return;
      }

      // Slow down progressively
      if (count > totalSteps * 0.6) speed += 30;
      if (count > totalSteps * 0.8) speed += 60;
      if (count > totalSteps * 0.9) speed += 120;

      timeoutRef.current = setTimeout(tick, speed);
    };

    timeoutRef.current = setTimeout(tick, speed);
  }, [phase]);

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('idle');
    setCurrentNumber(null);
    setAnswerIndex(null);
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
          {/* Spine / book visual */}
          <div className="book-spine" />

          {/* Number display */}
          <div className="book-display">
            {phase === 'idle' && (
              <div className="book-inner">
                <div className="book-question">?</div>
                <div className="book-hint">Click to open</div>
              </div>
            )}

            {phase === 'spinning' && (
              <div className="book-inner spinning">
                <div className="number-label">Turning the pages...</div>
                <div className="number-display">
                  {currentNumber !== null ? String(currentNumber + 1).padStart(2, '0') : '--'}
                </div>
              </div>
            )}

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
