---
name: esp-idf
description: Use when working with Espressif ESP32/ESP32-S/ESP32-C series using ESP-IDF (Espressif IoT Development Framework). Covers FreeRTOS, Wi-Fi/BLE/ESP-NOW, OTA, NVS, LVGL, HTTP/MQTT clients, sleep modes, and performance optimization on ESP32-class chips.
---

# ESP-IDF Development

You are an expert ESP-IDF developer. Follow these guidelines:

## Project Structure

```
my_project/
├── CMakeLists.txt
├── sdkconfig
├── components/
│   └── my_component/
│       ├── CMakeLists.txt
│       ├── include/
│       │   └── my_component.h
│       └── my_component.c
├── main/
│   ├── CMakeLists.txt
│   └── app_main.c
└── partitions.csv
```

- Use `idf.py` CLI for building, flashing, monitoring: `idf.py build flash monitor`.
- Set target: `idf.py set-target esp32s3`.
- Use `idf.py menuconfig` for configuration.

## ESP-IDF APIs

### NVS (Non-Volatile Storage)
```c
nvs_handle_t nvs;
ESP_ERROR_CHECK(nvs_open("storage", NVS_READWRITE, &nvs));
int32_t val = 0;
nvs_get_i32(nvs, "counter", &val);
val++;
nvs_set_i32(nvs, "counter", val);
nvs_commit(nvs);
nvs_close(nvs);
```

### Wi-Fi
```c
esp_netif_init();
esp_event_loop_create_default();
esp_netif_create_default_wifi_sta();
wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
esp_wifi_init(&cfg);
esp_wifi_set_mode(WIFI_MODE_STA);
wifi_config_t wifi_cfg = {
    .sta = { .ssid = "SSID", .password = "PASS" }
};
esp_wifi_set_config(WIFI_IF_STA, &wifi_cfg);
esp_wifi_start();
esp_wifi_connect();
```
- Handle `WIFI_EVENT_STA_DISCONNECTED` with reconnect logic (exponential backoff).
- Use `esp_netif_get_ip_info` to check IP address after `IP_EVENT_STA_GOT_IP`.

### MQTT
```c
esp_mqtt_client_config_t mqtt_cfg = {
    .broker.address.uri = "mqtt://broker.emqx.io:1883",
};
esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);
esp_mqtt_client_start(client);
```
- Reconnect on `MQTT_EVENT_DISCONNECTED`.
- Set keepalive appropriately (10-60s).

### BLE
- Use `esp_ble_gap_register_callback` and `esp_ble_gatts_app_register`.
- For BLE GATT server: define service/characteristic UUIDs in `gatt_svr.c`.
- For BLE scan: use `ESP_BT_MODE_CLASSIC_BT` only when needed to save memory.

### ESP-NOW (low-latency P2P)
```c
esp_now_init();
esp_now_register_send_cb(on_sent);
esp_now_register_recv_cb(on_recv);
esp_now_peer_info_t peer = { .channel = 0, .ifidx = ESP_IF_WIFI_STA };
memcpy(peer.peer_addr, target_mac, 6);
esp_now_add_peer(&peer);
uint8_t data[] = "hello";
esp_now_send(peer.peer_addr, data, sizeof(data));
```

## OTA (Over-the-Air Updates)

```
# partitions.csv
nvs,      data, nvs,     0x9000, 0x6000,
otadata,  data, ota,     0xf000, 0x2000,
app0,     app,  ota_0,   0x10000, 0x1F0000,
app1,     app,  ota_1,   0x200000,0x1F0000,
```
- Use `esp_https_ota` for secure OTA from HTTPS server.
- Verify image signature: `esp_ota_get_app_elf_sha256`.
- Rollback on boot failure using `esp_ota_mark_app_invalid_rollback_and_reboot`.

## Sleep Modes

| Mode        | Current | Wake Sources                         |
|-------------|---------|--------------------------------------|
| Modem-sleep | ~5 mA   | timer, GPIO                          |
| Light-sleep | ~1 mA   | timer, GPIO, touch                   |
| Deep-sleep  | ~10 µA  | timer, GPIO (RTC), touch             |
| Hibernation | ~5 µA   | GPIO (RTC) only                      |

```c
esp_sleep_enable_timer_wakeup(10 * 1000000); // 10s
esp_deep_sleep_start();
```
- Save state in RTC memory: `RTC_DATA_ATTR int counter;`.

## Performance

- Run Wi-Fi/Bluetooth and application on different cores:
  ```c
  xTaskCreatePinnedToCore(task_fn, "task", 4096, NULL, 5, &task, 1);
  ```
- Use `CONFIG_FREERTOS_UNICORE` on single-core chips.
- Enable `CONFIG_SPIRAM` for PSRAM if available.
- Use event groups instead of polling.
- Profile with `esp_timer_get_time()` or `CONFIG_ESP_TASK_WDT`.

## Debugging

- Use `ESP_LOGx`: `ESP_LOGI(TAG, "value: %d", val)` — levels: E, W, I, D, V.
- Use `make monitor` or `idf.py monitor` with `--timestamp` flag.
- Decode panic backtrace: `espcoredump.py --chip esp32 info_corefile ./core`.
- Use JTAG (ESP-Prog, FT2232) with OpenOCD + `xtensa-esp32-elf-gdb`.

## Common Mistakes

- Calling FreeRTOS functions from ISRs without `FromISR` suffix.
- Not handling `ESP_ERR_WIFI_NOT_CONNECT` in Wi-Fi-dependent operations.
- Stack overflow: check `uxTaskGetStackHighWaterMark`.
- Forgetting `nvs_flash_init()` before NVS usage.
- Using `printf` in ISRs (use `ESP_DRAM_LOGD` for ISR-safe logging).
