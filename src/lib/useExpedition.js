import { useEffect, useState } from 'react';

const UNLOCKS = [
  { time: 300, item: 'Compass' }, // 5 minutes
  { time: 900, item: 'SurveyorLens' }, // 15 minutes
  { time: 1800, item: 'Kith' } // 30 minutes
];

function loadInventory() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem('tethys_inventory');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useExpedition() {
  const [sessionTime, setSessionTime] = useState(0);
  const [inventory, setInventory] = useState(() => loadInventory());

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => {
        const updated = prev + 1;
        UNLOCKS.forEach(({ time, item }) => {
          if (updated === time) {
            unlockItem(item);
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unlockItem = (item) => {
    setInventory((prev) => {
      if (prev.includes(item)) return prev;
      const nextInventory = [...prev, item];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('tethys_inventory', JSON.stringify(nextInventory));
      }
      return nextInventory;
    });
  };

  return { sessionTime, inventory, unlockItem };
}
