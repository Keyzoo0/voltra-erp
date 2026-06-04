---
name: esp32-web-project
description: Use when working on ESP32 local-network web server projects using Arduino framework. Covers project structure with .ino + data/ folder (index.html, style.css Tailwind CDN, app.js), LittleFS upload, AsyncWebServer, WebSocket multi-user, mDNS (namaproject.local), WiFi station mode, and ArduinoJson API. Target ESP32 boards v3.x.x with notes on deprecated syntax.
---

# ESP32 Web Project (Local Network)

You are an expert in ESP32 Arduino web projects served over local WiFi.

## Project Structure

```
namaproject/
├── namaproject.ino
├── data/
│   ├── index.html          # Tailwind CDN + custom UI
│   ├── style.css           # additional styles (optional)
│   └── app.js              # WebSocket client + fetch API calls
```

- `.ino` — compiled and uploaded via esptool.py (Arduino IDE / PlatformIO)
- `data/` — uploaded to LittleFS partition using `arduino-littlefs-upload` plugin or `mklittlefs` / `esptool.py` + LittleFS binary

## Required Libraries (platformio.ini)

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
board_build.filesystem = littlefs

lib_deps =
  ESP32Async/ESPAsyncWebServer@^3.10.0
  ESP32Async/AsyncTCP@^3.3.0
  bblanchon/ArduinoJson@^7.3.0
```

For Arduino IDE, install via Library Manager:
- **ESPAsyncWebServer** by ESP32Async
- **AsyncTCP** by ESP32Async
- **ArduinoJson** by Benoit Blanchon

## Complete Template

### `namaproject.ino`

```cpp
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>
#include <LittleFS.h>
#include <ArduinoJson.h>

// ⚠️ ESP32 Core v3.x: LittleFS API unchanged but ensure
//    Tools > Partition Scheme > "Huge APP (3MB No OTA/1MB SPIFFS)"
//    or any scheme with at least 1MB SPIFFS/LittleFS space.

const char* ssid = "YourRouterSSID";
const char* pass = "YourRouterPassword";

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

// ─── WebSocket Handler ────────────────────────────────────────
void onWsEvent(AsyncWebSocket* server, AsyncWebSocketClient* client,
               AwsEventType type, void* arg, uint8_t* data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("Client #%u connected\n", client->id());
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("Client #%u disconnected\n", client->id());
      break;
    case WS_EVT_DATA: {
      AwsFrameInfo* info = (AwsFrameInfo*)arg;
      if (info->final && info->index == 0 && info->len == len) {
        if (info->opcode == WS_TEXT) {
          // ⚠️ ArduinoJson v7: JsonDocument auto-allocates.
          //    No more StaticJsonDocument / DynamicJsonDocument.
          JsonDocument doc;
          DeserializationError err = deserializeJson(doc, data, len);
          if (!err) {
            const char* action = doc["action"];
            if (action) {
              // ── broadcast to ALL connected clients ──
              JsonDocument res;
              res["from"] = client->id();
              res["action"] = action;
              res["status"] = "ok";
              size_t outLen = measureJson(res) + 1;
              char* buf = new char[outLen];
              serializeJson(res, buf, outLen);
              ws.textAll(buf);
              delete[] buf;
            }
          }
        }
      }
      break;
    }
    default:
      break;
  }
}

// ─── Broadcast helper ─────────────────────────────────────────
void wsBroadcast(const char* key, float val) {
  JsonDocument doc;
  doc[key] = val;
  size_t len = measureJson(doc) + 1;
  char* buf = new char[len];
  serializeJson(doc, buf, len);
  ws.textAll(buf);
  delete[] buf;
}

// ─── API Endpoints ────────────────────────────────────────────
void setupRoutes() {
  // LittleFS serving — all files in data/ are served from /
  // ⚠️ serveStatic prefix must match folder structure.
  server.serveStatic("/", LittleFS, "/")
    .setDefaultFile("index.html");

  // JSON REST endpoint example
  server.on("/api/status", HTTP_GET, [](AsyncWebServerRequest* r) {
    JsonDocument doc;
    doc["heap"] = ESP.getFreeHeap();
    doc["uptime"] = millis() / 1000;
    doc["clients"] = ws.count();
    String resp;
    serializeJson(doc, resp);
    r->send(200, "application/json", resp);
  });
}

