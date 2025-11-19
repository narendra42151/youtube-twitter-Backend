# YOUTWEET Backend

YOUTWEET is a production-ready Node.js API that blends short-form tweets and rich video content. The service exposes RESTful endpoints for user management, content creation, engagement, and subscriptions while integrating with MongoDB and Cloudinary. The repository ships with a Docker-based workflow so the backend can be developed locally, containerised, and published to Docker Hub or Kubernetes-ready infrastructure.

---

## Key Features

- User authentication with access and refresh tokens
- Tweets, videos, comments, and playlist management endpoints
- Likes and subscriptions for engagement workflows
- Cloudinary-backed media uploads via Multer
- Centralised error handling, async utilities, and modular routing
- Dockerfile and Docker Compose for repeatable deployments

---

## Tech Stack

- Runtime: Node.js 20 (ES modules)
- Framework: Express.js
- Database: MongoDB (Mongoose ODM)
- Auth: JSON Web Tokens (JWT)
- File Storage: Cloudinary
- Containerisation: Docker, Docker Compose

---

## Project Structure

```
YOUTWEET/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .env.sample
├── src/
│   ├── app.js
│   ├── index.js
│   ├── constants.js
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
├── public/
│   └── temp/
└── youtweet-deployment.yaml
```

---

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas cluster or self-hosted MongoDB instance
- Cloudinary account (API key/secret)
- Docker Desktop (optional but recommended)

---

## Environment Variables

Copy `.env.sample` to `.env` and fill in values. The backend expects the following keys:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (defaults to 8080) |
| `MONGODB_URL` | Connection string without the database name |
| `CORS_ORIGIN` | Allowed origin(s) for CORS |
| `ACCESS_TOKEN_SECRET` | JWT signing key for access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime (e.g. `1d`) |
| `REFRESH_TOKEN_SECRET` | JWT signing key for refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime (e.g. `10d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

> Keep secrets out of version control. Use `.env` locally and environment variables in production.

---

## Local Development

```bash
git clone https://github.com/narendra42151/youtube-twitter-Backend.git
cd youtube-twitter-Backend
npm install
cp .env.sample .env   # update with real values
npm run dev           # nodemon with dotenv support
```

The API boots on `http://localhost:8080` by default. Update `src/routes/` to review the available endpoints.

### npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server with Nodemon |
| `npm start` | Start production server (`node src/index.js`) |

---

## API Overview

All routes are namespaced under `/api/v1`. Authentication uses JWT access tokens delivered via cookies.

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/register` | Register a new account |
| POST | `/api/v1/users/login` | Authenticate and receive tokens |
| POST | `/api/v1/users/logout` | Invalidate refresh token |
| GET | `/api/v1/users/me` | Current user profile |
| PATCH | `/api/v1/users/update` | Update profile details |
| PATCH | `/api/v1/users/change-password` | Change password |
| GET | `/api/v1/users/watch-history` | Fetch watch history |

### Tweets & Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tweets` | Create tweet |
| GET | `/api/v1/tweets/user` | Tweets for authenticated user |
| PATCH | `/api/v1/tweets/:tweetId` | Update tweet |
| DELETE | `/api/v1/tweets/:tweetId` | Delete tweet |
| POST | `/api/v1/videos` | Upload video |
| GET | `/api/v1/videos` | List published videos |
| GET | `/api/v1/videos/:videoId` | Retrieve video |
| PATCH | `/api/v1/videos/:videoId` | Update video metadata |
| PATCH | `/api/v1/videos/toggle-publish/:videoId` | Toggle publish state |

### Comments, Likes, Playlists

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/comments/:videoId` | Add comment to video |
| GET | `/api/v1/comments/:videoId` | List comments |
| PATCH | `/api/v1/comments/c/:commentId` | Update comment |
| DELETE | `/api/v1/comments/c/:commentId` | Remove comment |
| POST | `/api/v1/likes/toggle/{t|v|c}/:id` | Toggle like on tweet/video/comment |
| GET | `/api/v1/likes/videos` | Liked videos for user |
| POST | `/api/v1/playlists` | Create playlist |
| PATCH | `/api/v1/playlists/:playlistId` | Update playlist |
| DELETE | `/api/v1/playlists/:playlistId` | Delete playlist |

Explore controller files in `src/controllers/` for full behaviour and response shapes.

---

## Docker Workflow

### Build and Run Locally

```bash
# from repo root
docker build -t youtweet:latest .
docker run --rm -p 8080:8080 --env-file .env -e CORS_ORIGIN=* youtweet:latest
```

### Publish to Docker Hub

```bash
# tag and push (replace with your username)
docker tag youtweet:latest narendra42151/youtweet:latest
docker push narendra42151/youtweet:latest
```

### Pull and Run from Docker Hub

```bash
docker pull narendra42151/youtweet:latest
docker run -d --name youtweet_app --env-file .env -p 8080:8080 narendra42151/youtweet:latest
docker logs -f youtweet_app
```

### Docker Compose

The repository includes `docker-compose.yml` for single-command runs:

```bash
docker compose up -d --build   # build image and start container
docker compose logs -f app     # follow logs
docker compose down            # stop and remove resources
```

Compose uses the published image by default but will rebuild from the local Dockerfile when `--build` is supplied.

---

## Kubernetes (Optional)

`youtweet-deployment.yaml` provides a baseline Deployment and Service manifest. Apply it to a cluster after pushing the image:

```bash
kubectl apply -f youtweet-deployment.yaml
kubectl get pods
kubectl port-forward svc/youtweet-service 8080:8080
```

Review and adapt replica counts, resource limits, and secrets before deploying to production.

---

## Troubleshooting

- **MongoDB connection fails**: verify `MONGODB_URL`, network access, and IP allow list in Atlas.
- **CORS blocked**: ensure `CORS_ORIGIN` matches the frontend origin or use `*` for testing.
- **Cloudinary upload errors**: confirm API credentials and allowed media types.
- **Docker networking**: expose port 8080 and ensure environment file is mounted without Windows line endings.

---

## Author

- Narendra Deshmukh



