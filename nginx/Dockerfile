FROM nginx:latest

# Xóa cấu hình mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Sao chép cấu hình Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Tạo thư mục cần thiết
RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# Sao chép cấu hình site
COPY sites-available/ecologicaldesign.tech /etc/nginx/sites-available/

# Tạo symbolic link từ sites-available sang sites-enabled
RUN ln -s /etc/nginx/sites-available/ecologicaldesign.tech /etc/nginx/sites-enabled/

# Tạo thư mục log
RUN mkdir -p /var/log/nginx

# Expose ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
