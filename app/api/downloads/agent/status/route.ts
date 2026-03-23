import { NextRequest, NextResponse } from "next/server";
import { existsSync, statSync } from "fs";
import { join } from "path";

// Agent file configurations
const AGENT_FILES: Record<string, { filename: string; label: string }> = {
  windows: {
    filename: "XeWorkspace-Agent-Setup.exe",
    label: "Windows",
  },
  mac: {
    filename: "XeWorkspace-Agent.dmg",
    label: "macOS",
  },
  linux: {
    filename: "XeWorkspace-Agent.AppImage",
    label: "Linux",
  },
};

// GET /api/downloads/agent/status - Check which agent files are available
export async function GET(request: NextRequest) {
  const availability: Record<string, { available: boolean; size?: number; label: string }> = {};

  for (const [platform, config] of Object.entries(AGENT_FILES)) {
    const possiblePaths = [
      join(process.cwd(), "public", "downloads", config.filename),
      join(process.cwd(), "xe-desktop-agent", "release", config.filename),
    ];

    let found = false;
    let fileSize: number | undefined;

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        found = true;
        try {
          const stat = statSync(path);
          fileSize = stat.size;
        } catch {
          // Ignore stat errors
        }
        break;
      }
    }

    availability[platform] = {
      available: found,
      size: fileSize,
      label: config.label,
    };
  }

  const anyAvailable = Object.values(availability).some((a) => a.available);

  return NextResponse.json({
    availability,
    anyAvailable,
    buildRequired: !anyAvailable,
    buildInstructions: !anyAvailable
      ? {
          message: "Desktop agent installers have not been built yet.",
          steps: [
            "Navigate to xe-desktop-agent directory",
            "Run: npm install",
            "Run: npm run package (or npm run package:win for Windows only)",
            "Copy built files from xe-desktop-agent/release/ to public/downloads/",
          ],
        }
      : null,
  });
}
