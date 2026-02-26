import { useCallback } from 'react';

export function useArrayFieldEditor<T>(onUpdate: (updater: (items: T[]) => T[]) => void) {
  const updateItem = useCallback(
    (index: number, updater: (item: T) => T) => {
      onUpdate((items) => items.map((item, idx) => (idx === index ? updater(item) : item)));
    },
    [onUpdate],
  );

  const replaceItem = useCallback(
    (index: number, value: T) => {
      updateItem(index, () => value);
    },
    [updateItem],
  );

  const removeItem = useCallback(
    (index: number) => {
      onUpdate((items) => items.filter((_, idx) => idx !== index));
    },
    [onUpdate],
  );

  const appendItem = useCallback(
    (value: T) => {
      onUpdate((items) => [...items, value]);
    },
    [onUpdate],
  );

  return {
    appendItem,
    removeItem,
    replaceItem,
    updateItem,
  };
}
