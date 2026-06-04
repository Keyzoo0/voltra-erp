---
name: server
description: Use when building backend/server infrastructure for IoT systems — REST APIs, MQTT brokers, WebSocket servers, data pipelines, and device management platforms. Covers Node.js, Python (FastAPI), MQTT (Mosquitto/EMQX), PostgreSQL/SQLite, Docker, and deployment strategies for edge and cloud.
---

# Server / Backend

You are an expert backend developer for IoT and firmware-adjacent systems.

## Recommended Stack

| Layer       | Option                         |
|-------------|--------------------------------|
| Language    | Node.js 20+ (TypeScript) or Python 3.11+ |
| Framework   | FastAPI (Python) / Express (Node) / Hono (Node) |
| Database    | SQLite (edge), PostgreSQL (cloud), InfluxDB (time-series) |
| Message Bus | MQTT, NATS, Redis Pub/Sub       |
| Container   | Docker + docker-compose         |
| Proxy       | Caddy or nginx with Let's Encrypt |

## REST API Design for IoT

```
POST   /api/devices              # register device
GET    /api/devices              # list devices
GET    /api/devices/:id          # device detail
PUT    /api/devices/:id/config   # push config to device
GET    /api/devices/:id/telemetry?since=ISO8601  # get sensor history
POST   /api/devices/:id/ota      # trigger OTA update
```

### FastAPI Example
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Telemetry(BaseModel):
    device_id: str
    temperature: float
    humidity: float

@app.post("/telemetry")
async def ingest(t: Telemetry):
    # write to InfluxDB / PostgreSQL
    return {"status": "ok"}

@app.get("/devices/{id}")
async def get_device(id: str):
    dev = db.get_device(id)
    if not dev:
        raise HTTPException(404, "Device not found")
    return dev
```

### Hono (Node.js) Example
```ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.post('/telemetry', async (c) => {
  const body = await c.req.json()
  // store in DB
  return c.json({ status: 'ok' })
})

serve(app, { port: 3000 })
```

## MQTT

### Broker Setup (Mosquitto)
```yaml
# mosquitto.conf
listener 1883
listener 9001                  # WebSocket for browser
protocol websockets
allow_anonymous true
persistence true
```

### EMQX (for production)
- Clustered, built-in auth, rule engine, data bridge to InfluxDB/PostgreSQL.
- Use MQTT over TLS (port 8883) for production.

## WebSocket Server (for real-time dashboard push)
```python
from fastapi import WebSocket, WebSocketDisconnect

connections: dict[str, WebSocket] = {}

@app.websocket("/ws/{device_id}")
async def ws_endpoint(ws: WebSocket, device_id: str):
    await ws.accept()
    connections[device_id] = ws
    try:
        while True:
            data = await ws.receive_text()   # relay to other services
    except WebSocketDisconnect:
        connections.pop(device_id, None)
```
- Broadcast telemetry updates to subscribed dashboard clients.

## Database Schema (PostgreSQL)
```sql
CREATE TABLE devices (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    firmware_version TEXT,
    last_seen TIMESTAMPTZ,
    config JSONB
);

CREATE TABLE telemetry (
    id BIGSERIAL PRIMARY KEY,
    device_id UUID REFERENCES devices(id),
    ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payload JSONB
);

CREATE INDEX idx_telemetry_device_ts ON telemetry(device_id, ts DESC);
```

## Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports: ["3000:3000"]
    depends_on: [db, mqtt]
  db:
    image: postgres:16-alpine
    volumes: ["pgdata:/var/lib/postgresql/data"]
  mqtt:
    image: eclipse-mosquitto:2
    ports: ["1883:1883", "9001:9001"]
```

## OTA Server

- Store firmware binaries in S3/MinIO with version metadata.
- Serve via presigned URLs or direct download.
- Validate device compatibility (chip type, min version).
- Use rollback groups for staged rollout (canary -> 10% -> 100%).

## Security

- API keys (not passwords) for device auth — rotate on compromise.
- JWT for dashboard users — short-lived (15m) with refresh tokens.
- TLS everywhere: MQTT over TLS (port 8883), HTTPS-only.
- Rate limit per device: `slowapi` (Python) or `express-rate-limit`.
- Sanitize and validate all device input — devices are untrusted.
- Use `--read-only` and `--cap-drop=ALL` in Docker for API containers.
