# Optional: Clean up any previous Docker containers, volumes, etc.
echo "Cleaning up any previous Docker setup..."
docker-compose down --volumes
docker system prune -f -a --volumes

# Define main project directory
PROJECT_DIR="Mentory"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

echo "Setting up Laravel backend..."

# Create Laravel backend directory
LARAVEL_DIR="backend"
mkdir -p $LARAVEL_DIR
cd $LARAVEL_DIR

# Remove any existing files in the backend directory to avoid conflicts
rm -rf ./*

# Check if Laravel is already installed (i.e., check for vendor directory)
if [ ! -d "vendor" ]; then
  echo "Creating Laravel project..."
  # Run composer to create the Laravel project locally
  composer create-project --prefer-dist laravel/laravel .
else
  echo "Laravel project already exists."
fi

# Create Dockerfile for Laravel
cat <<EOL > Dockerfile
FROM php:8.1-apache

# Install system dependencies and Composer
RUN apt-get update && apt-get install -y libpq-dev unzip curl git \
    && docker-php-ext-install pdo pdo_pgsql \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy Laravel project files from the current directory into the container
COPY . /var/www/html

# Install Laravel dependencies
RUN composer install

# Set proper permissions for Laravel directories
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html/storage && chmod -R 755 /var/www/html/bootstrap/cache

# Create .htaccess file for routing to the public directory
RUN echo '<IfModule mod_rewrite.c> \n\
    RewriteEngine On \n\
    RewriteRule ^(.*)$ public/\$1 [L] \n\
</IfModule>' > /var/www/html/.htaccess

# Expose Apache port
EXPOSE 80
EOL

# Move back to the project root to set up frontend
cd ..

echo "Setting up Remix frontend..."

# Create Remix frontend directory
FRONTEND_DIR="frontend"
mkdir -p $FRONTEND_DIR
cd $FRONTEND_DIR

# Remove any existing files in the frontend directory
rm -rf ./*

# Create a Remix project locally to avoid Docker build issues
npx create-remix@latest --yes .

# Create Dockerfile for Remix with Node 20 to avoid engine compatibility issues
cat <<EOL > Dockerfile
FROM node:20

WORKDIR /app

COPY . .

# Install dependencies
RUN npm install

# Expose Remix port and start the app
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--port", "3100", "--host", "0.0.0.0"]
EOL

# Move back to project root to create docker-compose file
cd ..

echo "Creating Docker Compose configuration..."

# Create docker-compose.yml
cat <<EOL > docker-compose.yml
version: "3.8"

services:
  laravel:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: laravel_app
    ports:
      - "8000:80"
    depends_on:
      - postgres_db
    networks:
      - task_network
    environment:
      APP_ENV: local
      APP_DEBUG: "true"
      DB_CONNECTION: pgsql
      DB_HOST: postgres_db
      DB_PORT: 5432
      DB_DATABASE: mentory
      DB_USERNAME: root
      DB_PASSWORD: root
    volumes:
      - ./backend:/var/www/html

  remix:
    build:
      context: ./frontend
    container_name: remix_app
    ports:
      - "3100:3100"
    volumes:
      - ./frontend:/app:cached
    networks:
      - task_network

  postgres_db:
    image: postgres:latest
    container_name: postgres_db
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: mentory
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - task_network

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres_db
    networks:
      - task_network
networks:
  task_network:
    driver: bridge

volumes:
  postgres_data:

EOL

echo "Building and starting Docker containers..."

# Run Docker Compose build and start
docker-compose up --build -d

# Wait for Laravel container to be ready before running migrations
echo "Waiting for Laravel container to be ready..."
sleep 10  # Give it a few seconds to start up

# Run Laravel migrations if the container is running
if [ "$(docker ps -q -f name=laravel_app)" ]; then
  echo "Running Laravel migrations..."
  docker exec -it laravel_app bash -c "php artisan migrate"
  echo "Laravel migrations completed."
else
  echo "Laravel container is not running. Please check for errors."
fi

echo "Setup complete!"
echo "Laravel app is running at http://localhost:8000"
echo "Remix app is running at http://localhost:3100"
