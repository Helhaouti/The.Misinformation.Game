[The Misinformation Game](assets/img/banner.png)
------------------------------------------------------
This is the admin dashboard for the researchers. 
Where they can manage studies and see metric concerning results.  
this application is using the Flask-Framework which is connected with the backend and legacy app

# Getting started
First [upload your SSH key to gitlab](https://gitlab.fdmci.hva.nl/-/profile/keys) if you haven't done it already.

Clone the repository and switch to the `main` branch

```sh
git clone git@gitlab.fdmci.hva.nl:major-cloud-solutions/2324_sem_2/themisinformationgame-1.git dashboard
cd dashboard
git checkout -M main
```


# Installation

## Python Virtual environment 
First make a virtual environment in python. You might be ask to install virtual environments first.

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


you need all dependencies from requirements.txt.
```sh
cd frontend_admin
flask run --debug
```


# i will do this
i will need to put on the steps needed to run this application succesfully
- i need to show how to make it run locally (on laptop)
    - on windows
    - linux

i will talk about .env file that you'll need
i will talk about the fact that you can run it without the configs but itll create an error for the forms
with the secret key (which is any value at all. random strings will suffice) you'll be able to load the page with form. but then you'll still need to fix the api call
for the api call you need the location and such