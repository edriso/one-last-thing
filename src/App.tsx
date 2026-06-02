import { useEffect, useState } from 'react';
import { SettingsOverlay } from '@/components/settings-overlay';
import { useApplyAccent } from '@/hooks/use-apply-accent';
import { formatClock } from '@/lib/format';
import { useOltStore } from '@/store/olt-store';
import type { Phase } from '@/types/domain';

function StepDots({ step }: { step: number }) {
  return (
    <div className="step-dots" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <span key={i} className={'sd' + (step >= i ? ' on' : '')} />
      ))}
    </div>
  );
}

export function App() {
  useApplyAccent();
  const tidySecs = useOltStore((state) => state.settings.tidySecs);
  const saveIntention = useOltStore((state) => state.saveIntention);

  const [phase, setPhase] = useState<Phase>('intro');
  const [left, setLeft] = useState(tidySecs);
  const [intent, setIntent] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // The tidy countdown auto-advances to the intention step.
  useEffect(() => {
    if (phase !== 'tidy') {
      return;
    }
    setLeft(tidySecs);
    let secondsLeft = tidySecs;
    const id = setInterval(() => {
      secondsLeft -= 1;
      setLeft(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(id);
        setPhase('intention');
      }
    }, 1000);
    return () => clearInterval(id);
  }, [phase, tidySecs]);

  function finish() {
    const text = intent.trim();
    if (!text) {
      return;
    }
    saveIntention(new Date().toDateString(), text);
    setPhase('done');
  }

  return (
    <div className="app">
      {phase === 'intro' && (
        <button
          className="corner"
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          ⚙
        </button>
      )}
      <div className="stage">
        <div className="word">One Last Thing</div>

        {phase === 'intro' && (
          <div className="rise">
            <h1 className="h1">
              Close the day.
              <br />
              Three minutes.
            </h1>
            <p className="sub">
              Tidy one surface, set tomorrow&rsquo;s single intention, then lights out. A gentler
              ending than the scroll.
            </p>
            <button className="cta" type="button" onClick={() => setPhase('tidy')}>
              Begin
            </button>
          </div>
        )}

        {phase === 'tidy' && (
          <div className="rise">
            <StepDots step={1} />
            <h1 className="h1">Tidy one surface.</h1>
            <p className="sub">
              Just one. Your nightstand, the desk, the kitchen counter. Future-you will exhale.
            </p>
            <div className="big" aria-live="polite">
              {formatClock(left)}
            </div>
            <button className="cta ghost" type="button" onClick={() => setPhase('intention')}>
              Done early
            </button>
          </div>
        )}

        {phase === 'intention' && (
          <div className="rise">
            <StepDots step={2} />
            <h1 className="h1">Tomorrow, one thing.</h1>
            <p className="sub">Not a list. The single thing that would make tomorrow feel good.</p>
            <input
              className="field"
              autoFocus
              value={intent}
              aria-label="Tomorrow's one intention"
              onChange={(e) => setIntent(e.target.value)}
              placeholder="tomorrow I will…"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && intent.trim()) finish();
              }}
            />
            <button
              className="cta"
              type="button"
              onClick={finish}
              disabled={!intent.trim()}
              style={{ opacity: intent.trim() ? 1 : 0.5 }}
            >
              Set it down
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="rise">
            <StepDots step={3} />
            <h1 className="h1">That&rsquo;s everything.</h1>
            <p className="sub">
              {intent.trim() ? (
                <>
                  Tomorrow: <em style={{ color: 'var(--ink)' }}>{intent.trim()}</em>. It&rsquo;ll
                  keep till morning.
                </>
              ) : (
                "Rest now. It'll keep till morning."
              )}
            </p>
            <p
              className="sub"
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 19,
                color: 'var(--accent)',
              }}
            >
              Lights out. Phone down. Goodnight.
            </p>
            <button
              className="cta ghost"
              type="button"
              onClick={() => {
                setPhase('intro');
                setIntent('');
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
