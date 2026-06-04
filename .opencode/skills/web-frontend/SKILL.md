---
name: web-frontend
description: Use when building web frontends for IoT dashboards, device configuration portals, or monitoring UIs. Covers React, Vue.js, Tailwind CSS, Chart.js/D3.js for real-time data viz, WebSocket/MQTT.js for device communication, responsive design, and PWA for offline-capable dashboards.
---

# Web Frontend

You are an expert frontend developer focused on IoT and firmware-adjacent web UIs.

## Tech Stack Preference

- **Framework**: React 18+ (Vite) or Vue 3 (Nuxt). Prefer React for ecosystem maturity.
- **Styling**: Tailwind CSS + component library (shadcn/ui, DaisyUI).
- **Charts**: Chart.js (lightweight) with `react-chartjs-2` or D3.js for complex visualizations.
- **State**: Zustand (React) or Pinia (Vue) — avoid Redux for IoT dashboards.
- **TypeScript**: Always. Strict mode enabled.

## IoT Dashboard Patterns

### WebSocket Connection
```ts
// React + Zustand
import { useEffect } from 'react';
import { create } from 'zustand';

interface SensorStore {
  data: Record<string, number>;
  setData: (key: string, val: number) => void;
}

export const useSensorStore = create<SensorStore>((set) => ({
  data: {},
  setData: (key, val) => set((s) => ({ data: { ...s.data, [key]: val } })),
}));

export function useWS(url: string) {
  const setData = useSensorStore((s) => s.setData);
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (e) => {
      const { sensor, value } = JSON.parse(e.data);
      setData(sensor, value);
    };
    return () => ws.close();
  }, [url]);
}
```

### MQTT over WebSocket (browser-side)
```ts
import mqtt from 'mqtt';
const client = mqtt.connect('ws://broker:9001', {
  clientId: 'dashboard-' + Math.random().toString(16).slice(2),
});
client.on('connect', () => client.subscribe('sensors/#'));
client.on('message', (topic, payload) => {
  const val = JSON.parse(payload.toString());
  // update chart / gauge / table
});
```

### Real-Time Chart with Chart.js
```tsx
import { Line } from 'react-chartjs-2';
import { useSensorStore } from './store';

export function TempChart() {
  const data = useSensorStore((s) => s.data);
  return (
    <Line
      data={{
        labels: Object.keys(data),
        datasets: [{
          label: 'Temperature',
          data: Object.values(data),
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.3,
        }]
      }}
      options={{ responsive: true, animation: { duration: 200 } }}
    />
  );
}
```

## Performance

- Virtualize long lists (`react-window`, `vue-virtual-scroller`).
- Throttle chart re-renders: update at most every 100-200ms (use `requestAnimationFrame` or throttle).
- Lazy load non-critical panels (React.lazy, Vue `defineAsyncComponent`).
- Use `useMemo`/`useCallback` for expensive computations.
- Bundle analysis: `vite build --analyze`.

## PWA for Offline Dashboards

```json
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';
export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] },
      manifest: {
        name: 'Sensor Dashboard',
        short_name: 'Dashboard',
        theme_color: '#1e293b',
      }
    })
  ]
};
```

## Mobile-First

- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`.
- Touch-friendly controls (min 44x44px tap targets).
- Test on real devices — browser DevTools device mode is not enough for touch UX.
- Provide a simplified mobile view: big readouts, fewer charts.

## Device Configuration Portal Pattern

```tsx
// ConfigForm component
export function ConfigForm() {
  const [config, setConfig] = useState({ ssid: '', password: '', mqtt_host: '' });
  const save = async () => {
    await fetch('/api/config', { method: 'POST', body: JSON.stringify(config) });
  };
  return (
    <form onSubmit={save}>
      <Input label="Wi-Fi SSID" value={config.ssid} onChange={...} />
      <Input label="Password" type="password" value={config.password} onChange={...} />
      <Input label="MQTT Host" value={config.mqtt_host} onChange={...} />
      <Button type="submit">Save & Reboot</Button>
    </form>
  );
}
```

## Accessibility

- Semantic HTML: `<main>`, `<nav>`, `<button>`, `<label>`.
- Color contrast ratio >= 4.5:1.
- `aria-label` on icon-only buttons.
- Test with keyboard navigation (Tab, Enter, Escape).
