# Resource Group
variable "resource_group_name" {
  type        = string
  default     = "misinfogame-rg"
  description = "The name of the resource group"
}

# Container Registry
variable "acr" {
  type        = string
  default     = "misinfogameacrbackend"
  description = "The name of the Azure Container Registry"
}

variable "docker_image_name_backend" {
  type        = string
  default     = "misinfogameacrbackend.azurecr.io/backend:latest"
  description = "The name of the backend Docker image"
}

variable "docker_image_name_frontend_admin" {
  type        = string
  default     = "misinfogameacrbackend.azurecr.io/frontend_admin:latest"
  description = "The name of the frontend admin Docker image"
}

variable "docker_image_name_frontend_client" {
  type        = string
  default     = "misinfogameacrbackend.azurecr.io/frontend_client:latest"
  description = "The name of the frontend client Docker image"
}

# Container App Environments 
variable "container_app_environment_location" {
  type        = string
  default     = "westeurope"
  description = "Location of container app environments"
}

variable "container_app_backend_environment_name" {
  type        = string
  default     = "backend-environment"
  description = "Name of the backend container app environment"
}

variable "container_app_frontend_admin_environment_name" {
  type        = string
  default     = "frontend-admin-environment"
  description = "Name of the frontend admin container app environment"
}

variable "container_app_frontend_client_environment_name" {
  type        = string
  default     = "frontend-client-environment"
  description = "Name of the frontend client container app environment"
}

# Container Apps
variable "containerapp_backend_name" {
  type        = string
  default     = "backend"
  description = "Name of the backend container app"
}

variable "containerapp_frontend_admin_name" {
  type        = string
  default     = "misinfogame-dashboard"
  description = "Name of the frontend admin container app"
}

variable "containerapp_frontend_client_name" {
  type        = string
  default     = "frontend-client"
  description = "Name of the frontend client container app"
}

# Key Vault
variable "key_vault_name" {
  type        = string
  sensitive   = true
  description = "Name of the Key Vault"
}

# Flask secret key -- environment variable for the backend
variable "secret_key_flask" {
  type        = string
  sensitive   = true
  description = "Secret key for Flask"
}

