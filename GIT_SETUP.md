# 🚀 راهنمای Push به GitHub و Deploy به Vercel

## ✅ خطاها رفع شدند!

فایل `files.service.ts` اصلاح شد و پروژه آماده است.

## 📋 مراحل Push به GitHub

### مرحله ۱: Initialize Git

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt
git init
git add .
git commit -m "Initial commit: NexHunt Bug Bounty Platform"
```

### مرحله ۲: ایجاد Repository در GitHub

1. به https://github.com/new بروید
2. نام Repository: `nexhunt`
3. Public یا Private انتخاب کنید
4. **توجه**: README یا .gitignore اضافه نکنید (ما داریم)
5. **Create repository** کلیک کنید

### مرحله ۳: Push به GitHub

```powershell
# YOUR_USERNAME را با نام کاربری GitHub خود جایگزین کنید
git remote add origin https://github.com/YOUR_USERNAME/nexhunt.git
git branch -M main
git push -u origin main
```

## 🎨 Deploy Frontend به Vercel

### گزینه ۱: از Dashboard (ساده‌تر)

1. به https://vercel.com بروید و Login کنید
2. **Add New...** → **Project**
3. Repository شما را انتخاب کنید
4. **Project Settings**:
   - **Root Directory**: `frontend` (تغییر دهید!)
   - **Framework Preset**: Next.js (خودکار)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Environment Variables** اضافه کنید:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
   ```
   (بعداً بعد از deploy backend، این URL را تغییر دهید)

6. **Deploy** کلیک کنید

### گزینه ۲: با Vercel CLI

```powershell
npm install -g vercel
cd frontend
vercel login
vercel
vercel --prod  # برای production
```

## ⚙️ Deploy Backend به Railway

1. به https://railway.app بروید
2. **New Project** → **Deploy from GitHub repo**
3. Repository را انتخاب کنید
4. **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm run start:prod`

5. **Add PostgreSQL**:
   - **New** → **Database** → **Add PostgreSQL**

6. **Environment Variables** (در Railway Settings):
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters!!
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters!!
   JWT_REFRESH_EXPIRES_IN=30d
   FRONTEND_URL=https://your-app.vercel.app
   ENCRYPTION_KEY=your-32-character-encryption-key!!!!
   ```

7. **Run Migrations**:
   - در Railway، **View Logs** یا **Shell** باز کنید
   - دستورات:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

8. **Get Backend URL**:
   - Railway Settings → **Networking** → **Generate Domain**
   - URL را کپی کنید

9. **Update Frontend Environment Variable**:
   - در Vercel → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` را به Railway URL تغییر دهید
   - Redeploy کنید

## ✅ تست کردن

- ✅ Frontend: https://your-app.vercel.app
- ✅ Backend: https://your-backend.railway.app/api/v1
- ✅ API Docs: https://your-backend.railway.app/api/docs

## 📚 مستندات بیشتر

- **SETUP_GITHUB.md** - راهنمای کامل
- **DEPLOYMENT.md** - راهنمای Deployment
- **README.md** - مستندات کامل

---

**موفق باشید! 🎉**

