#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No color

# Function to check errors
check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}An error occurred during installation. Check the logs.${NC}"
        exit 1
    fi
}

# Update system packages
echo -e "${GREEN}Updating system packages...${NC}"
sudo dnf update -y
check_error

# Install required dependencies
echo -e "${GREEN}Installing required packages...${NC}"
sudo dnf install -y dnf-utils curl zip unzip
check_error

# Add Docker repository
echo -e "${GREEN}Adding Docker repository...${NC}"
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
check_error

# Remove potential conflicts (runc package)
echo -e "${GREEN}Removing conflicting packages (if any)...${NC}"
sudo dnf remove -y runc
check_error

# Install Docker
echo -e "${GREEN}Installing Docker CE and dependencies...${NC}"
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin --nobest
check_error

# Start and enable Docker service
echo -e "${GREEN}Starting and enabling Docker service...${NC}"
sudo systemctl enable --now docker
check_error

# Check Docker installation
echo -e "${GREEN}Verifying Docker installation...${NC}"
sudo docker --version
check_error

# Install Docker Compose (standalone binary)
echo -e "${GREEN}Installing Docker Compose (standalone binary)...${NC}"
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f 4)
sudo curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
check_error

# Make Docker Compose executable
echo -e "${GREEN}Setting permissions for Docker Compose...${NC}"
sudo chmod +x /usr/local/bin/docker-compose
check_error

# Create a symlink (if necessary)
echo -e "${GREEN}Creating a symlink for Docker Compose (if needed)...${NC}"
if [ ! -L /usr/bin/docker-compose ]; then
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    check_error
fi

# Verify Docker Compose installation
echo -e "${GREEN}Verifying Docker Compose installation...${NC}"
docker-compose --version
check_error

# Add current user to the Docker group
echo -e "${GREEN}Adding the current user to the Docker group...${NC}"
sudo usermod -aG docker $USER
check_error

# Final message
echo -e "${GREEN}Installation completed successfully!${NC}"
echo -e "${GREEN}Please log out and log back in to apply Docker group changes.${NC}"
