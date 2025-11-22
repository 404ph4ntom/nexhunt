# 🚀 راهنمای Deploy به GitHub و Vercel

## مرحله ۱: رفع خطاهای پروژه

خطاهای TypeScript را رفع کردیم. حالا پروژه آماده است.

## مرحله ۲: Push به GitHub

```powershell
# 1. Initialize Git (اگر قبلاً نکرده‌اید)
cd C:\Users\bughu\Desktop\Cursor\nexhunt
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: NexHunt Bug Bounty Platform"

# 4. Create repository on GitHub and push
# اول یک repository جدید در GitHub بسازید، سپس:
git remote add origin https://github.com/YOUR_USERNAME/nexhunt.git
git branch -M main
git push -u origin main
```

## مرحله ۳: Deploy Frontend به Vercel

### راه ۱: از طریق Vercel Dashboard

1. به https://vercel.com بروید و Sign in کنید
2. روی "Add New..." کلیک کنید → "Project"
3. Repository خود را import کنید
4. تنظیمات:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### راه ۲: با Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# For production
vercel --prod
```

### Environment Variables در Vercel

در تنظیمات پروژه Vercel، این متغیرها را اضافه کنید:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
```

## مرحله ۴: Deploy Backend

برای Backend، یکی از این گزینه‌ها را انتخاب کنید:

### گزینه ۱: Railway (پیشنهادی)

1. به https://railway.app بروید
2. New Project → Deploy from GitHub repo
3. Repository را انتخاب کنید
4. Root Directory: `backend`
5. Environment Variables را تنظیم کنید (از `.env.example` استفاده کنید)

### گزینه ۲: Render

1. به https://render.com بروید
2. New → Web Service
3. GitHub repo را connect کنید
4. تنظیمات:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

### گزینه ۳: Heroku

```powershell
# Install Heroku CLI
heroku login
heroku create nexhunt-backend

# Set environment variables
heroku config:set DATABASE_URL=your-postgres-url
heroku config:set JWT_SECRET=your-secret

# Deploy
git subtree push --prefix backend heroku main
```

## مرحله ۵: تنظیم Database

برای Production، از یک managed database استفاده کنید:

### گزینه‌ها:
- **Supabase** (رایگان): https://supabase.com
- **Neon** (رایگان): https://neon.tech
- **Railway PostgreSQL**: با Railway project می‌آید
- **Render PostgreSQL**: با Render project می‌آید

بعد از ایجاد database، `DATABASE_URL` را در environment variables قرار دهید.

## مرحله ۶: Deploy Smart Contracts (اختیاری)

```powershell
cd contracts
npm install

# Deploy to testnet
npm run deploy:sepolia

# یا mainnet (با احتیاط!)
npm run deploy:mainnet
```

## ✅ چک‌لیست Deployment

- [ ] کد به GitHub push شد
- [ ] Frontend روی Vercel deployed شد
- [ ] Backend روی Railway/Render deployed شد
- [ ] Database (PostgreSQL) راه‌اندازی شد
- [ ] Environment variables تنظیم شدند
- [ ] Prisma migrations اجرا شدند
- [ ] تست کردید که همه چیز کار می‌کند

## 🔗 لینک‌های مفید

- Vercel: https://vercel.com
- Railway: https://railway.app
- Render: https://render.com
- Supabase: https://supabase.com

---

**نکته**: برای شروع سریع، Railway بهترین انتخاب است چون هم Backend و هم Database را در یک جا دارد!

