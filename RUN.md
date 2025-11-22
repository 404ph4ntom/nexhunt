# 🚀 راهنمای سریع اجرای NexHunt

## مرحله ۱: راه‌اندازی دیتابیس (یک از گزینه‌ها)

### گزینه A: با Docker (اگر Docker Desktop نصب است)

```powershell
# 1. Docker Desktop را باز کنید
# 2. چند ثانیه صبر کنید تا راه‌اندازی شود
# 3. سپس اجرا کنید:
cd C:\Users\bughu\Desktop\Cursor\nexhunt
docker-compose up -d postgres redis
```

### گزینه B: بدون Docker (PostgreSQL نصب شده)

اگر PostgreSQL را به صورت محلی نصب کرده‌اید:

```sql
-- در PostgreSQL:
CREATE DATABASE nexhunt;
CREATE USER nexhunt WITH PASSWORD 'nexhunt_dev_password';
GRANT ALL PRIVILEGES ON DATABASE nexhunt TO nexhunt;
```

## مرحله ۲: تنظیم Backend

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt\backend

# نصب dependencies (اگر قبلاً نصب نشده)
npm install

# تولید Prisma Client
npx prisma generate

# ایجاد دیتابیس و جداول
$env:DATABASE_URL="postgresql://nexhunt:nexhunt_dev_password@localhost:5432/nexhunt?schema=public"
npx prisma migrate dev --name init

# راه‌اندازی سرور
npm run start:dev
```

سرور Backend روی **http://localhost:3001** اجرا می‌شود.

## مرحله ۳: تنظیم Frontend (در ترمینال جدید)

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt\frontend

# نصب dependencies
npm install

# راه‌اندازی
npm run dev
```

Frontend روی **http://localhost:3000** اجرا می‌شود.

## ✅ تست کردن

باز کنید:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Swagger Docs**: http://localhost:3001/api/docs

## 🔧 اگر مشکل داشتید

### مشکل: "Can't reach database server"
✅ راه‌حل: PostgreSQL باید روی پورت 5432 در حال اجرا باشد

### مشکل: "Docker daemon not running"  
✅ راه‌حل: Docker Desktop را باز کنید و صبر کنید تا راه‌اندازی شود

### مشکل: Port already in use
✅ راه‌حل: پورت 3000 یا 3001 قبلاً استفاده شده - برنامه دیگر را ببندید

---

**نکته**: Redis و ClamAV اختیاری هستند - پروژه بدون آنها هم کار می‌کند.

