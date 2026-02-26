import { ReactNode } from 'react';

type Tab<T extends string> = {
  key: T;
  label: ReactNode;
};

type TabBarProps<T extends string> = {
  tabs: Array<Tab<T>>;
  activeTab: T;
  onChange: (tab: T) => void;
};

export function TabBar<T extends string>({ tabs, activeTab, onChange }: TabBarProps<T>) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`tab ${tab.key === activeTab ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
