# 🌿 MalnadXplore — Western Ghats Expedition Platform
## Complete MERN Stack Setup & Deployment Guide
## Complete MERN Stack Setup & Deployment Guide

---

## 📁 Project Structure

```
travel-app/
├── frontend/                 ← React.js app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Hero/
│   │   │   ├── TripCard/
│   │   │   └── Footer/
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── TripsPage.js
│   │   │   ├── TripDetailPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── ChatPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.js
│   │   │       ├── AdminTrips.js
│   │   │       └── AdminUsers.js
│   │   ├── context/AuthContext.js
│   │   ├── services/api.js
│   │   ├── index.css
│   │   └── App.js
│   └── package.json
│
└── backend/                  ← Node.js + Express API
    ├── models/
    │   ├── User.js
    │   └── Trip.js
    ├── routes/
    │   ├── auth.js
    │   ├── trips.js
    │   ├── users.js
    │   └── bookings.js
    ├── middleware/
    │   ├── auth.js
    │   └── upload.js
    ├── uploads/              ← auto-created
    ├── server.js
    ├── seed.js
    └── package.json
```

---

## 🚀 LOCAL SETUP (Step by Step)

### Step 1: MongoDB Atlas Setup (Free)

1. Go to **https://mongodb.com/atlas** → Sign up
2. Create a **Free Cluster** (M0)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string (looks like):
   `mongodb+srv://user:password@cluster0.abc123.mongodb.net/`
5. Database Access → Create user with password
6. Network Access → Add IP → **"Allow Access from Anywhere"** (0.0.0.0/0)

### Step 2: Backend Setup

```bash
cd travel-app/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and a strong JWT_SECRET

# Create uploads folder
mkdir uploads

# Seed the database with sample data
npm run seed
```

### Step 3: Frontend Setup

```bash
cd travel-app/frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "REACT_APP_SOCKET_URL=http://localhost:5000" >> .env
```

### Step 4: Run Both Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App opens on http://localhost:3000
```

### ✅ Test Credentials (after seeding)
| Role  | Email            | Password |
|-------|------------------|----------|
| Admin | admin@demo.com   | admin123 |
| User  | user@demo.com    | demo123  |

---

## ☁️ DEPLOYMENT

### Option A: Render (Backend) + Vercel (Frontend) — FREE

#### Deploy Backend to Render

1. Push your code to **GitHub**
2. Go to **https://render.com** → New → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
5. Add Environment Variables:
   ```
   MONGO_URI = your_mongodb_atlas_uri
   JWT_SECRET = your_secret_key_here
   NODE_ENV = production
   CLIENT_URL = https://your-app.vercel.app
   PORT = 10000
   ```
6. Deploy → Wait ~3 min → Copy the URL (e.g. `https://malnadxplore-api.onrender.com`)

#### Deploy Frontend to Vercel

```bash
cd frontend
npm run build

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

When prompted, set environment variables:
```
REACT_APP_API_URL = https://malnadxplore-api.onrender.com/api
REACT_APP_SOCKET_URL = https://malnadxplore-api.onrender.com
```

Or go to **https://vercel.com** → Import GitHub repo → Set env vars in dashboard.

---

### Option B: Full Stack on Railway — FREE

1. Go to **https://railway.app**
2. New Project → Deploy from GitHub
3. Add two services:
   - **Backend service:** Root = `backend`, Start = `node server.js`
   - **Frontend service:** Root = `frontend`, Build = `npm run build`
4. Add env vars to each service
5. Railway auto-generates URLs

---

### Option C: VPS (DigitalOcean/AWS EC2) — PAID

```bash
# On your server (Ubuntu 22.04)

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone your repo
git clone https://github.com/yourusername/malnadxplore.git
cd malnadxplore

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run seed
pm2 start server.js --name "malnadxplore-api"

# Frontend
cd ../frontend
npm install
npm run build
# Serve with nginx (see below)

# Install Nginx
sudo apt install nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/malnadxplore
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (React build)
    location / {
        root /var/www/malnadxplore/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Uploaded files
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/malnadxplore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 📡 API Reference

### Auth Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login, returns JWT |
| GET | /api/auth/profile | ✅ | Get own profile |
| PUT | /api/auth/profile | ✅ | Update profile |

### Trip Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/trips | ❌ | List trips (with filters) |
| GET | /api/trips/:id | ❌ | Get trip detail |
| POST | /api/trips | 👑 Admin | Create trip |
| PUT | /api/trips/:id | 👑 Admin | Update trip |
| DELETE | /api/trips/:id | 👑 Admin | Delete trip |
| POST | /api/trips/:id/join | ✅ | Join trip |
| POST | /api/trips/:id/leave | ✅ | Leave trip |
| GET | /api/trips/:id/travelers | ✅ | Get travelers |

### User Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users | 👑 Admin | All users |
| DELETE | /api/users/:id | 👑 Admin | Delete user |
| PUT | /api/users/:id/role | 👑 Admin | Change role |

### Booking Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/bookings/my | ✅ | My bookings |
| GET | /api/bookings/all | 👑 Admin | All bookings |

---

## 🎨 UI Features

- ✅ 3D Glassmorphism design system
- ✅ Animated Hero section with floating cards
- ✅ Trip cards with 3D hover + progress bars
- ✅ Real-time chat (Socket.io)
- ✅ Admin dashboard with stats
- ✅ Create/Edit trips with image + PDF upload
- ✅ Day-wise itinerary builder
- ✅ Booking modal with traveler form
- ✅ User dashboard with joined trips
- ✅ Fully responsive (mobile + tablet + desktop)
- ✅ JWT protected routes
- ✅ Toast notifications

---

## 🔐 Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens (30-day expiry)
- Role-based access (user vs admin)
- Input validation with express-validator
- File type validation (images + PDF only)
- File size limits (10MB)
- CORS configured

---

## 📱 Making it a Mobile App (Optional)

```bash
# Using Capacitor (recommended — reuses your React code)
cd frontend
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "MalnadXplore" "com.malnadxplore.app"
npm run build
npx cap add android
npx cap sync
npx cap open android
# Build APK in Android Studio
```

---

## 🧪 Testing the App

```bash
# Test backend API with curl
curl http://localhost:5000/api/health
curl http://localhost:5000/api/trips
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| MongoDB connection failed | Check MONGO_URI, whitelist IP in Atlas |
| Images not loading | Check uploads/ folder exists, check REACT_APP_API_URL |
| CORS error | Set CLIENT_URL in backend .env |
| Socket.io not connecting | Check REACT_APP_SOCKET_URL |
| JWT expired error | User will be auto-redirected to login |
| Port 5000 in use | Change PORT in .env |

---

*Built with ❤️ using MERN Stack — MongoDB, Express, React, Node.js*
