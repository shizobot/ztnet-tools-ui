import { useEffect, useState } from 'react';

import { useNetworkConfig } from '../../hooks/useNetworkConfig';

export function NetworkConfigPanel() {
  const { loadNetworkConfig, saveNetworkConfig, deleteNetwork } = useNetworkConfig();
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    void loadNetworkConfig();
  }, [loadNetworkConfig]);

  const handleSave = async () => {
    await saveNetworkConfig({ config: {} });
    setStatus('Saved');
  };

  const handleDelete = async () => {
    await deleteNetwork();
    setStatus('Deleted');
  };

  return (
    <section>
      <h2>Network config</h2>
      <button onClick={() => void handleSave()}>Save</button>
      <button onClick={() => void handleDelete()}>Delete</button>
      <p>{status}</p>
    </section>
  );
}
