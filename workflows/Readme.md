This branch is used for the development and testing of the Terraform CI/CD script.

# Info
# login: p.j.odenhoven@hva.nl
# subscription: Self-HBO_ICT
# serviceprincipal: self-hbo-ict-deployment

AZURE_TENANT_ID: 0907bb1e-21fc-476f-8843-02d09ceb59a7   #d77fc2e7-e5bb-4db5-8df0-9b9da57b7b7d

AZURE_SUBSCRIPTION_ID: 7421d281-52e1-4c64-b11d-12ee02151732

AZURE_CLIENT_ID: c2013f00-8024-4649-9e87-f141e7009e39

# Instructure

## Main Terraform script

1. Clone the repository:

```bash
git clone https://gitlab.fdmci.hva.nl/major-cloud-solutions/2324_sem_2/themisinformationgame-1.git
```

2. Switch directory to `workflows/terraform-main`:

```bash
cd workflows/terraform-main
```

3. If you are using Mac or Linux run `setup.sh`:

```bash
chmod +x setup.sh
./setup.sh
```

* If you are using Windows run `setup.ps1`:
```powershell
./setup.ps1    
```

4. When you are done with using the infrastructure you created run:

Mac or Linux:
```bash 
terraform destroy -auto-approve \
    -var="key_vault_name=$AZURE_KEY_VAULT_NAME" \
    -var="secret_key_flask=$SECRET_KEY_FLASK" 
```

Windows:
```powershell
terraform destroy -auto-approve `
    -var="key_vault_name=$env:AZURE_KEY_VAULT_NAME" `
    -var="secret_key_flask=$env:SECRET_KEY_FLASK"
```

## KeyVault Terraform script

1. Clone the repository:
```bash
git clone https://gitlab.fdmci.hva.nl/major-cloud-solutions/2324_sem_2/themisinformationgame-1.git
```

2. Switch directory to `workflows/terraform-keyvault`:
```bash
cd workflows/terraform-keyvault
```

3. If you are using Mac or Linux run `setup.sh`:
```bash
chmod +x setup.sh
./setup.sh
```

* If you are using Windows run `setup.ps1`:
```powershell
./setup.ps1    
```

4. When you are done with using the infrastructure you created run:
```bash 
terraform destroy
```