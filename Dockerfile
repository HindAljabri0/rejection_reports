FROM nginx:1.17.1-alpine
COPY /src/.s2i/nginx.conf /etc/nginx/nginx.conf
COPY /dist/waseele-gui /usr/share/nginx/html
