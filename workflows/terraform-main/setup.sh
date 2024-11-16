# You can retrieve the variables from the GitLab CI/CD environment variables.
# Go to Settings --> CI/CD --> Variables.
export AZURE_CONTAINER_SAS_TOKEN="your_access_token"
export AZURE_KEY_VAULT_NAME="your_key_vault_name"
export SECRET_KEY_FLASK="your_secret_key"

terraform init \
    -backend-config="sas_token=$AZURE_CONTAINER_SAS_TOKEN" \
    -var="key_vault_name=$AZURE_KEY_VAULT_NAME" \
    -var="secret_key_flask=$SECRET_KEY_FLASK"

terraform plan \
    -var="key_vault_name=$AZURE_KEY_VAULT_NAME" \
    -var="secret_key_flask=$SECRET_KEY_FLASK" \
    -out="terraform-deploy.plan"

terraform apply -auto-approve "terraform-deploy.plan"

