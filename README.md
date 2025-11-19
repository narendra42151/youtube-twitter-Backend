# YOUTWEET Backend

A robust and scalable Node.js backend for a social media platform that combines the best features of YouTube and Twitter. Built with modern technologies and designed for production-ready deployment.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

## 🚀 Features

### Core Functionality
- **User Management**: Complete authentication system with registration, login, profile updates, and secure password management
- **Content Creation**: Support for both text-based tweets and video uploads with rich metadata
- **Engagement System**: Comprehensive like/unlike functionality for tweets, videos, and comments
- **Social Features**: User subscriptions, playlists management, and watch history tracking
- **Media Handling**: Seamless integration with Cloudinary for image and video processing

### Technical Highlights
- **RESTful API Design**: Well-structured endpoints under `/api/v1/` namespace
- **JWT Authentication**: Secure token-based authentication with refresh token support
- **File Upload Support**: Multi-format media upload with cloud storage integration
- **Scalable Architecture**: Designed for horizontal scaling with Docker and Kubernetes
- **Production Ready**: Environment-based configuration and deployment scripts

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Environment**: dotenv for configuration management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **MongoDB** (Atlas cloud instance or local installation)
- **Cloudinary Account** (for media storage and processing)
- **Docker** (optional, for containerization)
- **Kubernetes** (optional, for container orchestration)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/youtweet-backend.git
cd youtweet-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying from the sample:

```bash
cp .env.sample .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/youtweet

# CORS
CORS_ORIGIN=*

# JWT Secrets (Use strong, unique secrets in production)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the Development Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will be running at `http://localhost:8080`

## 📚 API Documentation

### Authentication & User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/users/register` | Register a new user | ❌ |
| `POST` | `/api/v1/users/login` | User login | ❌ |
| `POST` | `/api/v1/users/logout` | User logout | ✅ |
| `GET` | `/api/v1/users/me` | Get current user profile | ✅ |
| `PATCH` | `/api/v1/users/update` | Update user profile | ✅ |
| `PATCH` | `/api/v1/users/change-password` | Change user password | ✅ |
| `GET` | `/api/v1/users/channel/:username` | Get user channel info | ✅ |
| `GET` | `/api/v1/users/watch-history` | Get user watch history | ✅ |

### Tweet Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/tweets` | Create a new tweet | ✅ |
| `GET` | `/api/v1/tweets/user` | Get current user's tweets | ✅ |
| `PATCH` | `/api/v1/tweets/:tweetId` | Update a tweet | ✅ |
| `DELETE` | `/api/v1/tweets/:tweetId` | Delete a tweet | ✅ |

### Video Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/videos` | Upload/publish a video | ✅ |
| `GET` | `/api/v1/videos` | Get all published videos | ❌ |
| `GET` | `/api/v1/videos/:videoId` | Get video by ID | ❌ |
| `PATCH` | `/api/v1/videos/:videoId` | Update video details | ✅ |
| `DELETE` | `/api/v1/videos/:videoId` | Delete a video | ✅ |
| `PATCH` | `/api/v1/videos/toggle-publish/:videoId` | Toggle video publish status | ✅ |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/comments/:videoId` | Add comment to video | ✅ |
| `GET` | `/api/v1/comments/:videoId` | Get video comments | ❌ |
| `PATCH` | `/api/v1/comments/c/:commentId` | Update a comment | ✅ |
| `DELETE` | `/api/v1/comments/c/:commentId` | Delete a comment | ✅ |

### Likes & Engagement

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/likes/toggle/t/:tweetId` | Toggle like on tweet | ✅ |
| `POST` | `/api/v1/likes/toggle/v/:videoId` | Toggle like on video | ✅ |
| `POST` | `/api/v1/likes/toggle/c/:commentId` | Toggle like on comment | ✅ |
| `GET` | `/api/v1/likes/videos` | Get user's liked videos | ✅ |

### Subscriptions & Playlists

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/subscriptions/toggle/:channelId` | Toggle subscription to channel | ✅ |
| `GET` | `/api/v1/subscriptions/subscribed` | Get subscribed channels | ✅ |
| `POST` | `/api/v1/playlists` | Create a new playlist | ✅ |
| `GET` | `/api/v1/playlists/user/:userId` | Get user playlists | ✅ |
| `PATCH` | `/api/v1/playlists/:playlistId` | Update playlist | ✅ |
| `DELETE` | `/api/v1/playlists/:playlistId` | Delete playlist | ✅ |

## 🐳 Docker Deployment

### Building the Docker Image

```bash
# Build the Docker image
docker build -t yourusername/youtweet-backend:latest .

# Run the container locally
docker run -p 8080:8080 --env-file .env yourusername/youtweet-backend:latest
```

### Docker Compose (Recommended for Development)

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mongodb
      
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

```bash
# Start all services
docker-compose up -d
```

## ☸️ Kubernetes Deployment

### 1. Push Image to Registry

```bash
# Push to Docker Hub
docker push yourusername/youtweet-backend:latest
```

### 2. Apply Kubernetes Manifests

```bash
# Apply deployment and service
kubectl apply -f k8s/

# Port forward for local access
kubectl port-forward service/youtweet-service 8080:8080
```

### Sample Kubernetes Configuration

```yaml
# youtweet-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: youtweet-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: youtweet-backend
  template:
    metadata:
      labels:
        app: youtweet-backend
    spec:
      containers:
      - name: youtweet-backend
        image: yourusername/youtweet-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "8080"
---
apiVersion: v1
kind: Service
metadata:
  name: youtweet-service
spec:
  selector:
    app: youtweet-backend
  ports:
  - port: 8080
    targetPort: 8080
  type: LoadBalancer
```

## 🌐 Cloud Deployment Options

### Platform-as-a-Service (PaaS)

| Platform | Deployment Command | Notes |
|----------|-------------------|-------|
| **Railway** | Connect GitHub repo, set env vars | Auto-deploys on push |
| **Heroku** | `git push heroku main` | Requires Procfile |
| **Render** | Connect GitHub repo | Free tier available |
| **Vercel** | `vercel --prod` | Serverless functions |

### Infrastructure-as-a-Service (IaaS)

- **AWS**: Deploy using ECS, EKS, or Elastic Beanstalk
- **Google Cloud**: Use Cloud Run, GKE, or App Engine  
- **Microsoft Azure**: Deploy with Container Instances or AKS
- **DigitalOcean**: Use App Platform or Kubernetes

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
youtweet-backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── app.js          # Express app configuration
├── public/             # Static files
├── tests/              # Test files
├── k8s/               # Kubernetes manifests
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose setup
├── .env.sample        # Environment variables template
└── README.md          # Project documentation
```


## 👥 Authors

- **Narendra Deshmukh** 



