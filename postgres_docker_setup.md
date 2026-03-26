# Postgresql for development
TODO: Make this a clearer guide
## Setup
1. Download docker desktop
2. Install the docker CLI tools https://stackoverflow.com/questions/78216201/docker-cli-not-found-after-installing-docker-desktop-on-m1-mac First answer, in advanced toggle system/user install to get prompt that asks for credentials. Go with system.
2. Download latest PostgreSQL 18 image
3. run `docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=test -d postgres`
4. Install psql on local machine (I used brew install postgres)

## Use
1. Run `docker start some-postgres`
2. Run `psql -h localhost -p 5432 -U postgres`