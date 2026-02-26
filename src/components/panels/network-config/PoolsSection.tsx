type Pool = { ipRangeStart: string; ipRangeEnd: string };

type PoolEditor = {
  appendItem: (value: Pool) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updater: (item: Pool) => Pool) => void;
};

type PoolsSectionProps = {
  pools: Pool[];
  v6pools: Pool[];
  poolsEditor: PoolEditor;
  v6PoolsEditor: PoolEditor;
};

function PoolRows({
  pools,
  startPlaceholder,
  endPlaceholder,
  addLabel,
  editor,
}: {
  pools: Pool[];
  startPlaceholder: string;
  endPlaceholder: string;
  addLabel: string;
  editor: PoolEditor;
}) {
  return (
    <>
      {pools.map((pool, index) => (
        <div className="route-row" key={`${pool.ipRangeStart}-${pool.ipRangeEnd}-${index}`}>
          <input
            placeholder={startPlaceholder}
            value={pool.ipRangeStart}
            onChange={(event) =>
              editor.updateItem(index, (item) => ({ ...item, ipRangeStart: event.target.value }))
            }
          />
          <input
            placeholder={endPlaceholder}
            value={pool.ipRangeEnd}
            onChange={(event) =>
              editor.updateItem(index, (item) => ({ ...item, ipRangeEnd: event.target.value }))
            }
          />
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => editor.removeItem(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn"
        onClick={() => editor.appendItem({ ipRangeStart: '', ipRangeEnd: '' })}
      >
        {addLabel}
      </button>
    </>
  );
}

export function PoolsSection({ pools, v6pools, poolsEditor, v6PoolsEditor }: PoolsSectionProps) {
  return (
    <>
      <PoolRows
        pools={pools}
        startPlaceholder="Pool start"
        endPlaceholder="Pool end"
        addLabel="Add IPv4 Pool"
        editor={poolsEditor}
      />
      <PoolRows
        pools={v6pools}
        startPlaceholder="IPv6 pool start"
        endPlaceholder="IPv6 pool end"
        addLabel="Add IPv6 Pool"
        editor={v6PoolsEditor}
      />
    </>
  );
}