void setup() {
  Serial.begin(115200);

  // ─── Mount LittleFS ─────────────────────────────────────────
  if (!LittleFS.begin()) {
    Serial.println("LittleFS mount failed!");
    return;
  }
  Serial.println("LittleFS mounted");

  // ─── WiFi Station ───────────────────────────────────────────
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\nIP: %s\n", WiFi.localIP().toString().c_str());

  // ─── mDNS ───────────────────────────────────────────────────
  // Access via http://namaproject.local from same network
  if (!MDNS.begin("namaproject")) {
    Serial.println("mDNS failed");
  } else {
    Serial.println("mDNS: http://namaproject.local");
  }

  // ─── WebSocket ──────────────────────────────────────────────
  ws.onEvent(onWsEvent);
  server.addHandler(&ws);

  // ⚠️ AsyncWebServer v3.x: addHandler must come BEFORE routes
  setupRoutes();

  // ─── Start Server ───────────────────────────────────────────
  server.begin();
  Serial.println("Server started");
}

void loop() {
  ws.cleanupClients();
}
```

### `data/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>namaproject</title>
  <!-- Tailwind CDN v4 ⚠️ check latest CDN URL if version changes -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css" />
</head>
<body class="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
  <h1 class="text-3xl font-bold mb-4">namaproject</h1>
  <div id="status" class="text-sm text-gray-400 mb-4">connecting...</div>
  <div id="data" class="grid grid-cols-2 gap-4 w-full max-w-md"></div>

  <script src="app.js"></script>
</body>
</html>
```

### `data/style.css`

```css
.card {
  @apply bg-gray-800 rounded-xl p-4 shadow-lg text-center;
}
.card .value {
  @apply text-2xl font-semibold text-emerald-400;
}
.card .label {
  @apply text-xs text-gray-400 uppercase tracking-wide mt-1;
}
```

### `data/app.js`

```js
// ⚠️ Connect to ESP32 hostname via mDNS.
//    Must be on same WiFi network as ESP32.
const HOST = location.hostname;  // namaproject.local
const WS_URL = `ws://${HOST}/ws`;

let ws;

function connectWS() {
  ws = new WebSocket(WS_URL);
  ws.onopen = () => {
    document.getElementById('status').textContent = 'connected';
    // send hello
    ws.send(JSON.stringify({ action: 'hello', client: 'browser' }));
  };
  ws.onclose = () => {
    document.getElementById('status').textContent = 'disconnected, retrying...';
    setTimeout(connectWS, 2000);
  };
  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data);
    updateUI(data);
  };
}

function updateUI(data) {
  const container = document.getElementById('data');
  Object.entries(data).forEach(([key, val]) => {
    let div = document.getElementById(`card-${key}`);
    if (!div) {
      div = document.createElement('div');
      div.id = `card-${key}`;
      div.className = 'card';
      div.innerHTML = `<div class="value" id="val-${key}"></div>
                       <div class="label">${key}</div>`;
      container.appendChild(div);
    }
    document.getElementById(`val-${key}`).textContent = val;
  });
}

// REST API example
async function fetchStatus() {
  const res = await fetch('/api/status');
  const data = await res.json();
  console.log('REST:', data);
}

connectWS();
setInterval(fetchStatus, 5000);
```

## Upload Instructions

### 1. LittleFS Upload (data/ folder)

**Arduino IDE** — install `arduino-littlefs-upload` plugin:
- Tools → ESP32 LittleFS Data Upload
- ⚠️ Close Serial Monitor first

**PlatformIO**:
```bash
pio run --target uploadfs
```

### 2. Firmware Upload (.ino)

```bash
# Arduino IDE: Sketch → Upload (uses esptool.py internally)
# PlatformIO:
pio run --target upload
```

Or directly with esptool.py:
```bash
esptool.py --chip esp32 --port /dev/ttyUSB0 write_flash \
  0x10000 .pio/build/esp32dev/firmware.bin
