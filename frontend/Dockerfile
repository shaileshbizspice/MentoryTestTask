FROM node:20

WORKDIR /app

COPY . .

# Install dependencies
RUN npm install

# Expose Remix port and start the app
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--port", "3100", "--host", "0.0.0.0"]
