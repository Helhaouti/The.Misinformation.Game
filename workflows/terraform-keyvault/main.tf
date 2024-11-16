# Generate random integers
resource "random_integer" "ri" {
  min   = 1
  max   = 100000
  count = 1
}

# Get the name of the resource group
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# Get the name of the current subscription
data "azurerm_subscription" "current" {}

# Get information about current tenant
data "azurerm_client_config" "current_tenant" {}

# Create a Key Vault
resource "azurerm_key_vault" "key_vault" {
  name                     = "${var.key_vault_name}-${random_integer.ri[0].result}"
  location                 = var.key_vault_location
  resource_group_name      = var.resource_group_name
  tenant_id                = data.azurerm_client_config.current_tenant.tenant_id
  purge_protection_enabled = false # it is not possible to delete the key vault for 90 days if set to true
  sku_name                 = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current_tenant.tenant_id
    object_id = data.azurerm_client_config.current_tenant.object_id

    secret_permissions = [
      "Get",    # get a secret
      "Set",    # create a secret
      "Delete", # delete a secret
      "List",   # list secrets
    ]
  }
}
