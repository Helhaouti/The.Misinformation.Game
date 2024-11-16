# Function to ensure environment variables are set
function Set-EnvVariable {
    param (
        [string]$varName,
        [string]$promptMessage
    )
    
    if (-not [System.Environment]::GetEnvironmentVariable($varName, "Process")) {
        $value = Read-Host -Prompt $promptMessage
        [System.Environment]::SetEnvironmentVariable($varName, $value, "Process")
    }
}

# Ensure each variable is set

Set-EnvVariable "TF_VAR_secret_key_flask" "Enter the Flask Secret Key"
Set-EnvVariable "TF_VAR_key_vault_name" "Enter the Key Vault Name"
Set-EnvVariable "AZURE_CONTAINER_SAS_TOKEN" "Enter the SAS Token"

# Execute Terraform commands
terraform init -backend-config="sas_token=$env:AZURE_CONTAINER_SAS_TOKEN"
terraform refresh
terraform plan
terraform apply