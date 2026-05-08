import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScanScenarios, simulateQrScan, validateManualShareSlug } from '../mocks/api/shareLinkApi';

export default function DemoQRScanner() {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    getScanScenarios().then((items) => {
      if (!mounted || !items.length) return;
      setScenarios(items);
      setSelectedScenarioId(items[0].id);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSimulateScan = async () => {
    const result = await simulateQrScan(selectedScenarioId);
    navigate(`/p/${result.shareSlug}`);
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    const result = await validateManualShareSlug(manualCode);
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage('');
    navigate(`/p/${result.shareSlug}`);
  };

  return (
    <section style={{ margin: '1.5rem 0', padding: '1rem', border: '1px solid #dbc6aa', borderRadius: 16, background: '#fff' }}>
      <h2 style={{ marginTop: 0 }}>Demo QR Scanner</h2>
      <div style={{ position: 'relative', height: 180, borderRadius: 16, background: 'linear-gradient(145deg, #1f2937, #374151)', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ position: 'absolute', inset: 20, border: '2px solid rgba(255,255,255,0.75)', borderRadius: 14 }} />
        <div style={{ position: 'absolute', top: 8, left: 16, color: '#fff', fontSize: 12 }}>Camera Preview (Demo)</div>
      </div>

      <label htmlFor="scenario-select">Scenario</label>
      <select
        id="scenario-select"
        className="input"
        style={{ display: 'block', marginBottom: 12, width: '100%' }}
        value={selectedScenarioId}
        onChange={(event) => setSelectedScenarioId(event.target.value)}
      >
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>{scenario.label} ({scenario.shareSlug})</option>
        ))}
      </select>

      <button type="button" onClick={handleSimulateScan}>Simulate Scan</button>

      <form onSubmit={handleManualSubmit} style={{ marginTop: 16 }}>
        <label htmlFor="manual-code">Manual code entry</label>
        <input
          id="manual-code"
          className="input"
          placeholder="Enter share code (e.g., demo-share)"
          value={manualCode}
          onChange={(event) => setManualCode(event.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <button type="submit">Open Code</button>
      </form>

      {errorMessage && <p style={{ color: '#b42318' }}>{errorMessage}</p>}
    </section>
  );
}