```

## API Deep Dive (ESP32 Boards v3.x.x + Latest Libraries)

### WiFi (v3.x — stable)
```cpp
WiFi.mode(WIFI_STA);
WiFi.begin(ssid, pass);
WiFi.config(INADDR_NONE, INADDR_NONE, INADDR_NONE);  // force DHCP renewal
// ⚠️ v3.x: WiFi.setHostname() works. Use before WiFi.begin() on some chips.
```

### mDNS — ESPmDNS (v3.x — stable)
```cpp
#include <ESPmDNS.h>
MDNS.begin("namaproject");   // → http://namaproject.local
MDNS.addService("http", "tcp", 80);
```
Test: `ping namaproject.local` from your PC.

### LittleFS (v3.x — stable)
```cpp
#include <LittleFS.h>
LittleFS.begin();             // mount, format on fail if true passed
LittleFS.open("/index.html"); // read files uploaded via data/
```
⚠️ No API change from v2.x. SPIFFS is deprecated in favor of LittleFS.

### ESPAsyncWebServer (v3.10.x)
```cpp
#include <ESPAsyncWebServer.h>
AsyncWebServer server(80);

// Serve static files from LittleFS
server.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

// Route order matters: specific routes → static
server.on("/api/status", HTTP_GET, handler);

// ⚠️ addHandler() for WebSocket must precede server.begin()
AsyncWebSocket ws("/ws");
server.addHandler(&ws);
server.begin();
```

### WebSocket — Multi-User (v3.10.x)
```cpp
// Broadcast to all:
ws.textAll("message");           // string / char*
ws.printfAll("temp: %.1f", val);

// Broadcast JSON (ArduinoJson v7):
JsonDocument doc;
doc["temp"] = 25.3;
size_t len = measureJson(doc) + 1;
char* buf = new char[len];
serializeJson(doc, buf, len);
ws.textAll(buf);
delete[] buf;

// Per-client:
client->text("private msg");

// ⚠️ Always call cleanup in loop:
void loop() { ws.cleanupClients(); }
```

### ArduinoJson v7 — Key Changes from v6

| v6 (deprecated) | v7 (current) |
|---|---|
| `StaticJsonDocument<256> doc;` | `JsonDocument doc;` (auto heap, grows) |
| `DynamicJsonDocument doc(256);` | `JsonDocument doc;` |
| `doc.capacity()` | `doc.overflowed()` |
| `arr.createNestedObject()` | `arr.add<JsonObject>()` |
| `obj.createNestedArray("k")` | `obj["k"].to<JsonArray>()` |
| `doc.as<JsonObject>()` | `doc.as<JsonObject>()` (same) |

```cpp
// ⚠️ v7 correct usage:
JsonDocument doc;
doc["sensor"] = "temperature";
doc["value"] = 26.5;
doc["unit"] = "celsius";

JsonArray readings = doc["readings"].to<JsonArray>();
readings.add(25.1);
readings.add(26.3);

String output;
serializeJson(doc, output);
// or: serializeJson(doc, Serial);
// or: serializeJsonPretty(doc, Serial);
```

```cpp
// ⚠️ v7 deserialization:
JsonDocument doc;
DeserializationError err = deserializeJson(doc, jsonString);
if (err) {
  Serial.print("JSON parse: ");
  Serial.println(err.c_str());
  return;
}
const char* action = doc["action"];
float temp = doc["temperature"] | NAN;
```

## Checklist for ESP32 v3.x.x Compatibility

- [ ] `board_build.filesystem = littlefs` in platformio.ini
- [ ] Partition Scheme: at least 1MB SPIFFS/LittleFS
- [ ] Use `JsonDocument` (v7), NOT `StaticJsonDocument`/`DynamicJsonDocument` (v6)
- [ ] Use `ledcAttach(pin, freq, resolution)` NOT `ledcSetup`+`ledcAttachPin` (v2)
- [ ] WebSocket `addHandler()` BEFORE `server.begin()`
- [ ] `ws.cleanupClients()` dipanggil di Core 0
- [ ] Komunikasi antar-core via Queue (`xQueueSend` / `xQueueReceive`), bukan shared variable langsung
- [ ] Serial command parser jalan di Core 1

## FreeRTOS Dual-Core Pattern

Pin WebSocket/server ke Core 0, I/O + serial + logic ke Core 1.

### Queue Communication

```cpp
// pesan dari WebSocket → system task
typedef struct {
  char action[16];   // "toggle", "override"
  char device[16];   // "lamp1", "lamp2", "fan", "ac"
  bool value;
} CmdMsg;

