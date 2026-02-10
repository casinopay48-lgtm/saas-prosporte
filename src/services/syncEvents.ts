type Unsubscribe = () => void;

const listeners: Array<() => void> = [];

export const onSyncRequested = (cb: () => void): Unsubscribe => {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

export const emitSyncRequested = () => {
  listeners.slice().forEach((cb) => {
    try { cb(); } catch (e) { /* swallow */ }
  });
};

export default null;
