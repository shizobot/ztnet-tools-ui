import { useEffect } from 'react';

import { useNetworks } from '../../hooks/useNetworks';

export function NetworksPanel() {
  const { networks, loadNetworksData } = useNetworks();

  useEffect(() => {
    void loadNetworksData();
  }, [loadNetworksData]);

  return (
    <section>
      <h2>Networks</h2>
      <ul>
        {networks.map((network) => (
          <li key={network.id}>{network.name ?? network.id}</li>
        ))}
      </ul>
    </section>
  );
}
