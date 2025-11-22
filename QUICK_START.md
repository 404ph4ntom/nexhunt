# NexHunt - راهنمای سریع راه‌اندازی

## مشکل Docker در حال اجرا نیست؟

اگر Docker در حال اجرا نیست، دو گزینه دارید:

### گزینه ۱: راه‌اندازی Docker Desktop

1. Docker Desktop را باز کنید و صبر کنید تا کاملاً راه‌اندازی شود
2. سپس دستورات زیر را اجرا کنید:

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt
docker-compose up -d postgres redis
```

### گزینه ۲: راه‌اندازی بدون Docker (PostgreSQL و Redis محلی)

اگر PostgreSQL و Redis را به صورت محلی نصب کرده‌اید:

1. **PostgreSQL** را روی `localhost:5432` راه‌اندازی کنید
2. **Redis** را روی `localhost:6379` راه‌اندازی کنید
3. دیتابیس را ایجاد کنید:
   ```sql
   CREATE DATABASE nexhunt;
   CREATE USER nexhunt WITH PASSWORD 'nexhunt_dev_password';
   GRANT ALL PRIVILEGES ON DATABASE nexhunt TO nexhunt;
   ```

## مراحل راه‌اندازی

### ۱. نصب وابستگی‌های Backend

```powershell
cd backend
npm install
```

### ۲. تنظیم دیتابیس

```powershell
# Generate Prisma Client
npx prisma generate

# Run migrations
$env:DATABASE_URL="postgresql://nexhunt:nexhunt_dev_password@localhost:5432/nexhunt?schema=public"
npx prisma migrate dev --name init
```

### ۳. راه‌اندازی Backend

```powershell
npm run start:dev
```

Backend روی `http://localhost:3001` در دسترس خواهد بود.

### ۴. نصب وابستگی‌های Frontend (در ترمینال جدید)

```powershell
cd frontend
npm install
npm run dev
```

Frontend روی `http://localhost:3000` در دسترس خواهد بود.

## تست کردن

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- Swagger Docs: http://localhost:3001/api/docs

## نکات مهم

- **ClamAV** اختیاری است - اگر در دسترس نباشد، فایل‌ها بدون اسکن ذخیره می‌شوند
- **Redis** اختیاری است - اگر در دسترس نباشد، rate limiting با دیتابیس کار می‌کند
- **S3/R2** اختیاری است - می‌توانید بعداً تنظیم کنید

