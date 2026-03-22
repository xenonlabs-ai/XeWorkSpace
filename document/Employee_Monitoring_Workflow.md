# XeWorkspace - Employee Monitoring Workflow

**Project:** XeWorkspace - Team Management & Productivity Platform
**Version:** 1.0
**Last Updated:** March 2026

---

## Table of Contents

1. [Overview](#overview)
2. [For Administrators](#for-administrators)
3. [For Employees](#for-employees)
4. [Desktop Agent Setup](#desktop-agent-setup)
5. [Live Monitoring Dashboard](#live-monitoring-dashboard)
6. [Daily Activity Reports](#daily-activity-reports)
7. [Privacy & Compliance](#privacy--compliance)

---

## Overview

XeWorkspace provides comprehensive employee monitoring capabilities that allow administrators to track productivity, capture screenshots, and view live screen feeds. This system is designed with privacy in mind, requiring explicit employee consent before any monitoring begins.

### Key Features

- **Live Screen Streaming** - Real-time CCTV-style view of employee screens
- **Automatic Screenshots** - Periodic screen captures at configurable intervals
- **Activity Tracking** - Application usage, website visits, and time tracking
- **Daily Reports** - Comprehensive productivity analytics and reports

---

## For Administrators

### Step 1: Enable Monitoring for Organization

1. Log in as an **Admin** or **Owner** (e.g., `support@xenonlabs.ai`)
2. Navigate to **Settings** > **Organization Settings**
3. Enable **Employee Monitoring** feature
4. Configure monitoring settings:
   - Screenshot interval (e.g., every 5 minutes)
   - Enable/disable live streaming
   - Set working hours for monitoring

### Step 2: Request Employee Consent

1. Go to **Team** > **Members**
2. Select the employee you want to monitor
3. Click **Enable Monitoring** for that employee
4. The employee will receive a notification to provide consent

### Step 3: View Monitoring Dashboard

Once an employee has consented and installed the desktop agent:

1. Navigate to **Monitoring** in the sidebar
2. View the **Live Viewer** tab for real-time streams
3. Check **Screenshots** tab for captured images
4. Review **Daily Reports** for productivity analytics

---

## For Employees

### Step 1: Receive Monitoring Request

When your administrator enables monitoring for your account, you will:
- Receive an email notification (if configured)
- See a notification in the XeWorkspace dashboard
- Be prompted to visit the consent page

### Step 2: Review Monitoring Terms

1. Log in to XeWorkspace with your employee account
2. Navigate to **Monitoring** > **Consent** or visit `/monitoring/consent`
3. Review what will be monitored:
   - **Screen Captures**: Periodic screenshots of your screen
   - **Live Streaming**: Real-time screen viewing by administrators
   - **Activity Tracking**: Applications and websites you use
   - **Time Tracking**: Active and idle time during work hours

### Step 3: Provide Consent

On the consent page, you have three options:

| Action | Description |
|--------|-------------|
| **Accept** | Agree to monitoring. Downloads the desktop agent automatically. |
| **Decline** | Refuse monitoring. Your administrator will be notified. |
| **Revoke** | If previously accepted, you can revoke consent at any time. |

**Important:** Monitoring will only begin after you explicitly accept AND install the desktop agent.

### Step 4: Install Desktop Agent

After accepting consent:

1. The desktop agent installer will download automatically
2. Run the installer (`XeWorkspace-Agent-Setup.exe`)
3. Follow the installation wizard
4. Enter the server URL when prompted: `https://your-xeworkspace-domain.com`
5. Log in with your XeWorkspace credentials
6. The agent will start automatically and appear in your system tray

### Step 5: Verify Connection

1. Look for the XeWorkspace icon in your system tray
2. Right-click the icon to see connection status
3. Status should show: **Connected** or **Streaming**
4. Green indicator = Active monitoring
5. Orange indicator = Paused/Idle

---

## Desktop Agent Setup

### System Requirements

- **Windows**: Windows 10 or later (64-bit)
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Ubuntu 20.04+ or equivalent

### Installation Steps

#### Windows

```
1. Download: XeWorkspace-Agent-Setup.exe
2. Run installer as Administrator
3. Accept license agreement
4. Choose installation directory
5. Complete installation
6. Launch from Start Menu or system tray
```

#### macOS

```
1. Download: XeWorkspace-Agent.dmg
2. Open DMG file
3. Drag XeWorkspace Agent to Applications
4. Grant required permissions:
   - Screen Recording
   - Accessibility
5. Launch from Applications
```

### Agent Configuration

On first launch:

1. **Server URL**: Enter your XeWorkspace server address
2. **Login**: Use your employee credentials
3. **Settings**:
   - Screenshot interval: Default 5 minutes
   - Stream quality: Low/Medium/High
   - Auto-start with system: Recommended

### Agent Controls

| Icon Color | Status | Description |
|------------|--------|-------------|
| 🟢 Green | Streaming | Live monitoring active |
| 🟡 Yellow | Connected | Connected but idle |
| 🔴 Red | Disconnected | Not connected to server |
| ⚫ Gray | Paused | Monitoring paused |

Right-click system tray icon for:
- Pause/Resume monitoring
- View settings
- Check connection status
- Exit application

---

## Live Monitoring Dashboard

### Accessing Live Viewer (Admin Only)

1. Log in as Admin/Owner
2. Navigate to **Monitoring** > **Live Viewer**
3. View all active employee streams in grid layout

### Live Viewer Features

- **Grid View**: See multiple employees at once (2x2, 3x3, 4x4)
- **Full Screen**: Click any stream for enlarged view
- **Employee Status**:
  - 🟢 Online & Streaming
  - 🟡 Online but Idle
  - 🔴 Offline
  - ⏸️ Paused

### Stream Controls

- **Refresh**: Force refresh a specific stream
- **Full Screen**: Expand stream to full view
- **Screenshot**: Capture current frame immediately
- **Timeline**: View recent activity for the stream

---

## Daily Activity Reports

### What's Tracked

| Metric | Description |
|--------|-------------|
| **Active Time** | Total time with keyboard/mouse activity |
| **Idle Time** | Time with no activity (configurable threshold) |
| **Applications** | Apps used with time spent on each |
| **Websites** | Browser tabs and time per site |
| **Screenshots** | Number of screenshots captured |
| **Productivity Score** | AI-calculated based on app categories |

### Viewing Reports (Admin)

1. Navigate to **Monitoring** > **Daily Reports**
2. Select date using the date picker
3. View summary cards:
   - Total active users
   - Total active time
   - Average productivity score
4. Click employee card to expand details:
   - Application breakdown
   - Website usage
   - Productivity timeline

### Application Categories

| Category | Examples | Productivity |
|----------|----------|--------------|
| Development | VS Code, Terminal, IntelliJ | ✅ Productive |
| Productive | Slack, Teams, Office | ✅ Productive |
| Browser | Chrome, Firefox, Edge | ⚠️ Neutral |
| Entertainment | Spotify, Netflix, Games | ❌ Unproductive |
| System | Finder, Explorer, Settings | ⚪ Neutral |

---

## Privacy & Compliance

### Employee Rights

- **Consent Required**: Monitoring only starts after explicit consent
- **Transparency**: Employees see exactly what is monitored
- **Revocable**: Consent can be revoked at any time
- **Data Access**: Employees can request their monitoring data
- **Work Hours Only**: Monitoring limited to configured work hours

### Administrator Responsibilities

- **Notify Employees**: Inform about monitoring policies
- **Purpose Limitation**: Use data only for stated purposes
- **Data Security**: Ensure captured data is securely stored
- **Retention Limits**: Delete old data per retention policy
- **GDPR Compliance**: Follow data protection regulations

### Data Storage

- Screenshots stored in secure S3 buckets
- Per-organization isolation
- Configurable retention period (default: 30 days)
- Encrypted at rest and in transit

### Audit Trail

All monitoring actions are logged:
- Consent given/revoked
- Monitoring enabled/disabled
- Data access by administrators
- Report generation

---

## Quick Reference

### Employee Checklist

- [ ] Receive monitoring notification from admin
- [ ] Visit `/monitoring/consent` page
- [ ] Review monitoring terms carefully
- [ ] Accept or decline consent
- [ ] Download and install desktop agent
- [ ] Configure agent with server URL
- [ ] Log in with your credentials
- [ ] Verify connection status (green icon)

### Admin Checklist

- [ ] Enable monitoring in organization settings
- [ ] Configure screenshot intervals
- [ ] Enable monitoring for specific employees
- [ ] Wait for employee consent
- [ ] Verify employee agent is connected
- [ ] Access live viewer or daily reports
- [ ] Review productivity analytics

---

## Troubleshooting

### Employee Issues

| Problem | Solution |
|---------|----------|
| Can't see consent page | Check if monitoring is enabled for you |
| Agent won't connect | Verify server URL and credentials |
| Agent keeps disconnecting | Check internet connection |
| Can't install agent | Run as Administrator / grant permissions |

### Admin Issues

| Problem | Solution |
|---------|----------|
| No employees in live viewer | Employees need to consent and install agent |
| Stream shows "Offline" | Employee agent may be paused or disconnected |
| No daily report data | Wait for agent to send activity data |
| Screenshots not appearing | Check S3 storage configuration |

---

## API Endpoints

### Consent Management

```
GET  /api/monitoring/consent/me     - Get current consent status
POST /api/monitoring/consent/me     - Submit consent (accept/revoke)
```

### Admin Endpoints

```
GET  /api/monitoring/reports/daily  - Get daily activity report
GET  /api/monitoring/screenshots    - List screenshots
POST /api/monitoring/screenshots    - Upload screenshot (agent)
```

---

## Support

For technical issues or questions:
- **Email**: support@xenonlabs.ai
- **Documentation**: `/docs/monitoring`
- **Help Center**: `/help`

---

*This document is for XeWorkspace v1.0. Features may vary in different versions.*
