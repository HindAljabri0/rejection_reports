FROM centos/nginx-112-centos7:latest
COPY /src/.s2i/nginx.conf /etc/nginx/nginx.conf
COPY /dist/waseele-gui /usr/share/nginx/html
