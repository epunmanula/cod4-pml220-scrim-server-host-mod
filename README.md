# ⚡ HAVOC COD4 PROMOD SCRIM SERVER ⚡

<p align="center">
  <img src="https://img.shields.io/badge/Game-CoD4%20MW-orange?style=for-the-badge&logo=activision" alt="Call of Duty 4">
  <img src="https://img.shields.io/badge/Mod-Promod%20Live%20v2.20-blue?style=for-the-badge&logo=gamedeveloper" alt="Promod Live">
  <img src="https://img.shields.io/badge/Version-PPC%20LIVE%20V2.21%20EU-red?style=for-the-badge" alt="PPC Version">
  <img src="https://img.shields.io/badge/Location-Sri%20Lanka%20🇱🇰-green?style=for-the-badge" alt="Sri Lanka">
</p>

Welcome to the official repository for the **CoD4 Promod Scrim Server mod** (`pml220`). This mod is a highly customized version of Call of Duty 4 Promod Live, tailored specifically for competitive matches, scrims, and public matches. It features custom GSC scripts for automated server checks, predefined gameplay variables, and a customized ruleset for balanced competition.

---

## 📋 Table of Contents
1. [📂 Directory Structure](#-directory-structure)
2. [⚙️ Key Mod Features](#%EF%B8%8F-key-mod-features)
3. [🚀 Installation Guide](#-installation-guide)
   - [Windows Server Setup](#windows-server-setup)
   - [Linux Server Setup](#linux-server-setup)
4. [🛠️ Server Configuration (`server.cfg`)](#%EF%B8%8F-server-configuration-servercfg)
5. [🎮 Ruleset Customization](#-ruleset-customization)
6. [🗣️ Promod Commands & Modes](#%EF%B8%8F-promod-commands--modes)
7. [👥 Credits & Contacts](#-credits--contacts)

---

## 📂 Directory Structure

Here is a view of the mod directory structure and what each file does:

```text
pml220/
├── 📄 mod.ff                  # Compiled Mod Fastfile containing compiled maps & logic
├── 📦 pml220.iwd              # Mod Archive containing custom textures, weapons, and assets
├── 📄 server.cfg              # Primary server configuration file (hostname, passwords, map rotation)
├── 📂 promod/
│   ├── 📜 servercheck.gsc     # Automated server-side setting enforcement loop
│   └── 📜 setvariables.gsc    # Mod variables initialization (bob, throwbacks, ready-up stats)
└── 📂 promod_ruleset/
    └── 📜 custom_public.gsc   # Customized public ruleset (weapon limits, timers, round switch)
```

---

## ⚙️ Key Mod Features

### 1. Automated Server Consistency Enforcer (`promod/servercheck.gsc`)
Ensures fair play and standard competition settings. It constantly runs in a background thread and automatically forces optimal competitive parameters:
*   **sv_fps:** `20` (Server tick rate)
*   **sv_pure:** `1` (Verifies game files integrity)
*   **sv_maxrate:** `25000` (Smooth network replication rate)
*   **g_gravity:** `800` (Standard gravity)
*   **g_speed:** `190` (Promod standard movement speed)
*   **g_knockback:** `1000` (Standard weapon damage pushback)
*   **authServerName:** `cod4master.activision.com` (Master query server)

### 2. Client Movement & Competitive Optimization (`promod/setvariables.gsc`)
*   **Weapon Bobbing Removed:** `bg_bobMax` is set to `0` for perfect visual stability while running and aiming.
*   **Grenade Throwback Disabled:** Throwback inner and outer radii are disabled (`0`) for predictable tactical scenarios.
*   **PPC Custom Build:** Incorporates custom variables and displays `PPC ^1LIVE ^7V2.21 EU` as the active Promod version on the HUD.

### 3. Fully Customized Ruleset (`promod_ruleset/custom_public.gsc`)
This provides pre-balanced variables for all game types, including **Search & Destroy (SD)**, **Domination (DOM)**, **Headquarters (KOTH)**, **Sabotage (SAB)**, and **Team Deathmatch (TDM)**.
*   **Search & Destroy Custom Rules:**
    *   *Bomb Timer:* `45 seconds`
    *   *Defuse Time:* `7 seconds` (Defenders have a fair window)
    *   *Plant Time:* `5 seconds`
    *   *Round Limit:* First to `20` wins
    *   *Round Switch:* Sides swap every `10` rounds
    *   *Time Limit:* `1.75 minutes` per round
*   **Competitive Weapon/Class Limits:**
    *   *Assault Class:* Unlimited (`64`), Ak47 primary, Deagle secondary, Smoke grenade default. Allows weapon dropping.
    *   *Specops Class:* Max `2` per team, Ak74u primary, Deagle secondary. Allows weapon dropping.
    *   *Demolitions Class:* Max `1` per team, W1200 primary. Weapon dropping disabled.
    *   *Sniper Class:* Max `1` per team, M40a3 primary. Weapon dropping disabled.

---

## 🚀 Installation Guide

Installing the Promod Mod is extremely simple. Follow the steps below based on your server's Operating System.

### Windows Server Setup

1. **Locate Server Root:** Navigate to your Call of Duty 4 Server installation directory (e.g., `C:\Program Files (x86)\Activision\Call of Duty 4 - Modern Warfare\`).
2. **Create Mod Directory:** Go into the `mods/` folder. If it doesn't exist, create it.
3. **Copy Mod Folder:** Copy the entire `pml220` folder into the `mods/` directory. Your path should look like:
   `...\Call of Duty 4 - Modern Warfare\mods\pml220\`
4. **Copy server.cfg:** You can keep the `server.cfg` inside the `pml220` folder or move it to your main `main/` directory. Keep it inside the mod folder for a cleaner setup.
5. **Create Startup Batch Script:** Create a start file called `start_server.bat` in your main CoD4 Server folder with the following command:

```cmd
@echo off
cod4x_ded.exe +set fs_game "mods/pml220" +exec server.cfg +map_rotate
pause
```
*(If using standard v1.7 Dedicated server, replace `cod4x_ded.exe` with `iw3mp.exe +set dedicated 2`)*

---

### Linux Server Setup

1. **Upload Mod Files:** Upload the `pml220` directory to your server's CoD4 directory under the `mods` folder:
   `/home/cod4/server/mods/pml220/`
2. **Check File Permissions:** Ensure your server user has read and execute permissions for the mod files:
   ```bash
   chmod -R 755 /home/cod4/server/mods/pml220/
   ```
3. **Create Startup Script:** Create or edit your startup script `start.sh`:
   ```bash
   #!/bin/bash
   ./cod4x_ded.x86 +set fs_game "mods/pml220" +exec server.cfg +map_rotate +exec server.cfg
   ```
4. **Run Server:** Execute the script:
   ```bash
   ./start.sh
   ```

---

## 🛠️ Server Configuration (`server.cfg`)

The `server.cfg` controls the server identity, map rotation, and connection details.

### Crucial Variables to Modify:
*   **Server Hostname (`sv_hostname`):** Sets the name displayed in the server browser.
    ```gsc
    set sv_hostname "^2YOUR ^7SCRIM ^1SERVER" // E.g., Green & Red colored title
    ```
*   **Admin Details:** Set yourself as the server administrator.
    ```gsc
    sets _Admin "YourAdminName"
    sets _Website "www.yourwebsite.com"
    sets _Location "YourCountry"
    ```
*   **Passwords:**
    *   `g_password` : Set the password required to join the server (Default: `your_server_password_here`).
    *   `rcon_password` : Set the console control password (Default: `your_rcon_password_here`). **Change this immediately!**
    *   `sv_privatePassword` : Password for private slots (Default: `your_private_password_here`).
*   **Map Rotation (`sv_mapRotation`):**
    Currently configured to rotate standard Promod scrim maps:
    `Backlot`, `Citystreets (District)`, `Crash`, `Crossfire`, and `Strike`.
    ```gsc
    set sv_mapRotation "map mp_backlot map mp_citystreets map mp_crash map mp_crossfire map mp_strike"
    ```

---

## 🎮 Ruleset Customization

To modify the weapon balance, attachments, or match rules:
1. Open `promod_ruleset/custom_public.gsc`.
2. Find the class limit variables or weapon variables.
3. Change the binary values (`0` = Disallowed, `1` = Allowed) or integers.

#### Example: Changing Sniper Class Limit to 2 per team
```gsc
// Change this line (Line 78):
setDvar( "class_sniper_limit", 2 ); // Originally 1
```

#### Example: Disallowing the Desert Eagle
```gsc
// Change this line (Line 119):
setDvar( "weap_allow_deserteagle", 0 ); // Originally 1
```

> [!NOTE]
> Ensure you do not introduce syntax errors. Each command must end with a semicolon (`;`).

---

## 🗣️ Promod Commands & Modes

You can dynamically change server rules and behavior using `promod_mode`. Use RCON to run these commands in-game:

| Mode Command | Type | Description |
| :--- | :--- | :--- |
| `/rcon promod_mode match_mr12` | Scrim | standard MR12 Match mode (12 rounds per half) |
| `/rcon promod_mode match_mr10` | Scrim | MR10 Match mode |
| `/rcon promod_mode strat` | Strategy | Warmup / strategy mode with infinite grenades & quick respawn |
| `/rcon promod_mode public` | Public | Standard casual ruleset for public lobbies |
| `/rcon promod_mode custom_public` | Custom | Custom ruleset defined in `custom_public.gsc` |

> [!IMPORTANT]
> When executing a new mode via RCON, you must restart the map for settings to apply:
> `/rcon map_restart` or `/rcon fast_restart`

---

## 👥 Credits & Contacts

*   **Server Owner & Admin:** `24K_Me` 👑
*   **Scripter & Developer:** `JEENNN:]` 💻
*   **Official Website:** [24KME.RF.GD](http://24KME.RF.GD) 🌐
*   **Location:** Sri Lanka 🇱🇰

---
<p align="center">
  <b>⚡ Powered by Havoc Esports Network ⚡</b>
</p>
