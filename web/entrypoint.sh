#!/bin/sh
# Replace env vars in index.html
envsubst < /var/www/html/index.html > /var/www/html/index.tmp
mv /var/www/html/index.tmp /var/www/html/index.html

# Start Lighttpd
exec lighttpd -D -f /etc/lighttpd/lighttpd.conf
