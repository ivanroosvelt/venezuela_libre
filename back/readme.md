MySql docker:
docker run --name temp_mysql -e MYSQL_ROOT_PASSWORD=123123 -e MYSQL_USER=user -e MYSQL_PASSWORD=123123 -e MYSQL_DATABASE=dev -p 3306:3306 -d mysql:tag
