# ژئوممبران اصفهان — GitHub Pages

این نسخه کاملاً Static است و برای GitHub Pages طراحی شده.

## انتشار
1. کل فایل‌ها را داخل یک Repository عمومی یا خصوصی قرار دهید.
2. Branch را روی `main` بگذارید.
3. در Settings → Pages، Source را روی GitHub Actions قرار دهید.
4. Workflow موجود در `.github/workflows/pages.yml` سایت را منتشر می‌کند.

## پنل مدیریت
آدرس: `/admin/`

GitHub Pages بک‌اند ندارد؛ بنابراین پنل مدیریت از GitHub API استفاده می‌کند. ادمین یک Fine-grained Personal Access Token می‌سازد که فقط روی همین Repository دسترسی `Contents: Read and write` دارد. توکن در session مرورگر نگه داشته می‌شود و برای ورود به سرور ارسال نمی‌شود.

پنل می‌تواند:
- تنظیمات تماس و معرفی را تغییر دهد.
- نمونه‌کار اضافه/ویرایش/حذف کند.
- تصویر نمونه‌کار را مستقیماً داخل Repository آپلود کند.

پس از Commit تغییرات، GitHub Pages به‌صورت خودکار Deploy می‌شود.

### نکته امنیتی
این روش برای یک سایت کوچک مناسب است، اما از نظر امنیتی به‌اندازه یک CMS دارای Backend حرفه‌ای نیست. Token را فقط روی دستگاه ادمین وارد کنید و دسترسی آن را محدود به همان Repository کنید.

## تغییر دامنه
`robots.txt` و `sitemap.xml` را با دامنه واقعی جایگزین کنید.
