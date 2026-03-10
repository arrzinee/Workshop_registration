import React, { useState, useEffect } from 'react';

// ─── Config ───────────────────────────────────────────────────────────────────
// Change this to your server's IP when running across network
const API_BASE = "http://localhost:5000";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  global: `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Orbitron:wght@400;700;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #0a0e17;
      color: #c9d1d9;
      font-family: 'JetBrains Mono', monospace;
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0e17; }
    ::-webkit-scrollbar-thumb { background: #00ff88; border-radius: 3px; }

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes glitch {
      0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px); }
      25% { clip-path: inset(92% 0 1% 0); transform: translate(2px); }
      50% { clip-path: inset(43% 0 1% 0); transform: translate(-1px); }
      75% { clip-path: inset(25% 0 58% 0); transform: translate(1px); }
      100% { clip-path: inset(40% 0 61% 0); transform: translate(-2px); }
    }
    @keyframes pulse-green {
      0%, 100% { box-shadow: 0 0 8px #00ff8855; }
      50% { box-shadow: 0 0 24px #00ff88aa, 0 0 48px #00ff8833; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes rowFadeIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes success-pop {
      0% { transform: scale(0.8); opacity: 0; }
      60% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
  `,
};

// ─── App Component ────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('register'); // 'register' | 'participants'
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState(null);
  const [terminalLog, setTerminalLog] = useState([
    '> Workshop Registration System v1.0',
    '> DevOps & Web Development Workshop',
    '> Server: ONLINE | Status: READY',
    '> Awaiting input...',
  ]);

  const addLog = (msg) => setTerminalLog(prev => [...prev.slice(-8), `> ${msg}`]);

  // ── Register Handler ─────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!name.trim() || !department.trim()) {
      setError('Both fields are required.');
      addLog('ERROR: Missing required fields');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    addLog(`Submitting registration for ${name}...`);

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), department: department.trim() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccess(data.message);
      addLog(`SUCCESS: ${name} registered in ${department}`);
      addLog('File write complete — async I/O callback fired');
      setName('');
      setDepartment('');
    } catch (err) {
      setError(err.message);
      addLog(`ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Load Participants ────────────────────────────────────────────────────
  const loadParticipants = async () => {
    setParticipantsLoading(true);
    setParticipantsError(null);
    addLog('Fetching participants from server...');

    try {
      const res = await fetch(`${API_BASE}/participants`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load participants');
      setParticipants(data.participants);
      addLog(`Loaded ${data.total} participant(s)`);
    } catch (err) {
      setParticipantsError(err.message);
      addLog(`ERROR: ${err.message}`);
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'participants') loadParticipants();
  }, [view]);

  const departments = [
    'Computer Science', 'Information Technology', 'Electronics & Communication',
    'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
    'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Other',
  ];

  return (
    <>
      <style>{styles.global}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', animation: 'fadeUp 0.6s ease' }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header style={{
          borderBottom: '1px solid #00ff8830',
          padding: '20px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0d1117 0%, #0a0e17 100%)',
          position: 'sticky', top: 0, zIndex: 100,
          backdropFilter: 'blur(12px)',
        }}>
          <div>
            <div style={{
              fontFamily: 'Orbitron, monospace', fontSize: '22px',
              fontWeight: 900, color: '#00ff88', letterSpacing: '3px',
              textShadow: '0 0 20px #00ff8866',
            }}>
              WORKSHOP<span style={{ color: '#fff' }}>_</span>REG
              <span style={{ animation: 'blink 1s infinite', color: '#00ff88' }}>█</span>
            </div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '2px', marginTop: '4px' }}>
              DEVOPS & WEB DEVELOPMENT • REGISTRATION PORTAL
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {[['register', '[ REGISTER ]'], ['participants', '[ VIEW ALL ]']].map(([id, label]) => (
              <button key={id} onClick={() => setView(id)} style={{
                background: view === id ? '#00ff8815' : 'transparent',
                border: `1px solid ${view === id ? '#00ff88' : '#333'}`,
                color: view === id ? '#00ff88' : '#666',
                padding: '8px 16px', cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                letterSpacing: '1px', transition: 'all 0.2s',
                borderRadius: '2px',
              }}>{label}</button>
            ))}
          </div>
        </header>

        <div style={{ display: 'flex', flex: 1, gap: 0 }}>

          {/* ── Main Content ──────────────────────────────────────────────── */}
          <main style={{ flex: 1, padding: '48px 40px', maxWidth: '700px', margin: '0 auto', width: '100%' }}>

            {view === 'register' && (
              <div style={{ animation: 'fadeUp 0.4s ease' }}>
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ fontSize: '11px', color: '#00ff88', letterSpacing: '3px', marginBottom: '8px' }}>
                    // STUDENT REGISTRATION
                  </div>
                  <h1 style={{
                    fontFamily: 'Orbitron, monospace', fontSize: '36px',
                    fontWeight: 700, color: '#e6edf3', lineHeight: 1.2,
                  }}>
                    Join the<br /><span style={{ color: '#00ff88' }}>Workshop</span>
                  </h1>
                  <p style={{ color: '#666', fontSize: '13px', marginTop: '12px', lineHeight: 1.7 }}>
                    Fill in your details below. Your registration is saved<br />
                    asynchronously — no waiting, no blocking.
                  </p>
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* Name Field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#00ff88', letterSpacing: '2px', marginBottom: '8px' }}>
                      STUDENT_NAME
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); setError(null); setSuccess(null); }}
                      placeholder="Enter your full name"
                      onKeyDown={e => e.key === 'Enter' && handleRegister()}
                      style={{
                        width: '100%', background: '#0d1117',
                        border: '1px solid #21262d', borderRadius: '4px',
                        color: '#e6edf3', padding: '14px 16px',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '14px',
                        outline: 'none', transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00ff88'}
                      onBlur={e => e.target.style.borderColor = '#21262d'}
                    />
                  </div>

                  {/* Department Field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#00ff88', letterSpacing: '2px', marginBottom: '8px' }}>
                      DEPARTMENT
                    </label>
                    <select
                      value={department}
                      onChange={e => { setDepartment(e.target.value); setError(null); setSuccess(null); }}
                      style={{
                        width: '100%', background: '#0d1117',
                        border: '1px solid #21262d', borderRadius: '4px',
                        color: department ? '#e6edf3' : '#666',
                        padding: '14px 16px',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '14px',
                        outline: 'none', cursor: 'pointer', appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2300ff88' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00ff88'}
                      onBlur={e => e.target.style.borderColor = '#21262d'}
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{
                      background: '#ff444415', border: '1px solid #ff444440',
                      borderLeft: '3px solid #ff4444', padding: '12px 16px',
                      color: '#ff8888', fontSize: '13px', borderRadius: '2px',
                    }}>
                      ✗ {error}
                    </div>
                  )}

                  {/* Success */}
                  {success && (
                    <div style={{
                      background: '#00ff8815', border: '1px solid #00ff8840',
                      borderLeft: '3px solid #00ff88', padding: '16px',
                      borderRadius: '2px', animation: 'success-pop 0.4s ease',
                    }}>
                      <div style={{ color: '#00ff88', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                        ✓ Registration Successful!
                      </div>
                      <div style={{ color: '#88cc88', fontSize: '12px' }}>{success}</div>
                      <div style={{ marginTop: '12px' }}>
                        <button onClick={() => setView('participants')} style={{
                          background: 'transparent', border: '1px solid #00ff8860',
                          color: '#00ff88', padding: '6px 14px', cursor: 'pointer',
                          fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                          letterSpacing: '1px', borderRadius: '2px',
                        }}>
                          VIEW ALL PARTICIPANTS →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    style={{
                      background: loading ? '#00ff8820' : '#00ff8818',
                      border: '1px solid #00ff88',
                      color: '#00ff88', padding: '16px',
                      fontFamily: 'Orbitron, monospace', fontSize: '13px',
                      fontWeight: 700, letterSpacing: '3px', cursor: loading ? 'not-allowed' : 'pointer',
                      borderRadius: '4px', transition: 'all 0.2s',
                      animation: !loading ? 'pulse-green 2s infinite' : 'none',
                    }}
                    onMouseEnter={e => { if (!loading) e.target.style.background = '#00ff8830'; }}
                    onMouseLeave={e => { if (!loading) e.target.style.background = '#00ff8818'; }}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <span style={{
                          width: '14px', height: '14px', border: '2px solid #00ff8840',
                          borderTopColor: '#00ff88', borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite', display: 'inline-block',
                        }} />
                        PROCESSING...
                      </span>
                    ) : '[ REGISTER NOW ]'}
                  </button>
                </div>
              </div>
            )}

            {view === 'participants' && (
              <div style={{ animation: 'fadeUp 0.4s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#00ff88', letterSpacing: '3px', marginBottom: '8px' }}>
                      // PARTICIPANTS LIST
                    </div>
                    <h1 style={{
                      fontFamily: 'Orbitron, monospace', fontSize: '30px',
                      fontWeight: 700, color: '#e6edf3',
                    }}>
                      Registered<br /><span style={{ color: '#00ff88' }}>Students</span>
                    </h1>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{
                      fontFamily: 'Orbitron, monospace', fontSize: '36px',
                      fontWeight: 900, color: '#00ff88',
                      textShadow: '0 0 20px #00ff8866',
                    }}>
                      {participants.length.toString().padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', letterSpacing: '2px' }}>TOTAL</div>
                    <button onClick={loadParticipants} style={{
                      background: 'transparent', border: '1px solid #333',
                      color: '#666', padding: '6px 12px', cursor: 'pointer',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                      letterSpacing: '1px', borderRadius: '2px',
                    }}>↻ REFRESH</button>
                  </div>
                </div>

                {participantsLoading && (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#00ff88' }}>
                    <div style={{
                      width: '32px', height: '32px', border: '2px solid #00ff8820',
                      borderTopColor: '#00ff88', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                    }} />
                    <div style={{ fontSize: '12px', letterSpacing: '2px' }}>LOADING DATA...</div>
                  </div>
                )}

                {participantsError && (
                  <div style={{
                    background: '#ff444415', border: '1px solid #ff444440',
                    borderLeft: '3px solid #ff4444', padding: '16px',
                    color: '#ff8888', fontSize: '13px', borderRadius: '2px',
                  }}>
                    ✗ {participantsError}
                  </div>
                )}

                {!participantsLoading && !participantsError && participants.length === 0 && (
                  <div style={{
                    textAlign: 'center', padding: '60px 20px',
                    border: '1px dashed #21262d', borderRadius: '4px', color: '#444',
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
                    <div style={{ fontSize: '13px', letterSpacing: '1px' }}>NO PARTICIPANTS YET</div>
                    <div style={{ fontSize: '11px', marginTop: '8px', color: '#333' }}>Be the first to register!</div>
                  </div>
                )}

                {!participantsLoading && participants.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr',
                      padding: '8px 16px', fontSize: '10px', color: '#666',
                      letterSpacing: '2px', borderBottom: '1px solid #21262d',
                    }}>
                      <span>#</span><span>NAME</span><span>DEPARTMENT</span><span>TIMESTAMP</span>
                    </div>

                    {participants.map((p, i) => (
                      <div key={p.id} style={{
                        display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr',
                        padding: '14px 16px',
                        background: i % 2 === 0 ? '#0d111700' : '#0d111780',
                        border: '1px solid #21262d',
                        borderRadius: '3px', fontSize: '13px',
                        animation: `rowFadeIn 0.3s ease ${i * 0.04}s both`,
                        alignItems: 'center',
                      }}>
                        <span style={{ color: '#444', fontWeight: 700 }}>
                          {p.id.toString().padStart(2, '0')}
                        </span>
                        <span style={{ color: '#00ff88', fontWeight: 500 }}>{p.name}</span>
                        <span style={{ color: '#8b949e', fontSize: '12px' }}>{p.department}</span>
                        <span style={{ color: '#444', fontSize: '10px' }}>
                          {new Date(p.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>

          {/* ── Terminal Sidebar ─────────────────────────────────────────── */}
          <aside style={{
            width: '280px', borderLeft: '1px solid #00ff8820',
            background: '#0d1117', padding: '24px 20px',
            display: 'flex', flexDirection: 'column', gap: '16px',
            fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
          }}>
            <div>
              <div style={{ color: '#00ff88', letterSpacing: '2px', marginBottom: '12px', fontSize: '10px' }}>
                ┌─ SYSTEM LOG
              </div>
              <div style={{
                background: '#020408', border: '1px solid #00ff8820',
                borderRadius: '4px', padding: '12px',
                minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '6px',
              }}>
                {terminalLog.map((line, i) => (
                  <div key={i} style={{
                    color: line.includes('ERROR') ? '#ff6666' :
                           line.includes('SUCCESS') ? '#00ff88' : '#4a9967',
                    fontSize: '10px', lineHeight: 1.5, wordBreak: 'break-all',
                  }}>
                    {line}
                  </div>
                ))}
                <span style={{ animation: 'blink 1s infinite', color: '#00ff88' }}>█</span>
              </div>
            </div>

            {/* Node.js Architecture Info */}
            <div style={{ borderTop: '1px solid #21262d', paddingTop: '16px' }}>
              <div style={{ color: '#00ff88', letterSpacing: '2px', marginBottom: '12px', fontSize: '10px' }}>
                ┌─ ARCHITECTURE
              </div>
              {[
                ['Event Loop', 'ACTIVE'],
                ['I/O Model', 'NON-BLOCKING'],
                ['File Write', 'ASYNC CALLBACK'],
                ['Concurrency', 'EVENT-DRIVEN'],
                ['Server', 'EXPRESS.JS'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #0d1117' }}>
                  <span style={{ color: '#555' }}>{k}</span>
                  <span style={{ color: '#00ff88', fontSize: '10px' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Network Info */}
            <div style={{ borderTop: '1px solid #21262d', paddingTop: '16px' }}>
              <div style={{ color: '#00ff88', letterSpacing: '2px', marginBottom: '12px', fontSize: '10px' }}>
                ┌─ NETWORK ACCESS
              </div>
              <div style={{ color: '#555', fontSize: '10px', lineHeight: 1.8 }}>
                Backend:
                <div style={{ color: '#8b949e' }}>http://&lt;YOUR_IP&gt;:5000</div>
                <div style={{ marginTop: '8px' }}>Frontend:</div>
                <div style={{ color: '#8b949e' }}>http://&lt;YOUR_IP&gt;:3000</div>
                <div style={{ marginTop: '8px', color: '#444' }}>
                  Share your IP so classmates can register from their devices!
                </div>
              </div>
            </div>

            {/* Status */}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#00ff88', animation: 'pulse-green 1.5s infinite',
              }} />
              <span style={{ color: '#00ff88', fontSize: '10px', letterSpacing: '1px' }}>SYSTEM ONLINE</span>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}