# 📦 راهنمای نصب PostgreSQL برای NexHunt

## ⚠️ نکته مهم

**XAMPP شامل PostgreSQL نیست!** XAMPP فقط شامل:
- Apache (وب سرور)
- MySQL/MariaDB (دیتابیس)
- PHP
- phpMyAdmin

برای NexHunt نیاز به **PostgreSQL** داریم که باید جداگانه نصب شود.

## 🚀 روش نصب PostgreSQL

### مرحله 1: دانلود

1. به https://www.postgresql.org/download/windows/ بروید
2. روی **Download the installer** کلیک کنید
3. آخرین نسخه را دانلود کنید (PostgreSQL 16)

### مرحله 2: نصب

1. فایل دانلود شده را اجرا کنید
2. **Next** → **Next**
3. **Installation Directory**: پیش‌فرض بماند (`C:\Program Files\PostgreSQL\16`)
4. **Select Components**: همه را انتخاب کنید (پیش‌فرض)
5. **Data Directory**: پیش‌فرض بماند
6. **Password**: یک رمز قوی برای `postgres` user انتخاب کنید (مثلاً: `postgres123`)
   ⚠️ **مهم**: این رمز را یادداشت کنید!
7. **Port**: `5432` (پیش‌فرض)
8. **Advanced Options**: پیش‌فرض بماند
9. **Pre Installation Summary**: **Next**
10. **Ready to Install**: **Next**
11. صبر کنید تا نصب تمام شود
12. **Stack Builder را نصب نکنید** - فقط **Finish** کلیک کنید

### مرحله 3: بررسی نصب

1. **pgAdmin 4** را از Start Menu باز کنید
2. اگر اولین بار است، Master Password تنظیم کنید
3. PostgreSQL Server باید در لیست باشد
4. برای اتصال: راست کلیک → **Connect Server** → رمز `postgres` را وارد کنید

### مرحله 4: ایجاد Database

#### روش 1: از pgAdmin

1. pgAdmin 4 را باز کنید
2. **Servers** → **PostgreSQL 16** → **Databases** راست کلیک
3. **Create** → **Database...**
4. **Database**: `nexhunt`
5. **Owner**: `postgres`
6. **Save**

#### روش 2: از psql (Command Line)

1. Command Prompt یا PowerShell را باز کنید
2. دستورات زیر را اجرا کنید:

```sql
psql -U postgres

-- بعد در psql:
CREATE DATABASE nexhunt;
CREATE USER nexhunt WITH PASSWORD 'nexhunt_dev_password';
GRANT ALL PRIVILEGES ON DATABASE nexhunt TO nexhunt;
\q
```

### مرحله 5: تست اتصال

در pgAdmin:
1. **Servers** → **PostgreSQL 16** → **Databases** → **nexhunt** را باز کنید
2. اگر باز شد = موفقیت‌آمیز!

## ✅ بعد از نصب

1. PostgreSQL Service را Start کنید (اگر Start نیست):
   - **Services** (Win+R → `services.msc`)
   - **postgresql-x64-16** را پیدا کنید
   - راست کلیک → **Start**

2. اسکریپت NexHunt را اجرا کنید:
   ```powershell
   cd C:\Users\bughu\Desktop\Cursor\nexhunt
   .\start-local-xampp.ps1
   ```

## 🔧 تنظیمات DATABASE_URL

بعد از نصب، در فایل `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/nexhunt?schema=public
```

یا اگر User جداگانه ساختید:

```env
DATABASE_URL=postgresql://nexhunt:nexhunt_dev_password@localhost:5432/nexhunt?schema=public
```

## 📚 لینک‌های مفید

- **دانلود PostgreSQL**: https://www.postgresql.org/download/windows/
- **مستندات**: https://www.postgresql.org/docs/
- **pgAdmin**: https://www.pgadmin.org/

## ❓ سوالات متداول

### Q: می‌توانم از MySQL استفاده کنم؟
A: بله، اما نیاز به تغییر Schema در Prisma دارد. PostgreSQL توصیه می‌شود.

### Q: XAMPP MySQL را دارم - چرا نمی‌توانم استفاده کنم؟
A: Schema و کدها برای PostgreSQL نوشته شده. اگر می‌خواهید از MySQL استفاده کنید، باید تغییرات زیادی بدهید.

### Q: PostgreSQL رایگان است؟
A: بله، کاملاً رایگان و Open Source است.

---

**موفق باشید! 🚀**

