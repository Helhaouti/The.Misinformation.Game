# Powershell script to setup a dockerized mysql database.

# Run by:
# - CD into project directory, and run: ./mysql-setup.ps1;
# - or by clicking on `Run` this file in the context menu (right click) in IntelliJ *(development mode in windows required)*.

$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-Not $dockerInstalled) {
    if ($IsWindows) {
        Write-Host "Docker desktop is not installed, yet. Starting instalation..."
        winget install Docker.DockerDesktop
    }
    else {
        throw "Docker is not installed "
    }
}


$dockerInActive = (docker info 2>&1) -ilike "*error*"
if ($dockerInActive) {
    if ($IsWindows) {
        # Start Docker
        Write-Host "Starting Docker..."
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"        
    }
    else {
        throw "Docker is not Active."
    }
}


while ($true) {
    $dockerInActive = (docker info 2>&1) -ilike "*error*"
    if ($dockerInActive) {
        Write-Host "Waiting for Docker to start..."
        Start-Sleep -Seconds 1
    }
    else {
        break
    }
}


$mysqlContainerAvailable = docker ps -a --filter "name=mysql" -q 2>$null
if (-Not $mysqlContainerAvailable) {
    Write-Host "No MySQL container found, making one..."

    docker run --name "mysql" -d `
        -p 3306:3306 `
        -e "MYSQL_ROOT_PASSWORD=local_root" `
        -e "MYSQL_DATABASE=local" `
        -e "MYSQL_USER=local" `
        -e "MYSQL_PASSWORD=local" `
        mysql:8.3
}
else {
    Write-Host "MySQL container found, starting it..."
    docker start mysql
}
