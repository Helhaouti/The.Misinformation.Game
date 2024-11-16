import os

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from dotenv import load_dotenv


class Config():
    load_dotenv()
    #  Setup connection to the keyvault if it's enabled
    azureEnabled = os.environ.get("AZURE_ENABLED", "FALSE").upper() == "TRUE"

    if azureEnabled:
        kv_name = os.environ.get("KEY_VAULT_NAME")
        kv_url = f"https://{kv_name}.vault.azure.net"
        client = SecretClient(vault_url=kv_url, credential=DefaultAzureCredential())
        SECRET_KEY = client.get_secret(os.environ.get("SECRET_KEY_FLASK")).value
    else:
        SECRET_KEY = os.environ.get("SECRET_KEY_FLASK") or os.urandom(24)



# The enviroment variables added on top of the default keys (Secret key etc.) if you do flask run --debug
class ConfigDebug(Config):
    API_URL = os.environ.get("FA_API_URL_DEBUG")

# The enviroment variables added on top of the default keys when you run flask run (without the --debug)
class ConfigProd(Config):
    API_URL = os.environ.get("FA_API_URL_PRODUCTION")