#!/bin/bash

# Check for root privileges
[ "$EUID" -ne 0 ] && echo "Please run this script with sudo or as root." && exit 1

# Function to check command success or exit
check_command_success() { [ $? -ne 0 ] && echo "Error: The previous command failed. Exiting..." && exit 1; }

# Update the package manager
sudo yum update -y
check_command_success

# Install required packages
sudo yum install epel-release java-17-openjdk wget -y
check_command_success

# Add Jenkins repository
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo --no-check-certificate
check_command_success

# Import Jenkins repository key
sudo rpm --import http://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
check_command_success

# Install Jenkins
sudo yum install jenkins -y
check_command_success

# Start Jenkins service and check status
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
check_command_success

echo "Jenkins installation and setup completed successfully."
