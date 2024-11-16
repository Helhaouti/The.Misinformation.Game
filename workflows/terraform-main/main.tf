# Generate a random integer to create a globally unique name
resource "random_integer" "ri" {
  min   = 1
  max   = 100000
  count = 3 # Generate 3 random integers
}

# Fetch the data about resource group 
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# Fetch the data about container registry
data "azurerm_container_registry" "acr" {
  name                = var.acr
  resource_group_name = var.resource_group_name
}

# Fetch the data about KeyVault
data "azurerm_key_vault" "kv" {
  name                = var.key_vault_name
  resource_group_name = var.resource_group_name
}

# Fetch the data about the current client configuration
data "azurerm_client_config" "current" {}

# Azure Container App Environment for the backend
resource "azurerm_container_app_environment" "container_app_backend_environment" {
  name                = var.container_app_backend_environment_name
  location            = var.container_app_environment_location
  resource_group_name = var.resource_group_name
}

# Azure Container App for the backend
resource "azurerm_container_app" "containerapp_backend" {
  name                         = "${var.containerapp_backend_name}-${random_integer.ri[0].result}"
  resource_group_name          = var.resource_group_name
  container_app_environment_id = azurerm_container_app_environment.container_app_backend_environment.id
  depends_on = [
  azurerm_container_app_environment.container_app_backend_environment]
  revision_mode = "Single"

  secret {
    name  = "container-registry-password"
    value = data.azurerm_container_registry.acr.admin_password
  }

  template {
    min_replicas = 0
    max_replicas = 10

    container {
      name   = "backend"
      image  = var.docker_image_name_backend
      cpu    = "0.75"
      memory = "1.5Gi"
    }

    http_scale_rule {
      name                = "httpscaling"
      concurrent_requests = "16" # Scale up for every 16 concurrent HTTP requests
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server               = data.azurerm_container_registry.acr.login_server
    username             = data.azurerm_container_registry.acr.admin_username
    password_secret_name = "container-registry-password"
  }
}

# Azure Container App Environment for the frontend_admin
resource "azurerm_container_app_environment" "container_app_frontend_admin_environment" {
  name                = var.container_app_frontend_admin_environment_name
  location            = var.container_app_environment_location
  resource_group_name = var.resource_group_name
}

# Azure Container App for the frontend_admin
resource "azurerm_container_app" "containerapp_frontend_admin" {
  name                         = "${var.containerapp_frontend_admin_name}-${random_integer.ri[1].result}"
  resource_group_name          = var.resource_group_name
  container_app_environment_id = azurerm_container_app_environment.container_app_frontend_admin_environment.id
  revision_mode                = "Single"
  depends_on                   = [azurerm_container_app_environment.container_app_frontend_admin_environment, azurerm_container_app.containerapp_backend]

  secret {
    name  = "container-registry-password"
    value = data.azurerm_container_registry.acr.admin_password
  }

  template {
    min_replicas = 0
    max_replicas = 10

    container {
      name   = "frontend-admin"
      image  = var.docker_image_name_frontend_admin
      cpu    = "0.5"
      memory = "1Gi"

      # Environment variables that are passed to the container on startup
      env {
        name  = "KEY_VAULT_NAME"
        value = data.azurerm_key_vault.kv.name
      }

      env {
        name  = "SECRET_KEY_FLASK"
        value = var.secret_key_flask
      }

      env {
        name  = "FA_API_URL"
        value = "https://${azurerm_container_app.containerapp_backend.latest_revision_fqdn}"
      }
    }

    http_scale_rule {
      name                = "httpscaling"
      concurrent_requests = "16" # Scale up for every 16 concurrent HTTP requests
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server               = data.azurerm_container_registry.acr.login_server
    username             = data.azurerm_container_registry.acr.admin_username
    password_secret_name = "container-registry-password"
  }

  # Assign a managed identity to the container app so it can access the KeyVault
  identity {
    type = "SystemAssigned"
  }
}

# Access policy for the KeyVault -- connect frontend_admin to KeyVault
resource "azurerm_key_vault_access_policy" "kv_access_policy" {
  key_vault_id = data.azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_container_app.containerapp_frontend_admin.identity[0].principal_id
  depends_on   = [azurerm_container_app.containerapp_frontend_admin]

  secret_permissions = [
    "Get",  # get a secret
    "List", # list secrets
  ]
}

# Azure Container App Environment for the frontend_client
resource "azurerm_container_app_environment" "container_app_frontend_client_environment" {
  name                = var.container_app_frontend_client_environment_name
  location            = var.container_app_environment_location
  resource_group_name = var.resource_group_name
}

# Azure Container App for the frontend_client
resource "azurerm_container_app" "containerapp_frontend_client" {
  name                         = "${var.containerapp_frontend_client_name}-${random_integer.ri[2].result}"
  resource_group_name          = var.resource_group_name
  container_app_environment_id = azurerm_container_app_environment.container_app_frontend_client_environment.id
  depends_on                   = [azurerm_container_app_environment.container_app_frontend_client_environment]
  revision_mode                = "Single"

  secret {
    name  = "container-registry-password"
    value = data.azurerm_container_registry.acr.admin_password
  }

  template {
    min_replicas = 0
    max_replicas = 10

    container {
      name   = "frontend-client"
      image  = var.docker_image_name_frontend_client
      cpu    = "0.5"
      memory = "1Gi"
    }

    http_scale_rule {
      name                = "httpscaling"
      concurrent_requests = "16" # Scale up for every 16 concurrent HTTP requests
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server               = data.azurerm_container_registry.acr.login_server
    username             = data.azurerm_container_registry.acr.admin_username
    password_secret_name = "container-registry-password"
  }
}