// notifikasi dari system → webserver task
typedef struct {
  bool broadcast;    // true = kirim state ke semua WS client
} NotifyMsg;

QueueHandle_t wsCmdQueue;   // WebSocket → System
QueueHandle_t notifyQueue;  // System → WebSocket
```

### Task Setup

```cpp
void setup() {
  Serial.begin(115200);

  wsCmdQueue  = xQueueCreate(10, sizeof(CmdMsg));
  notifyQueue = xQueueCreate(10, sizeof(NotifyMsg));

  xTaskCreatePinnedToCore(webServerTask, "web", 8192, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(systemTask,   "sys", 8192, NULL, 1, NULL, 1);
}

// loop Arduino kosong — semua kerjaan di task
void loop() { vTaskDelete(NULL); }
```

### Core 0 — WebServer Task

```cpp
void webServerTask(void* pv) {
  // init LittleFS, WiFi, mDNS, WebSocket, routes, server.begin()
  // ...

  NotifyMsg nMsg;
  for (;;) {
    ws.cleanupClients();
    if (xQueueReceive(notifyQueue, &nMsg, 0) == pdTRUE) {
      if (nMsg.broadcast) wsBroadcast();
    }
    vTaskDelay(pdMS_TO_TICKS(10));
  }
}
```

### Core 1 — System Task

```cpp
void systemTask(void* pv) {
  // init pin, relay, sensor
  // ...

  CmdMsg cmd;
  for (;;) {
    // terima perintah dari WebSocket
    if (xQueueReceive(wsCmdQueue, &cmd, 0) == pdTRUE) {
      if (strcmp(cmd.action, "toggle") == 0) {
        // toggle relay, update state, kirim notify
      } else if (strcmp(cmd.action, "override") == 0) {
        // paksa relay ON/OFF
      }
    }
    // baca sensor, proses serial, dll
    processSerialCmd();
    vTaskDelay(pdMS_TO_TICKS(10));
  }
}
```

⚠️ **Penting**: `ws.textAll()` hanya dipanggil dari Core 0. Jangan panggil dari task lain langsung — kirim via `notifyQueue`.

## Serial Command Interface

Tambahkan serial parser di Core 1 untuk debugging & kontrol tanpa web.

### Command Pattern

```cpp
void processSerialCmd() {
  static char buf[64];
  static size_t i = 0;

  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') {
      buf[i] = '\0';
      i = 0;
      if (strlen(buf) == 0) return;

      char* cmd  = strtok(buf, " ");
      char* arg1 = strtok(NULL, " ");
      char* arg2 = strtok(NULL, " ");

      if (strcmp(cmd, "help") == 0) {
        // tampilkan daftar perintah
      } else if (strcmp(cmd, "status") == 0) {
        // cetak semua state (sensor, relay, heap, uptime, IP)
      } else if (strcmp(cmd, "restart") == 0) {
        ESP.restart();
      } else if (strcmp(cmd, "override") == 0) {
        // override <device> on/off
      }
    } else {
      if (i < sizeof(buf) - 1) buf[i++] = c;
    }
  }
}
```

### Standard Commands

| Command | Fungsi |
|---|---|
| `help` | Tampilkan semua perintah |
| `status` | Cetak JSON status sistem (sensor, relay, heap, uptime, IP, client count) |
| `restart` | Restart ESP32 |
| `override <dev> on/off` | Paksa relay ON/OFF (`lamp1`, `lamp2`, `fan`, `ac`) |

## Notes on Deprecated Syntax (ESP32 v3.x.x)

| Deprecated (v2.x) | Replacement (v3.x) |
|---|---|
| `ledcSetup(ch, freq, res)` | `ledcAttach(pin, freq, res)` |
| `ledcAttachPin(pin, ch)` | removed — merged into `ledcAttach` |
| `ledcDetachPin(pin)` | `ledcDetach(pin)` |
| `analogSetClockDiv()` | removed |
| `adcAttachPin()` | removed |
| `hallRead()` | removed |
| SPIFFS (`FS.h`) | **LittleFS** (`LittleFS.h`) — SPIFFS deprecated |
| ArduinoJson v6 doc | `JsonDocument` (v7 auto-grow) |
