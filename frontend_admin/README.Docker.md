### Building and Running frontend_admin

1. **Update the Dockerfile:**

    To run this image locally, follow these steps:

    * **Add arguments and variables:**

      Add the following arguments to the Dockerfile, that will be provided during the build process:

      - `KEY_VAULT_NAME`: Name of the Azure KeyVault
      - `SECRET_KEY_FLASK`: Name of the secret stored in the Azure KeyVault
      - `FA_API_URL`: The URL of the backend

      ```Dockerfile
      ARG KEY_VAULT_NAME
      ENV KEY_VAULT_NAME=${KEY_VAULT_NAME}

      ARG SECRET_KEY_FLASK
      ENV SECRET_KEY_FLASK=${SECRET_KEY_FLASK}

      ARG FA_API_URL
      ENV FA_API_URL=${FA_API_URL}
      ```

    * **Install the Azure CLI:**

      ```bash
      curl -L https://aka.ms/InstallAzureCli | bash
      ```

      [Read the installation guide here](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=script)



2.  **Build Your Docker Image:**

    ```bash
    docker build --build-arg KEY_VAULT_NAME=your-keyvault --build-arg SECRET_KEY_FLASK=secret-key-Flask --build-arg FA_API_URL=https://my-backend.com -t frontend_admin .
    ```

3.  **Run Your Image:**

      ```bash
      docker run -p 8080:8080 frontend_admin
      ```

      Your application should now be available at:

      ```bash
      http://0.0.0.0:8080
      ```

      If port `8080` is occupied on your machine, you can forward any other available port:

      ```bash
      docker run -p 228:8080 frontend_admin
      ```

      Your application will now be accessible at:

      ```bash
      http://0.0.0.0:228
      ```

### Notes

- Ensure Docker is installed and running on your machine.
- Replace `228` with any port number that is available on your machine if `8080` is in use.

### Disclaimer

This Dockerfile has not been tested locally. Therefore, there is no guarantee that it will work on your machine.

### Deploying your application to the cloud

1. First, build your image, e.g.:
```bash
docker build --build-arg KEY_VAULT_NAME=your-keyvault --build-arg SECRET_KEY_FLASK=secret-key-Flask --build-arg FA_API_URL=https://my-backend.com -t frontend_admin .
```

2. If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
```bash
docker build --build-arg KEY_VAULT_NAME=your-keyvault --build-arg SECRET_KEY_FLASK=secret-key-Flask --build-arg FA_API_URL=https://my-backend.com -t frontend_admin . --platform linux/amd64
```

3. Then, push it to your registry, e.g. `docker push myregistry.com/frontend_admin`.


### Notes

* Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.
* [Docker's Python guide](https://docs.docker.com/language/python/)


### Deploying your application to the cloud using the pipeline

Run the `frontend_admin_build_and_push` stage in the pipeline.