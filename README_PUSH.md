# 🚀 راهنمای سریع Push به GitHub

## ✅ کارهایی که انجام شد:

- ✅ Git repository initialized
- ✅ همه فایل‌ها commit شدند
- ✅ پروژه آماده Push به GitHub

## 📤 Push به GitHub (3 روش)

### روش 1: با اسکریپت خودکار (پیشنهادی)

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt

# اجرای اسکریپت (فقط username لازم است):
.\auto-push-to-github.ps1 -GitHubUsername YOUR_USERNAME

# یا با Token (برای push خودکار):
.\auto-push-to-github.ps1 -GitHubUsername YOUR_USERNAME -GitHubToken YOUR_TOKEN
```

### روش 2: دستی (ساده)

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt

# 1. یک repository در GitHub بسازید: https://github.com/new
#    نام: nexhunt
#    ⚠️ مهم: README/.gitignore اضافه نکنید!

# 2. Remote اضافه کنید:
git remote add origin https://github.com/YOUR_USERNAME/nexhunt.git
git branch -M main

# 3. Push کنید (نیاز به authentication):
git push -u origin main
```

### روش 3: با GitHub Desktop (ساده‌ترین)

1. **GitHub Desktop** را نصب کنید: https://desktop.github.com
2. **File** → **Add Local Repository**
3. پوشه `nexhunt` را انتخاب کنید
4. **Publish repository** کلیک کنید
5. نام repository: `nexhunt`
6. **Publish** کلیک کنید

## 🔐 Authentication (برای روش 1 و 2)

برای push کردن، نیاز به یکی از این‌ها دارید:

### گزینه 1: Personal Access Token (پیشنهادی)

1. به https://github.com/settings/tokens بروید
2. **Generate new token (classic)** کلیک کنید
3. **repo** scope را انتخاب کنید
4. Token را کپی کنید
5. در push، از این token به عنوان password استفاده کنید

### گزینه 2: SSH Key

1. SSH key بسازید: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Public key را به GitHub اضافه کنید: https://github.com/settings/keys
3. Remote را با SSH URL تغییر دهید:
   ```powershell
   git remote set-url origin git@github.com:YOUR_USERNAME/nexhunt.git
   ```

## ✅ بعد از Push

1. **Deploy Frontend** به Vercel: https://vercel.com
2. **Deploy Backend** به Railway: https://railway.app
3. راهنمای کامل: **SETUP_GITHUB.md**

## 📚 فایل‌های راهنما

- **auto-push-to-github.ps1** - اسکریپت خودکار Push
- **SETUP_GITHUB.md** - راهنمای کامل GitHub و Deploy
- **DEPLOYMENT.md** - راهنمای Deployment
- **README.md** - مستندات کامل

---

**موفق باشید! 🎉**

