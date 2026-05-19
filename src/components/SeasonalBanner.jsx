import { fmtGreg } from '../constants.js';
import { ASATRU_HOLIDAYS } from '../holidays.js';

export default function SeasonalBanner({
  meta, year, viewMode, onSetViewMode,
  onPrev, onNext, onToday, onSettings,
}) {
  const { name, letter, theme, range } = meta;

  const matchMap = {
    'Alpha':'M01','Beta':'M02','Gamma':'M03','Delta':'M04','Epsilon':'M05',
    'Zeta':'M06','Eta':'M07','Theta':'M08','Iota':'M09','Kappa':'M10',
    'Lambda':'M11','Mu':'M12','Nu':'M13','Planning Day':'PLANNING',
  };
  const resolvedMonthId = matchMap[name];
  const holidayCount = ASATRU_HOLIDAYS.filter(h => h.greekMonth === resolvedMonthId).length;

  return (
    <header style={{
      position: 'relative',
      padding: '16px 16px 14px',
      borderBottom: `1px solid var(--border-subtle)`,
      background: `linear-gradient(180deg, ${theme.color}1a 0%, transparent 100%)`,
      overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: -40, left: '50%',
        transform: 'translateX(-50%)',
        width: 240, height: 80,
        background: `radial-gradient(ellipse, ${theme.color}38 0%, transparent 70%)`,
        pointerEvents: 'none',
        filter: 'blur(20px)',
      }} />

      {/* Top row: prev / today / next / settings */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
      }}>
        <NavBtn onClick={onPrev}>‹</NavBtn>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={onToday} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.25em',
            color: 'var(--text-muted)',
            padding: '4px 10px',
            borderRadius: 3,
            border: '1px solid var(--border-mid)',
          }}>
            TODAY
          </button>
          <button onClick={onSettings} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: 'var(--text-muted)',
            padding: '4px 8px',
            borderRadius: 3,
            border: '1px solid var(--border-mid)',
            lineHeight: 1,
          }} title="Categories">
            ⚙
          </button>
        </div>

        <NavBtn onClick={onNext}>›</NavBtn>
      </div>

      {/* Month display */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: theme.color,
          marginBottom: 3,
          opacity: 0.9,
        }}>
          {theme.theme}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 42,
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}>
          <span style={{ color: theme.color, marginRight: 10, fontWeight: 600 }}>
            {letter}
          </span>
          {name}
        </h1>

        <div style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--text-muted)',
          marginTop: 5,
          letterSpacing: '0.05em',
        }}>
          {theme.meaning}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-faint)',
          marginTop: 6,
          letterSpacing: '0.1em',
        }}>
          {fmtGreg(range.start)} – {fmtGreg(range.end)} · {year}
          {holidayCount > 0 && (
            <span style={{ color: theme.color, opacity: 0.7, marginLeft: 8 }}>
              · {holidayCount} marked
            </span>
          )}
        </div>
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, position: 'relative' }}>
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-mid)',
          borderRadius: 4,
          padding: 2,
          gap: 2,
        }}>
          <ToggleBtn active={viewMode === 'month'}  onClick={() => onSetViewMode('month')}  color={theme.color}>MONTH</ToggleBtn>
          <ToggleBtn active={viewMode === 'agenda'} onClick={() => onSetViewMode('agenda')} color={theme.color}>AGENDA</ToggleBtn>
        </div>
      </div>
    </header>
  );
}

function NavBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36,
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      color: 'var(--text-secondary)',
      lineHeight: 1,
    }}>
      {children}
    </button>
  );
}

function ToggleBtn({ active, onClick, color, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.2em',
      borderRadius: 3,
      background: active ? `${color}28` : 'transparent',
      color: active ? color : 'var(--text-muted)',
      transition: 'all 0.15s ease',
    }}>
      {children}
    </button>
  );
}
