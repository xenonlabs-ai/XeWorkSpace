import { NextResponse } from "next/server";

// GitHub repository info
const GITHUB_OWNER = "xenonlabs-ai";
const GITHUB_REPO = "XeWorkSpace";

// Expected filenames for each platform
const PLATFORM_FILES: Record<string, string> = {
  windows: "XeWorkspace-Agent-Setup.exe",
  mac: "XeWorkspace-Agent.dmg",
  linux: "XeWorkspace-Agent.AppImage",
};

// GET /api/downloads/agent/status
export async function GET() {
  try {
    // Get releases from GitHub
    const releaseResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "XeWorkspace-Agent-Status",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!releaseResponse.ok) {
      throw new Error("Failed to fetch releases");
    }

    const releases = await releaseResponse.json();

    // Find the latest agent release (tags starting with "agent-v")
    const agentRelease = releases.find((r: any) =>
      r.tag_name.startsWith("agent-v")
    );

    if (!agentRelease) {
      // No release found - all platforms unavailable
      return NextResponse.json({
        hasRelease: false,
        version: null,
        availability: {
          windows: { available: false, label: "Not released" },
          mac: { available: false, label: "Not released" },
          linux: { available: false, label: "Not released" },
        },
        message: "No desktop agent release found. Create a release by tagging: git tag agent-v1.0.0 && git push --tags",
      });
    }

    // Check availability for each platform
    const availability: Record<string, { available: boolean; label: string; size?: string }> = {};

    for (const [platform, filename] of Object.entries(PLATFORM_FILES)) {
      const asset = agentRelease.assets.find((a: any) => a.name === filename);
      if (asset) {
        const sizeMB = (asset.size / (1024 * 1024)).toFixed(1);
        availability[platform] = {
          available: true,
          label: `v${agentRelease.tag_name.replace("agent-v", "")} (${sizeMB} MB)`,
          size: sizeMB,
        };
      } else {
        availability[platform] = {
          available: false,
          label: "Not available",
        };
      }
    }

    return NextResponse.json({
      hasRelease: true,
      version: agentRelease.tag_name.replace("agent-v", ""),
      releaseDate: agentRelease.published_at,
      releaseName: agentRelease.name,
      availability,
      releaseUrl: agentRelease.html_url,
    });
  } catch (error) {
    console.error("Error checking agent status:", error);

    return NextResponse.json({
      hasRelease: false,
      version: null,
      availability: {
        windows: { available: false, label: "Error checking" },
        mac: { available: false, label: "Error checking" },
        linux: { available: false, label: "Error checking" },
      },
      error: "Failed to check release status",
    });
  }
}
