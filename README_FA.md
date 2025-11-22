# NexHunt - پلتفرم باگ بانتی هیبرید

پلتفرم حرفه‌ای باگ بانتی که هم از **Web2** و هم از **Web3** پشتیبانی می‌کند.

## ✨ ویژگی‌ها

- 🎯 **دو نوع برنامه**: Web2 (APIs, وب اپلیکیشن‌ها) و Web3 (Smart Contracts, DeFi)
- 💰 **مدیریت Bounty**: جدول پاداش دینامیک بر اساس شدت
- 📝 **سیستم ارسال**: ارسال آسیب‌پذیری با پیوست فایل
- 🔄 **Workflow Triaging**: ردیابی وضعیت (New → Triaged → Resolved)
- 💳 **پرداخت چندگانه**: PayPal, Wise, بانک، ارز دیجیتال، On-chain
- 🔒 **امنیت اول**: رمزگذاری فایل‌ها، اسکن ویروس، Rate limiting

## 🚀 راه‌اندازی سریع

### 1. Clone کنید

```bash
git clone https://github.com/YOUR_USERNAME/nexhunt.git
cd nexhunt
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# .env را ویرایش کنید
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Deploy به Production

راهنمای کامل در فایل **SETUP_GITHUB.md** است:

- 🎨 **Frontend**: Vercel
- ⚙️ **Backend**: Railway (با PostgreSQL)
- 📚 **API Docs**: خودکار در `/api/docs`

## 📖 مستندات

- **SETUP_GITHUB.md** - راهنمای کامل Deploy
- **DEPLOYMENT.md** - راهنمای Deployment
- **README.md** - مستندات کامل انگلیسی

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: NestJS, PostgreSQL, Prisma
- **Smart Contracts**: Solidity, Hardhat
- **Deploy**: Vercel, Railway

## 📝 License

MIT License

---

**ساخته شده با ❤️ برای جامعه Bug Bounty**

