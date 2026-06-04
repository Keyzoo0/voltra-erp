---
name: arduino
description: Use when working on Arduino-based projects using the Arduino framework (AVR, SAM, SAMD, RP2040, ESP32 cores). Covers Arduino IDE/CLI, library management, sensor interfacing, PlatformIO, and common Arduino boards (Uno, Nano, Mega, Due, Nano 33 BLE, RP2040, ESP32).
---

# Arduino Development

You are an expert Arduino developer. Follow these guidelines:

## Framework

- Use Arduino Core APIs (`digitalWrite`, `analogRead`, `Wire`, `SPI`, `Serial`) for portability.
- Prefer `millis()`-based non-blocking timing over `delay()`:
  ```cpp
  unsigned long prev = 0;
  if (millis() - prev >= interval) { prev = millis(); /* do work */ }
  ```
- Use `attachInterrupt()` with `FALLING`/`RISING` flags and keep ISRs short.

## Tools

| Tool       | Use                                     |
|------------|-----------------------------------------|
| Arduino IDE | Quick prototyping, simple sketches      |
| PlatformIO | Professional projects, library mgmt     |
| arduino-cli | CI/CD, command-line builds, scripting  |
| Sloeber    | Eclipse-based IDE for large projects    |

- **Recommended**: PlatformIO for any non-trivial project. It handles dependencies, board definitions, and environment config.

## Library Management

- Use `library.json` (PlatformIO) or `#include <LibraryName.h>` with Arduino Library Manager.
- Prefer official/libraries under `arduino-libraries` GitHub org: `Wire`, `SPI`, `SD`, `Ethernet`, `WiFiNINA`, `MKR*`.
- For sensors: Adafruit, SparkFun, and Arduino libraries are well-tested.
- Pin dependencies in `platformio.ini`:
  ```ini
  lib_deps =
    adafruit/DHT sensor library@^1.4.0
    bblanchon/ArduinoJson@^6.18.0
  ```

## Board-Specific Notes

| Board        | MCU        | Flash  | RAM   |
|--------------|------------|--------|-------|
| Uno R3       | ATmega328P | 32 KB  | 2 KB  |
| Nano         | ATmega328P | 32 KB  | 2 KB  |
| Mega 2560    | ATmega2560 | 256 KB | 8 KB  |
| Due          | ATSAM3X8E  | 512 KB | 96 KB |
| Nano 33 BLE  | nRF52840   | 1 MB   | 256 KB|
| RP2040       | RP2040     | 2 MB   | 264 KB|

- On AVR: avoid `String` class, use `char*`/`FlashString` (`F()` macro) to save RAM.
- On SAM/SAMD: watch `SerialUSB` vs `Serial` (native USB vs UART).
- On RP2040: use PIO (Programmable I/O) for custom protocols.

## Common Patterns

### Sensor Reading
```cpp
#include <DHT.h>
#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) { Serial.println("Sensor error"); return; }
  Serial.printf("Temp: %.1f°C Hum: %.1f%%\n", t, h);
  delay(2000);
}
```

### Web Server (ESP32)
```cpp
#include <WiFi.h>
#include <WebServer.h>
WebServer server(80);

void handleRoot() { server.send(200, "text/plain", "Hello"); }
void setup() {
  WiFi.begin("SSID", "pass");
  server.on("/", handleRoot);
  server.begin();
}
void loop() { server.handleClient(); }
```

## Debugging

- Use `Serial.print` — but remove or guard with `#ifdef DEBUG` for release.
- Use `#define DEBUG 1` and `#ifdef DEBUG` pattern.
- On boards with native USB, `Serial` blocks until serial monitor opens; add a timeout:
  ```cpp
  while (!Serial && millis() < 3000);
  ```
- Use `freeMemory()` or `ESP.getFreeHeap()` for RAM diagnostics.
- Use scope/logic analyzer for timing verification.

## Memory Optimization (AVR)

- Replace `String` with `char buf[size]`.
- Use `const PROGMEM` for lookup tables and strings.
- Use `F()` macro: `Serial.println(F("Hello"))` stores string in flash.
- Minimize global variables; use `static` locals.

## OTA Updates

- ESP32: `ArduinoOTA` library.
- MKR series: `ArduinoOTA` or `MKRMKRMKROM` via USB.
- For production: use signed OTA with version checking.
