
variable "resource_group_name" {
  type        = string
  default     = "misinfogame-rg"
  description = "The name of the resource group"
}

variable "key_vault_name" {
  type        = string
  default     = "key-vault"
  description = "The name of the KeyVault"
}

variable "key_vault_location" {
  type        = string
  default     = "westeurope"
  description = "The location of the KeyVault"
}
