FROM nginx:1.17.1-alpine
COPY /src/.s2i/nginx-k8s.conf /etc/nginx/nginx.conf
COPY /dist/waseele-gui /usr/share/nginx/html
