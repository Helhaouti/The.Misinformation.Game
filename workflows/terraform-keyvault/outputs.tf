output "resource_group_name" {
  value = data.azurerm_resource_group.rg.name
}

output "current_subscription_display_name" {
  value = data.azurerm_subscription.current.display_name
}

output "key_vault_name" {
  value = azurerm_key_vault.key_vault.name
}
