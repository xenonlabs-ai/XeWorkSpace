/**
 * Test script to simulate desktop agent streaming
 * Run with: npx tsx scripts/test-stream.ts
 */

import { io } from "socket.io-client";
import * as fs from "fs";
import * as path from "path";

const SERVER_URL = "http://localhost:3000";
const TEST_SESSION_ID = "test-session-001";
const TEST_USER_ID = "test-user-001";
const DEVICE_NAME = "Test-PC";
const USER_NAME = "Test User";

// Create a simple colored rectangle as test frame
function createTestFrame(color: string): string {
  // Create a simple SVG and convert to base64
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white"
            text-anchor="middle" dominant-baseline="middle">
        XeTask Live Stream Test
      </text>
      <text x="50%" y="60%" font-family="Arial" font-size="24" fill="white"
            text-anchor="middle" dominant-baseline="middle">
        ${new Date().toLocaleTimeString()}
      </text>
      <text x="50%" y="70%" font-family="Arial" font-size="18" fill="white"
            text-anchor="middle" dominant-baseline="middle">
        Device: ${DEVICE_NAME} | User: ${USER_NAME}
      </text>
    </svg>
  `;

  return Buffer.from(svg).toString("base64");
}

// Colors to cycle through
const colors = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
];

let colorIndex = 0;

async function main() {
  console.log("Connecting to server...");

  const socket = io(SERVER_URL, {
    path: "/api/socket",
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Connected to server!");
    console.log("Socket ID:", socket.id);

    // Start streaming
    socket.emit("stream:start", {
      sessionId: TEST_SESSION_ID,
      userId: TEST_USER_ID,
      deviceName: DEVICE_NAME,
      userName: USER_NAME,
    });

    console.log(`Started streaming session: ${TEST_SESSION_ID}`);
    console.log("Sending frames every 500ms...");
    console.log("Press Ctrl+C to stop");

    // Send frames at 2 FPS
    const interval = setInterval(() => {
      const frame = createTestFrame(colors[colorIndex % colors.length]);
      colorIndex++;

      socket.emit("stream:frame", {
        sessionId: TEST_SESSION_ID,
        userId: TEST_USER_ID,
        frame: frame,
        deviceName: DEVICE_NAME,
        userName: USER_NAME,
      });

      process.stdout.write(".");
    }, 500);

    // Handle Ctrl+C
    process.on("SIGINT", () => {
      console.log("\nStopping stream...");
      clearInterval(interval);

      socket.emit("stream:stop", { sessionId: TEST_SESSION_ID });

      setTimeout(() => {
        socket.disconnect();
        console.log("Disconnected. Goodbye!");
        process.exit(0);
      }, 500);
    });
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
    console.log("Make sure the server is running with: npm run dev:socket");
    process.exit(1);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
}

main().catch(console.error);
