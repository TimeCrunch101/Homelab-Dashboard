#!/bin/bash
apt update
yes | apt upgrade
yes | apt install mysql-server nodejs npm apache2 git
a2enmod proxy
systemctl restart apache2
a2enmod proxy_http
systemctl restart apache2
cat > /etc/apache2/sites-available/000-default.conf <<- "EOF"
<VirtualHost *:80>
	#ServerName test.com
	ProxyRequests Off
	ProxyPreserveHost On
	ProxyVia Full
   <Proxy *>
      Require all granted
   </Proxy>
   <Location />
      ProxyPass http://127.0.0.1:8080/
      ProxyPassReverse http://127.0.0.1:8080/
   </Location>
	ServerAdmin webmaster@localhost
	DocumentRoot /var/www/html
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF
systemctl restart apache2
mysql <<EOF
CREATE DATABASE  IF NOT EXISTS dashboard /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE dashboard;
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS apps;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE apps (
  app_id int NOT NULL AUTO_INCREMENT,
  hyperlink longtext,
  name longtext,
  hostname varchar(45) DEFAULT NULL,
  ip_addr varchar(45) DEFAULT NULL,
  username longtext,
  password longtext,
  img_path longtext,
  PRIMARY KEY (app_id)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS service_disruptions;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE service_disruptions (
  disID int NOT NULL AUTO_INCREMENT,
  description tinytext NOT NULL,
  PRIMARY KEY (disID)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
EOF
echo
echo ==============================================
echo ============ DATABASE PASSWORD ===============
echo ==============================================
echo
echo "Please choose a secure Database Password."
echo
while true; do
  read -s -p "Password: " dbpass
  echo
  read -s -p "Confirm: " dbpass2
  echo
  [ "$dbpass" = "$dbpass2" ] && break
  echo "The Passwords do not match, please try again"
done
echo
echo
echo "The password has been accepted"
echo
echo
sleep 2
mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by '$dbpass';
flush privileges;
EOF
mkdir /var/www/html/nodejs/
cd /var/www/html/nodejs/
git clone https://github.com/TimeCrunch101/HomeLab-Dashboard.git
cd HomeLab-Dashboard
cat > /var/www/html/nodejs/HomeLab-Dashboard/.env <<EOF
DB_HOST=localhost
DB_USER=root
DB_PASS=$dbpass
DB_NAME=dashboard
PORT=8080
EOF
npm install
npm install pm2 -g
pm2 start app.js
pm2 startup
pm2 save
ufw allow 80/tcp
ufw allow 22/tcp
yes | ufw enable
echo "The server has been set up, enjoy!"