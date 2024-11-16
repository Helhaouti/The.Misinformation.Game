[The Misinformation Game](assets/img/banner.png)
------------------------------------------------------
The Misinformation Game is a social-media simulator built to study
how people interact with information on social-media. To achieve
this, The Misinformation Game simulates a social-media feed for
research participants. Participants are shown fake social-media
posts, either one at a time or in a feed format. They may then
react to the posts and their comments. The Misinformation Game has
been designed to be highly customisable so that a range of tightly
controlled experiences can be created for participants. This
customisability is a core focus of The Misinformation Game, to
facilitate the research of a wide array of social-media related
questions.

**Paper:** [The (Mis)Information Game: A social media simulator](https://doi.org/10.3758/s13428-023-02153-x)

**Documentation:** [MisinfoGame.com](https://misinfogame.com)

For an overview of the project and application, refer to `DocumentationAndOverview.pdf` for additional documentation (alongside individual README files and in-code documentation). \
Alternatively, click here for immediate access to the .pdf: [DocumentationAndOverview.pdf](DocumentationAndOverview.pdf)


# Getting started
First [upload your SSH key to gitlab](https://gitlab.fdmci.hva.nl/-/profile/keys) if you haven't done it already.

Clone the repository and switch to the `main` branch

```sh
git clone git@gitlab.fdmci.hva.nl:major-cloud-solutions/2324_sem_2/themisinformationgame-1.git dashboard
cd dashboard
git checkout -M main
```

# Required Accounts and Tools


### Azure Account
- An Azure account is required to use azure resources
- To retrieve the secret key from Azure Key Vault, you need appropriate permissions for the Azure subscription. Please contact Peter Odenhoven to request the necessary access rights
- Without this secret key, you will not be able to run the application.

### Docker Desktop
- Docker Desktop is required to run the MySQL script.
- This script is essential for setting up your local database.

## NodeJS
- Need NodeJS to run legacy app in `frontend_client` folder [Download Here](https://nodejs.org/en/download/prebuilt-installer)

# Installation

## Python Virtual environment
First make a virtual environment in python. You might be ask to install virutal environments first.

```sh
python -m venv venv
```

## Windows
In windows you can activate the virtual environment by running the active script while you are in the `main` directory.

```sh
Venv\Scripts\activate
```


## Install packages
Install the packages with pip

```sh
pip install -r requirements.txt
```

## Quick Start
If you followed the getting started section you can now run the app local.

first run the powershell script for  creating local db

docker needs to be started
```sh
cd scripts
cd local-db
.\mysql-setup.ps1
```
run backend.

you need all dependencies from requirements.txt.
```sh
cd backend
cd app
python main.py --debug
```
run flask app.

you need all dependencies from requirements.txt.
```sh
cd frontend_admin
flask run --debug
```