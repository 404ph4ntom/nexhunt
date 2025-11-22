# 🚀 راه‌اندازی NexHunt روی Local با XAMPP

## 📋 پیش‌نیازها

### ✅ چیزهایی که نیاز دارید:

1. **XAMPP** (برای PostgreSQL) - یا PostgreSQL جداگانه نصب کنید
2. **Node.js** (نسخه 20+) - برای Backend و Frontend
3. **npm** یا **yarn** - همراه Node.js نصب می‌شود

## 📦 نصب و تنظیم

### مرحله ۱: نصب PostgreSQL

#### گزینه ۱: PostgreSQL جداگانه (پیشنهادی)

1. PostgreSQL را از https://www.postgresql.org/download/windows/ دانلود کنید
2. نصب کنید (پورت 5432)
3. Password برای postgres user را یادداشت کنید

#### گزینه ۲: با XAMPP

XAMPP فقط MySQL و MariaDB دارد. برای PostgreSQL باید جداگانه نصب کنید یا از **pgAdmin** استفاده کنید.

### مرحله ۲: ایجاد Database

```sql
-- در pgAdmin یا psql:
CREATE DATABASE nexhunt;
CREATE USER nexhunt WITH PASSWORD 'nexhunt_dev_password';
GRANT ALL PRIVILEGES ON DATABASE nexhunt TO nexhunt;
```

یا از pgAdmin:
1. pgAdmin را باز کنید
2. روی **Databases** راست کلیک کنید
3. **Create** → **Database**
4. Name: `nexhunt`
5. Owner: `postgres`

### مرحله ۳: تنظیم Backend

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt\backend

# 1. نصب dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. تنظیم .env file
```

فایل `.env` در `backend/` بسازید یا `.env.example` را کپی کنید:

```env
# Server
NODE_ENV=development
PORT=3001
API_PREFIX=/api/v1

# Database - PostgreSQL (با XAMPP یا نصب جداگانه)
DATABASE_URL=postgresql://nexhunt:nexhunt_dev_password@localhost:5432/nexhunt?schema=public

# JWT
JWT_SECRET=nexhunt-dev-secret-key-change-in-production-min-32-chars!!
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=nexhunt-dev-refresh-secret-key-change-in-production!!
JWT_REFRESH_EXPIRES_IN=30d

# Redis (اختیاری - اگر نصب دارید)
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Encryption
ENCRYPTION_KEY=nexhunt-32-character-encryption-key!!!

# File Upload
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,md,png,jpg,jpeg,gif,zip,json,sol,js,ts,html,css

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
SUBMISSION_RATE_LIMIT_TTL=86400
SUBMISSION_RATE_LIMIT_MAX=10
```

```powershell
# 4. Run migrations
npx prisma migrate dev --name init

# 5. راه‌اندازی Backend
npm run start:dev
```

Backend روی **http://localhost:3001** اجرا می‌شود.

### مرحله ۴: تنظیم Frontend

```powershell
# در یک ترمینال جدید:
cd C:\Users\bughu\Desktop\Cursor\nexhunt\frontend

# 1. نصب dependencies
npm install

# 2. تنظیم .env.local
```

فایل `.env.local` در `frontend/` بسازید:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

```powershell
# 3. راه‌اندازی Frontend
npm run dev
```

Frontend روی **http://localhost:3000** اجرا می‌شود.

## 🎯 دسترسی‌ها

✅ **Frontend**: http://localhost:3000  
✅ **Backend API**: http://localhost:3001/api/v1  
✅ **Swagger Docs**: http://localhost:3001/api/docs  
✅ **PostgreSQL**: localhost:5432

## 📝 نکات مهم

### ⚠️ PostgreSQL در XAMPP

XAMPP شامل PostgreSQL **نیست**. باید جداگانه نصب کنید:
- دانلود: https://www.postgresql.org/download/windows/
- یا از **pgAdmin** استفاده کنید

### 🔄 بدون Redis

Redis اختیاری است. اگر نصب ندارید، rate limiting با database کار می‌کند.

### 📦 بدون S3/R2

S3/R2 برای file upload اختیاری است. در development، فایل‌ها metadata-only ذخیره می‌شوند.

## 🚀 اسکریپت سریع راه‌اندازی

اسکریپت `start-local-xampp.ps1` را اجرا کنید که همه کارها را خودکار انجام می‌دهد.

## ✅ تست کردن

1. Frontend را باز کنید: http://localhost:3000
2. Swagger Docs را بررسی کنید: http://localhost:3001/api/docs
3. تست API با Postman یا curl

---

**موفق باشید! 🎉**

