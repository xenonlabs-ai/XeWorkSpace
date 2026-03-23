import { NextRequest, NextResponse } from "next/server";
import { existsSync, statSync, createReadStream } from "fs";
import { join } from "path";

// Agent file configurations
const AGENT_FILES: Record<string, { filename: string; contentType: string }> = {
  windows: {
    filename: "XeWorkspace-Agent-Setup.exe",
    contentType: "application/octet-stream",
  },
  mac: {
    filename: "XeWorkspace-Agent.dmg",
    contentType: "application/octet-stream",
  },
  linux: {
    filename: "XeWorkspace-Agent.AppImage",
    contentType: "application/octet-stream",
  },
};

// GET /api/downloads/agent?platform=windows|mac|linux
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");

  if (!platform || !AGENT_FILES[platform]) {
    return NextResponse.json(
      { error: "Invalid platform. Use: windows, mac, or linux" },
      { status: 400 }
    );
  }

  const fileConfig = AGENT_FILES[platform];

  // Check multiple possible locations for the agent files
  const possiblePaths = [
    join(process.cwd(), "public", "downloads", fileConfig.filename),
    join(process.cwd(), "xe-desktop-agent", "release", fileConfig.filename),
  ];

  let filePath: string | null = null;
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      filePath = path;
      break;
    }
  }

  if (!filePath) {
    return NextResponse.json(
      {
        error: "Agent not available",
        message: `The ${platform} desktop agent has not been built yet. Please contact your administrator.`,
        buildInstructions: {
          step1: "cd xe-desktop-agent",
          step2: "npm install",
          step3: `npm run package:${platform === "windows" ? "win" : platform}`,
          step4: "Copy the built file to public/downloads/",
        },
      },
      { status: 404 }
    );
  }

  try {
    const stat = statSync(filePath);
    const fileStream = createReadStream(filePath);

    // Convert Node.js stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        fileStream.on("end", () => {
          controller.close();
        });
        fileStream.on("error", (err) => {
          controller.error(err);
        });
      },
    });

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": fileConfig.contentType,
        "Content-Disposition": `attachment; filename="${fileConfig.filename}"`,
        "Content-Length": stat.size.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving agent file:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}
