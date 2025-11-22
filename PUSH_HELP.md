# 🔧 راه‌حل مشکل Push به GitHub

## مشکل فعلی:

خطای 403 - Permission denied. این یعنی token مشکل دارد یا scope کافی ندارد.

## راه‌حل‌ها:

### روش 1: استفاده از GitHub Desktop (ساده‌ترین)

1. **GitHub Desktop** را دانلود کنید: https://desktop.github.com
2. نصب و Login کنید
3. **File** → **Add Local Repository**
4. پوشه `C:\Users\bughu\Desktop\Cursor\nexhunt` را انتخاب کنید
5. **Publish repository** کلیک کنید
6. **Publish** کلیک کنید

✅ این کار خودکار همه چیز را انجام می‌دهد!

### روش 2: Token جدید بسازید

Token فعلی ممکن است منقضی شده یا scope کافی نداشته باشد.

1. به https://github.com/settings/tokens بروید
2. **Generate new token (classic)** کلیک کنید
3. **Name**: `nexhunt-push`
4. **Expiration**: `90 days` یا `No expiration`
5. **Scopes**: ✅ حتماً این موارد را انتخاب کنید:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
6. **Generate token** کلیک کنید
7. Token را کپی کنید (فقط یک بار نمایش می‌شود!)
8. سپس دستورات زیر را اجرا کنید:

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt

# Remote را با token جدید تنظیم کنید:
$token = "YOUR_NEW_TOKEN_HERE"
$username = "404ph4ntom"
git remote remove origin
git remote add origin "https://${username}:${token}@github.com/${username}/nexhunt.git"
git push -u origin main
```

### روش 3: استفاده از SSH

اگر SSH key دارید:

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt
git remote remove origin
git remote add origin git@github.com:404ph4ntom/nexhunt.git
git push -u origin main
```

### روش 4: Push دستی از Terminal

اگر credential helper تنظیم شده:

```powershell
cd C:\Users\bughu\Desktop\Cursor\nexhunt
git push -u origin main
```

وقتی password خواست:
- Username: `404ph4ntom`
- Password: token خود را وارد کنید

---

**پیشنهاد**: از **GitHub Desktop** استفاده کنید - ساده‌ترین راه است! 🚀


