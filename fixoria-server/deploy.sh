#!/bin/bash

# Log the start of the deployment
echo "Starting deployment at $(date)" >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log

# Add Node.js global binary path to PATH
export PATH=$PATH:~/.npm-global/bin

# Navigate to the backend project directory
cd /home/matteitc/public_html/fixoria/fixoria-server || { 
    echo "Directory not found!" >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log; exit 1; 
}

# Start the SSH agent and add the SSH key
echo "Starting SSH agent..." >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
eval $(ssh-agent -s) >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log 2>&1
ssh-add /home/matteitc/.ssh/id_rsa >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log 2>&1

# Check if SSH agent setup was successful
if [ $? -ne 0 ]; then
    echo "Error starting SSH agent or adding key" >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
    exit 1
fi

# Wait for SSH agent to fully initialize
sleep 2

# Pull the latest changes from GitHub
echo "Pulling latest changes from GitHub..." >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
git pull origin main >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log 2>&1

# Check if git pull was successful
if [ $? -ne 0 ]; then
    echo "Error pulling latest code from GitHub" >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
    exit 1
fi

# Install updated dependencies
echo "Installing dependencies..." >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
npm install >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log 2>&1

# Check if npm install was successful
if [ $? -ne 0 ]; then
    echo "Error installing dependencies" >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
    exit 1
fi

# Restart the app
echo "Restarting the server..." >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
pgrep -f app.js > /dev/null
if [ $? -eq 0 ]; then
    pkill -f app.js
fi
nohup node app.js > output.log 2>&1 &

# Check if the app restarted successfully
if [ $? -eq 0 ]; then
    echo "Deployment completed successfully at $(date)" >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
else
    echo "Error restarting the app" >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
    exit 1
fi

echo "Deployment script finished at $(date)" >> /home/matteitc/public_html/fixoria/fixoria-server/deploy.log
