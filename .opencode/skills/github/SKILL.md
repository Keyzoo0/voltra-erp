---
name: github
description: Use when working with GitHub — repository management, GitHub Actions CI/CD for firmware/microcontroller projects, Git workflows, issue/PR templates, automated firmware builds and releases, GitHub Pages for documentation, and project boards for embedded systems development.
---

# GitHub Workflows

You are an expert in GitHub-based firmware development workflows.

## Git Workflow

- **main** — production-ready, protected branch. No direct pushes.
- **develop** — integration branch.
- **feature/*** — branch from `develop` for new features.
- **fix/*** — branch from `main` for hotfixes.
- **Release tags**: `v1.2.3` (semver: major.minor.patch).

### Recommended: Trunk-based for firmware
```
main ←── feature branches (short-lived, <1 day)
         ↓
      tags/release-v1.2.3
```
- Squash-merge feature branches into `main`.
- Tag each release: `git tag -a v1.2.3 -m "release v1.2.3"`.

## Repository Structure
```
project/
├── .github/
│   ├── workflows/
│   │   ├── build.yml
│   │   ├── test.yml
│   │   ├── release.yml
│   │   └── lint.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── firmware/        # source code
├── test/            # unit + integration tests
├── scripts/         # build/flash utilities
└── docs/            # documentation (GitHub Pages)
```

## GitHub Actions for Firmware

### Build (PlatformIO)
```yaml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install platformio
      - run: pio run
```

### Build (ESP-IDF)
```yaml
name: Build ESP-IDF
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    container: espressif/idf:latest
    steps:
      - uses: actions/checkout@v4
      - run: idf.py set-target esp32s3
      - run: idf.py build
      - uses: actions/upload-artifact@v4
        with:
          name: firmware
          path: build/*.bin
```

### Automated Release with Firmware Binaries
```yaml
name: Release
on:
  push: { tags: ['v*'] }
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install platformio && pio run
      - uses: softprops/action-gh-release@v2
        with:
          files: |
            .pio/build/*/firmware.bin
            .pio/build/*/firmware.elf
          generate_release_notes: true
```

### Lint (pre-commit)
```yaml
name: Lint
on: [push]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: pip install pre-commit && pre-commit run --all-files
```

## Issue Templates

### `.github/ISSUE_TEMPLATE/bug_report.md`
```markdown
---
name: Bug Report
about: Report a firmware bug
---
**Board**: [e.g., ESP32-S3]
**Environment**: [e.g., PlatformIO, ESP-IDF v5.1]
**Expected behavior**:
**Actual behavior**:
**Steps to reproduce**:
**Serial/log output**:
```

## Pull Request Template

### `.github/PULL_REQUEST_TEMPLATE.md`
```markdown
## Description
## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
## Testing
- [ ] Built successfully
- [ ] Tested on hardware (board: ___)
## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
```

## GitHub Pages for Docs

- Use `mkdocs` (Python) or `vitepress` (Node) for firmware documentation.
- Deploy via `peaceiris/actions-gh-pages@v4`:
  ```yaml
  - uses: peaceiris/actions-gh-pages@v4
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      publish_dir: ./site
  ```

## GitHub Projects

- Use project boards for firmware sprints: Backlog → In Progress → Review → Done.
- Automate: when a PR is opened → move to In Progress; when merged → Done.
- Use labels: `bug`, `enhancement`, `hardware-needed`, `blocked`, `good-first-issue`.

## Push Project Baru ke GitHub (Workflow)

Gunakan `gh` CLI untuk analisa + push cepat.

### 1. Analisa GitHub User

```bash
# cek auth & lihat akun
gh auth status

# lihat daftar repo (10 terbaru)
gh repo list --limit 10 --json name,description,primaryLanguage,updatedAt

# lihat detail repo
gh repo view Keyzoo0/IoT_SmartHome --json name,description,url
```

### 2. Init & Push Project ke GitHub Baru

```bash
# dari folder project
cd namaproject/

# init git & stage semua file
git init
git add -A

# buat .gitignore (pilih sesuai project)
# ESP32 Arduino: *.o *.elf .pio/ .vscode/ build/ __pycache__/

# commit
git commit -m "Initial commit: deskripsi singkat"

# buat repo di GitHub & push (satu langkah dengan gh CLI)
gh repo create <nama-repo> --private --source=. --remote=origin --push

# ── jika gh push gagal (git remote-https tidak ada) ──
# set remote manual dengan token:
TOKEN=$(gh auth token)
git remote set-url origin https://USERNAME:${TOKEN}@github.com/USERNAME/REPO.git
git push -u origin master
# (ganti master → main jika perlu)
```

### 3. Update Project yang Sudah Ada

```bash
# cek status
git status

# stage & commit perubahan
git add -A
git commit -m "deskripsi perubahan"

# push
git push
```

### 4. GitHub Actions untuk ESP32 Arduino (verify compile)

Buat `.github/workflows/build.yml`:

```yaml
name: Build ESP32
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install platformio
      - run: pio run
```

### 5. Contoh Riil (IoT_SmartHome)

Hasil analisa user **Keyzoo0** — firmware engineer dengan repositori:
- `IoT_SmartHome` — ESP32 web server (Arduino, FreeRTOS, WebSocket)
- `EggClassifier` — ESP32-S3 CAM klasifikasi telur (C, IoT, Computer Vision)
- Various TypeScript/JavaScript projects (mobile apps, web)

Workflow push yang terbukti berhasil:
```
git init → add → commit
→ gh repo create --private --source=. --remote=origin --push
→ (jika gagal) set remote manual dengan gh auth token
→ git push -u origin master
```

## Best Practices

- Protect `main` with:
  - Require PR reviews (1 minimum).
  - Require status checks (build + lint pass).
  - Require up-to-date branches.
- Use `.gitignore` for PlatformIO: `*.o`, `*.elf`, `.pio/`, `.vscode/`.
- Use GitHub Secrets for: `WIFI_SSID`, `WIFI_PASS`, `MQTT_HOST`, `API_KEY` (used in CI).
- Use `Dependabot` to keep GitHub Actions and library dependencies updated.
- Sign commits with GPG/Signing key for firmware releases.
