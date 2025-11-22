# 🚀 راهنمای کامل Deploy به GitHub و Vercel

## مرحله ۱: Initialize Git و Push به GitHub

```powershell
# در پوشه nexhunt
cd C:\Users\bughu\Desktop\Cursor\nexhunt

# Initialize Git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: NexHunt Bug Bounty Platform - Complete Production Ready"

# ایجاد Repository در GitHub:
# 1. به https://github.com/new بروید
# 2. نام Repository: nexhunt
# 3. Public یا Private انتخاب کنید
# 4. Create repository کلیک کنید

# بعد از ایجاد repository، این دستورات را اجرا کنید:
# (YOUR_USERNAME را با نام کاربری GitHub خود جایگزین کنید)
git remote add origin https://github.com/YOUR_USERNAME/nexhunt.git
git branch -M main
git push -u origin main
```

## مرحله ۲: Deploy Frontend به Vercel

### گزینه ۱: از طریق Dashboard (ساده‌تر)

1. **وارد Vercel شوید**: https://vercel.com
2. **New Project** کلیک کنید
3. **Import Git Repository** → repository شما را انتخاب کنید
4. **Project Settings**:
   - **Root Directory**: `frontend` (تغییر دهید)
   - **Framework Preset**: Next.js (خودکار تشخیص می‌دهد)
   - **Build Command**: `npm run build` (پیش‌فرض)
   - **Output Directory**: `.next` (پیش‌فرض)

5. **Environment Variables** اضافه کنید:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api/v1
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-id
   ```

6. **Deploy** کلیک کنید

### گزینه ۲: با Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Go to frontend directory
cd frontend

# Deploy (اولین بار)
vercel

# Production deploy
vercel --prod
```

## مرحله ۳: Deploy Backend به Railway (پیشنهادی)

Railway بهترین گزینه است چون:
- ✅ PostgreSQL رایگان دارد
- ✅ Auto-deploy از GitHub
- ✅ Environment variables آسان
- ✅ Free tier خوب

### مراحل:

1. **وارد Railway شوید**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Repository خود را انتخاب کنید
4. **Add Service** → **Empty Service**
5. **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm run start:prod`

6. **Environment Variables** (از `.env.example` استفاده کنید):
   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_REFRESH_EXPIRES_IN=30d
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ENCRYPTION_KEY=your-32-character-encryption-key
   ```

7. **Add PostgreSQL**:
   - روی **New** کلیک کنید
   - **Database** → **Add PostgreSQL**
   - DATABASE_URL خودکار تنظیم می‌شود

8. **Run Prisma Migrations**:
   - در Railway، یک terminal باز کنید
   - دستورات زیر را اجرا کنید:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```

9. **Get Backend URL**:
   - در Railway Settings → **Networking**
   - **Generate Domain** کلیک کنید
   - URL را کپی کنید (مثلاً: `nexhunt-backend.railway.app`)

10. **Update Frontend Environment Variable**:
    - در Vercel → Settings → Environment Variables
    - `NEXT_PUBLIC_API_URL` را به: `https://nexhunt-backend.railway.app/api/v1` تغییر دهید
    - Redeploy کنید

## مرحله ۴: تست کردن

✅ **Frontend**: https://your-app.vercel.app
✅ **Backend API**: https://your-backend.railway.app/api/v1
✅ **Swagger Docs**: https://your-backend.railway.app/api/docs

## نکات مهم

### 🔒 Security
- JWT_SECRET باید یک string تصادفی و طولانی باشد
- ENCRYPTION_KEY باید دقیقاً 32 کاراکتر باشد
- هیچوقت secrets را در کد commit نکنید

### 🗄️ Database
- Railway PostgreSQL خودکار backup می‌گیرد
- برای production بهتر است از managed database استفاده کنید

### 📦 File Storage
- S3/R2 را بعداً می‌توانید تنظیم کنید
- فعلاً بدون file upload هم کار می‌کند

### 🚀 Auto Deploy
- هر push به `main` branch خودکار deploy می‌شود
- برای disable کردن، در Railway/Vercel settings تغییر دهید

## 🔗 لینک‌های مفید

- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard
- **GitHub**: https://github.com/YOUR_USERNAME/nexhunt

---

**موفق باشید! 🎉**

اگر مشکلی داشتید، در GitHub Issues مطرح کنید.

