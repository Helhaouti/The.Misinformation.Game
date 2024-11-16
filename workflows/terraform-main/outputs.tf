output "resource_group_name" {
  value = data.azurerm_resource_group.rg.name
}

output "acr_name" {
  value = data.azurerm_container_registry.acr.name
}

output "container_app_backend_environment_name" {
  value = azurerm_container_app_environment.container_app_backend_environment.name
}

output "containerapp_backend_name" {
  value = azurerm_container_app.containerapp_backend.name
}

output "container_app_frontend_admin_environment_name" {
  value = azurerm_container_app_environment.container_app_frontend_admin_environment.name
}

output "containerapp_frontend_admin_name" {
  value = azurerm_container_app.containerapp_frontend_admin.name
}

output "container_app_frontend_client_environment_name" {
  value = azurerm_container_app_environment.container_app_frontend_client_environment.name
}

output "containerapp_frontend_client_name" {
  value = azurerm_container_app.containerapp_frontend_client.name
}

output "backend_url" {
  value = "https://${azurerm_container_app.containerapp_backend.latest_revision_fqdn}"
}
