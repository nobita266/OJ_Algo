FROM node:18-alpine
WORKDIR /app
ENV MONGO_URL='mongodb+srv://admin:admin%40123@cluster0.c5gfubm.mongodb.net/?retryWrites=true&w=majority'
ENV mongo_username='admin'
ENV mongo_password='admin@123'
ENV PORT='8000'
ENV SECRET_KEY='SECRET_KEY'
RUN apk update && apk add --no-cache g++ 
COPY package*.json .
RUN npm install
copy . .
EXPOSE 8000
CMD ["node","index.js"]



