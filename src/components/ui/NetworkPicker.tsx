import { useMemo, useState } from 'react';

export type NetworkPickerItem = {
  id: string;
  name?: string;
};

type NetworkPickerProps = {
  networks: NetworkPickerItem[];
  onPick: (networkId: string) => void;
};

export function NetworkPicker({ networks, onPick }: NetworkPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const normalizedSearch = search.toLowerCase();

  const openNetworkPicker = () => {
    if (!networks.length) {
      return;
    }
    setSearch('');
    setIsOpen(true);
  };

  const closePicker = () => {
    setIsOpen(false);
  };

  const list = useMemo(
    () =>
      networks.filter(
        (nw) =>
          nw.id.toLowerCase().includes(normalizedSearch) ||
          (nw.name ?? '').toLowerCase().includes(normalizedSearch),
      ),
    [networks, normalizedSearch],
  );

  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={openNetworkPicker}>
        ≡ Pick
      </button>

      {isOpen && (
        <div id="pickerModal" className="picker-modal" role="dialog" aria-modal="true">
          <div className="picker-card">
            <div className="picker-hdr">
              <h3>Select network</h3>
              <button type="button" className="btn btn-ghost" onClick={closePicker}>
                Close
              </button>
            </div>
            <input
              id="pickerSearch"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by id or name"
            />
            <div id="pickerList">
              {list.map((nw) => (
                <button
                  key={nw.id}
                  type="button"
                  className="picker-item"
                  onClick={() => {
                    onPick(nw.id);
                    closePicker();
                  }}
                >
                  <span>{nw.id}</span>
                  <span>{nw.name || 'unnamed'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
