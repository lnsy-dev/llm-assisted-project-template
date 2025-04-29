#!/bin/bash

# Start the server with bun watch on port 3131
bun --watch server.js 3131 &

# Store the server process ID
SERVER_PID=$!

# Wait a moment for the server to start
sleep 2

# Open the browser
open http://localhost:3131

# Function to handle script termination
cleanup() {
    echo "Stopping server..."
    kill $SERVER_PID
    exit 0
}

# Set up trap to catch script termination
trap cleanup SIGINT SIGTERM

# Keep the script running
wait $SERVER_PID 