import { useState } from 'react';

import { useConnection } from '../../hooks/useConnection';

export function SettingsPanel() {
  const { savePrefs, loadPrefs, testConnection } = useConnection();
  const [status, setStatus] = useState<string>('');

  const handleTest = async () => {
    const isConnected = await testConnection();
    setStatus(isConnected ? 'Connected' : 'Disconnected');
  };

  return (
    <section>
      <h2>Settings</h2>
      <button onClick={loadPrefs}>Load prefs</button>
      <button onClick={savePrefs}>Save prefs</button>
      <button onClick={() => void handleTest()}>Test connection</button>
      <p>{status}</p>
    </section>
  );
}
