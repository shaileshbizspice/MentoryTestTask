# Update Dockerfile for Laravel
FROM php:8.1-apache

# Install system dependencies and Composer
RUN apt-get update && apt-get install -y libpq-dev unzip curl git \
    && docker-php-ext-install pdo pdo_pgsql \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the correct working directory for Laravel
WORKDIR /var/www/html

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy all backend files to the correct document root
COPY . /var/www/html

# Install Laravel dependencies
RUN composer install

# Set proper permissions for Laravel directories
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html/storage && chmod -R 755 /var/www/html/bootstrap/cache

# Expose Apache port
EXPOSE 80
