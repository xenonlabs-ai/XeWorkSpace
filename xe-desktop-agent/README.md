# XeTask Desktop Agent

Electron-based desktop monitoring agent for XeTask employee monitoring system.

## Features

- **Screenshot Capture**: Periodic screen captures (configurable interval)
- **Window Tracking**: Active application and window title monitoring
- **Idle Detection**: Automatic idle state detection
- **System Tray**: Runs silently in system tray
- **Auto-start**: Optional launch on system startup

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
cd xe-desktop-agent
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Package for distribution
npm run package        # All platforms
npm run package:win    # Windows only
npm run package:mac    # macOS only
npm run package:linux  # Linux only
```

## Configuration

On first launch, the agent will open a settings window where you need to configure:

1. **Server URL**: The XeTask server URL (e.g., `http://localhost:3000`)
2. **Email**: Your registered email address
3. **Agent Key**: Your unique agent key (generated from the dashboard)
4. **Capture Interval**: Screenshot frequency (1-10 minutes)
5. **Idle Threshold**: Time before marking as idle (1-15 minutes)

## Usage

After configuration, the agent runs in the system tray. Right-click the tray icon to:

- View monitoring status
- Start/Stop monitoring
- Open settings
- Quit application

## Building

The packaged applications will be created in the `release` directory:

- **Windows**: `.exe` installer and `.zip` portable
- **macOS**: `.dmg` and `.zip`
- **Linux**: `.AppImage` and `.deb`

## Security

- Agent keys are encrypted in local storage
- All communication uses HTTPS in production
- Screenshots are uploaded immediately and deleted locally
- No data is stored permanently on the client machine

## Troubleshooting

### Agent won't connect
- Check server URL is correct
- Verify email and agent key match your account
- Ensure firewall allows outbound connections

### Screenshots not capturing
- Check if user is marked as idle
- Verify capture interval setting
- Check system permissions for screen capture

### High CPU usage
- Increase capture interval
- Close unnecessary background applications

## Development

```bash
# Watch mode with hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Lint
npm run lint
```

## License

MIT
