import { NextRequest, NextResponse } from "next/server";

// GitHub repository info
const GITHUB_OWNER = "xenonlabs-ai";
const GITHUB_REPO = "XeWorkSpace";

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

  try {
    // Build headers - include auth token if available (for private repos)
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "XeWorkspace-Agent-Download",
    };

    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
      headers["Authorization"] = `Bearer ${githubToken}`;
    }

    // Get the latest release from GitHub
    const releaseResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`,
      {
        headers,
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
      return NextResponse.json(
        {
          error: "No agent release found",
          message: "The desktop agent has not been released yet. Please contact your administrator.",
          instructions: "Run: git tag agent-v1.0.0 && git push --tags",
        },
        { status: 404 }
      );
    }

    // Find the asset for this platform
    const asset = agentRelease.assets.find(
      (a: any) => a.name === fileConfig.filename
    );

    if (!asset) {
      return NextResponse.json(
        {
          error: "Platform not available",
          message: `The ${platform} installer is not available in this release.`,
          availableAssets: agentRelease.assets.map((a: any) => a.name),
        },
        { status: 404 }
      );
    }

    // For private repos, we need to fetch the asset with auth and stream it
    // For public repos, we can redirect directly
    if (githubToken) {
      // Fetch the asset with authentication
      const assetResponse = await fetch(asset.url, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/octet-stream",
          "User-Agent": "XeWorkspace-Agent-Download",
        },
      });

      if (!assetResponse.ok) {
        throw new Error("Failed to download asset");
      }

      // Stream the response back with correct headers
      return new NextResponse(assetResponse.body, {
        headers: {
          "Content-Type": fileConfig.contentType,
          "Content-Disposition": `attachment; filename="${fileConfig.filename}"`,
          "Content-Length": asset.size.toString(),
        },
      });
    }

    // Redirect to the GitHub download URL (works for public repos)
    return NextResponse.redirect(asset.browser_download_url);
  } catch (error) {
    console.error("Error fetching release:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch download",
        message: "Unable to retrieve the download link. Please try again later.",
      },
      { status: 500 }
    );
  }
}
