## planetscale 
you can visit planetscale.com to create a free, serverless database

## prisma
prisma is a npm package that provide you ORM ability to communicate with database.

## create local postgresql development
1. download postgresql docker image 
2. run `docker run --name myposgres -p 5432:5432 -e POSTGRES_PASSWORD=121 -d postgres`
3. log in container `docker exec -it myposgres bash`
4. log in postgresql `psql -U postgres`
5. now, you're in postgresql interactive shell
6. create a new user `create user zhangzhuang with password '111';`
7. create a new database `create database zhangzhuangdatabase;`