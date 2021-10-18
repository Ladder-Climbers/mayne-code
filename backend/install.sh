sudo cp ./mayne.nginx /etc/nginx/sites-available/mayne
cd /etc/nginx/sites-enabled/
sudo ln -s ../sites-available/mayne mayne
sudo systemctl restart nginx.service
