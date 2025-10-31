# План работ по запуску сайта Belka Flowers

## Общая информация о проекте

**Название:** Belka Flowers - интернет-магазин цветов  
**Технологии:** Next.js (статический экспорт), Node.js  
**Домен:** flowers-belka.ru  
**Текущий статус:** Проект готов к развертыванию

---

## Этап 1: Подготовительные работы (1-2 дня)

### 1.1 Аудит и проверка проекта
- ✅ **Проверка файлов проекта**
  - [x] Наличие всех HTML страниц (каталог, категории, корзина, оформление)
  - [x] Статические ресурсы Next.js (_next/)
  - [x] Изображения товаров и категорий (images/)
  - [x] Конфигурационные файлы (robots.txt, sitemap.xml, manifest.json)
  - [x] Серверный файл (server.js)

- 📋 **Функциональный тест локально**
  - [ ] Запустить сервер локально: `npm start`
  - [ ] Проверить главную страницу (/)
  - [ ] Проверить каталог букетов (/bukety_tsvetov)
  - [ ] Проверить категории (розы, тюльпаны, пионы)
  - [ ] Проверить корзину и оформление заказа
  - [ ] Проверить 404 страницу
  - [ ] Проверить мобильную адаптацию

- 📋 **SEO проверка**
  - [ ] Проверить sitemap.xml (наличие всех важных URL)
  - [ ] Проверить robots.txt
  - [ ] Проверить meta-теги на основных страницах
  - [ ] Проверить Open Graph теги
  - [ ] Проверить структурированные данные (Schema.org)

### 1.2 Выбор хостинга и регистрация домена

#### Рекомендуемые варианты хостинга:

**Вариант A: VPS с Node.js (Рекомендуется)**
- Провайдеры: Timeweb, RuCloud, DigitalOcean, Selectel
- Требования: Ubuntu 20.04+, Node.js 14+, 1GB RAM, 20GB SSD
- Стоимость: от 200-500 руб/месяц
- Преимущества: полный контроль, высокая производительность

**Вариант B: Shared хостинг с Node.js**
- Провайдеры: Beget, Timeweb, SpaceWeb
- Требования: поддержка Node.js приложений
- Стоимость: от 150-300 руб/месяц
- Преимущества: простота настройки, управляемость

**Вариант C: Облачный хостинг (Serverless)**
- Провайдеры: Vercel, Netlify, Cloudflare Pages
- Требования: Git репозиторий
- Стоимость: бесплатно до определенных лимитов
- Преимущества: автоматический деплой, CDN, SSL из коробки

#### Задачи по домену:
- [ ] Проверить доступность домена flowers-belka.ru
- [ ] Зарегистрировать домен (если не зарегистрирован)
- [ ] Настроить NS-серверы на выбранного хостинг-провайдера

### 1.3 Подготовка окружения

- [ ] **Создать учетную запись на хостинге**
- [ ] **Получить доступы:**
  - SSH доступ (для VPS)
  - FTP/SFTP доступ
  - Панель управления хостингом
  - Доступ к DNS настройкам

- [ ] **Подготовить необходимые инструменты:**
  - FTP клиент (FileZilla) или SFTP
  - SSH клиент (PuTTY для Windows, встроенный терминал для Mac/Linux)
  - Git (если деплой через Git)

---

## Этап 2: Настройка сервера (1 день)

### 2.1 Вариант A: Настройка VPS с Node.js

#### Подключение к серверу:
```bash
ssh root@your-server-ip
```

#### Обновление системы:
```bash
sudo apt update && sudo apt upgrade -y
```

#### Установка Node.js:
```bash
# Установка Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка установки
node --version
npm --version
```

#### Установка PM2 (Process Manager):
```bash
sudo npm install -g pm2
```

#### Установка Nginx (как reverse proxy):
```bash
sudo apt install -y nginx
```

#### Настройка firewall:
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

#### Создание пользователя для приложения:
```bash
sudo adduser belkaflowers
sudo usermod -aG sudo belkaflowers
```

### 2.2 Вариант B: Настройка Shared хостинга

- [ ] Войти в панель управления хостингом
- [ ] Перейти в раздел Node.js приложений
- [ ] Создать новое Node.js приложение:
  - Версия Node.js: 14+ или 18 (рекомендуется)
  - Режим: Production
  - Entry point: server.js
- [ ] Получить выделенный порт для приложения
- [ ] Настроить переменные окружения (PORT)

### 2.3 Вариант C: Настройка Vercel/Netlify

#### Для Vercel:
```bash
# Установка Vercel CLI
npm install -g vercel

# Вход в аккаунт
vercel login

# Инициализация проекта
vercel
```

#### Для Netlify:
```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Вход в аккаунт
netlify login

# Деплой
netlify deploy --prod
```

---

## Этап 3: Развертывание сайта (1 день)

### 3.1 Загрузка файлов на сервер

#### Вариант 1: Через Git (рекомендуется для VPS)
```bash
# На сервере
cd /var/www
sudo git clone <repository-url> belka-flowers
cd belka-flowers
sudo chown -R belkaflowers:belkaflowers /var/www/belka-flowers
```

#### Вариант 2: Через SFTP/FTP
- Подключиться к серверу через FileZilla
- Загрузить все файлы в директорию сайта:
  - VPS: `/var/www/belka-flowers/`
  - Shared: `public_html/` или `www/`
- Загрузить следующие файлы и папки:
  - [x] Все HTML файлы
  - [x] Папка _next/
  - [x] Папка images/
  - [x] Папки категорий (bukety_tsvetov, rozy, tulpany, и т.д.)
  - [x] server.js
  - [x] package.json
  - [x] robots.txt
  - [x] sitemap.xml
  - [x] manifest.json
  - [x] .htaccess (для Apache)
  - [x] favicon.ico, icon.svg

#### Вариант 3: Через Drag & Drop (Netlify)
- Зайти на netlify.com
- Перетащить папку проекта в область загрузки
- Дождаться автоматического деплоя

### 3.2 Настройка прав доступа (для VPS)

```bash
# Установка правильных прав
cd /var/www/belka-flowers
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod 755 server.js
```

### 3.3 Создание .env файла

```bash
# На сервере
cd /var/www/belka-flowers
nano .env
```

Содержимое файла `.env`:
```env
PORT=8080
NODE_ENV=production
```

### 3.4 Запуск приложения

#### Для VPS с PM2:
```bash
cd /var/www/belka-flowers
pm2 start server.js --name belka-flowers
pm2 save
pm2 startup
```

Проверка статуса:
```bash
pm2 status
pm2 logs belka-flowers
```

#### Для Shared хостинга:
- В панели управления запустить Node.js приложение
- Проверить логи в панели управления

---

## Этап 4: Настройка веб-сервера (0.5 дня)

### 4.1 Настройка Nginx (для VPS)

Создать конфигурацию:
```bash
sudo nano /etc/nginx/sites-available/belka-flowers
```

Содержимое конфигурации:
```nginx
server {
    listen 80;
    server_name flowers-belka.ru www.flowers-belka.ru;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|woff|woff2)$ {
        proxy_pass http://localhost:8080;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Активация конфигурации:
```bash
sudo ln -s /etc/nginx/sites-available/belka-flowers /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4.2 Настройка Apache (для Shared хостинга)

Файл `.htaccess` уже включен в проект. Проверить, что он загружен правильно:

```apache
# .htaccess содержит правила для:
# - Перенаправления на HTTPS
# - Правильной маршрутизации SPA
# - Кэширования статических ресурсов
# - Security headers
```

Убедиться, что mod_rewrite включен:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

---

## Этап 5: Настройка DNS (0.5 дня)

### 5.1 Настройка A-записей

В панели управления доменом добавить DNS записи:

```
A    @               <IP-адрес-сервера>    3600
A    www             <IP-адрес-сервера>    3600
```

Для Vercel/Netlify:
```
CNAME www            <your-project>.vercel.app    3600
A     @              <Vercel-IP>                  3600
```

### 5.2 Проверка DNS

```bash
# Проверка A-записи
dig flowers-belka.ru
dig www.flowers-belka.ru

# Проверка через nslookup
nslookup flowers-belka.ru
```

**Важно:** Распространение DNS может занять от 1 до 48 часов.

---

## Этап 6: Настройка SSL/HTTPS (0.5 дня)

### 6.1 Установка Certbot (для VPS)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d flowers-belka.ru -d www.flowers-belka.ru

# Ввести email для уведомлений
# Согласиться с условиями
# Выбрать опцию редиректа HTTP -> HTTPS
```

Автоматическое обновление:
```bash
# Проверка автообновления
sudo systemctl status certbot.timer

# Тест обновления
sudo certbot renew --dry-run
```

### 6.2 SSL для Shared хостинга

- В панели управления хостингом найти раздел SSL
- Выбрать "Let's Encrypt"
- Добавить домены: flowers-belka.ru, www.flowers-belka.ru
- Активировать автоматическое обновление

### 6.3 SSL для Vercel/Netlify

- SSL настраивается автоматически при добавлении домена
- В настройках проекта добавить custom domain
- Дождаться выпуска SSL сертификата (обычно 1-2 минуты)

---

## Этап 7: Тестирование (1 день)

### 7.1 Функциональное тестирование

- [ ] **Главная страница**
  - [ ] Открывается без ошибок
  - [ ] Все изображения загружаются
  - [ ] Карусель работает
  - [ ] Навигация функционирует

- [ ] **Каталог и категории**
  - [ ] /bukety_tsvetov - каталог букетов
  - [ ] /rozy - розы
  - [ ] /tulpany - тюльпаны
  - [ ] /piony - пионы
  - [ ] /tsvety_v_korobke - цветы в коробке
  - [ ] /sukhotsvety - сухоцветы

- [ ] **Тематические страницы**
  - [ ] /8-marta - 8 Марта
  - [ ] /14-fevralya - 14 Февраля
  - [ ] /den-rozhdeniya - День рождения
  - [ ] /den-materi - День матери

- [ ] **Географические страницы**
  - [ ] /dostavka-tsvetov-khimki - Доставка в Химки
  - [ ] /dostavka-tsvetov-krasnogorsk - Доставка в Красногорск

- [ ] **Процесс заказа**
  - [ ] Добавление товара в корзину
  - [ ] /korzina - корзина
  - [ ] /checkout - оформление заказа
  - [ ] /order-success - страница успешного заказа

- [ ] **Информационные страницы**
  - [ ] /dostavka - информация о доставке
  - [ ] /privacy - политика конфиденциальности
  - [ ] /karta-sayta - карта сайта

- [ ] **Ошибки**
  - [ ] 404 страница показывается для несуществующих URL

### 7.2 Кроссбраузерное тестирование

Проверить в браузерах:
- [ ] Google Chrome (последняя версия)
- [ ] Mozilla Firefox (последняя версия)
- [ ] Safari (для Mac/iOS)
- [ ] Microsoft Edge
- [ ] Мобильный Chrome (Android)
- [ ] Мобильный Safari (iOS)

### 7.3 Адаптивность (Responsive Design)

Проверить на устройствах:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile Large (414x896)

### 7.4 Производительность

**Инструменты для проверки:**
- [ ] Google PageSpeed Insights (https://pagespeed.web.dev/)
  - Целевой показатель: 90+ для Desktop, 80+ для Mobile
- [ ] GTmetrix (https://gtmetrix.com/)
- [ ] WebPageTest (https://www.webpagetest.org/)

**Метрики для проверки:**
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] First Input Delay (FID) < 100ms
- [ ] Time to Interactive (TTI) < 3.8s

### 7.5 SEO проверка

**Инструменты:**
- [ ] Google Search Console
  - Добавить и верифицировать сайт
  - Отправить sitemap.xml
- [ ] Яндекс.Вебмастер
  - Добавить и верифицировать сайт
  - Отправить sitemap.xml

**Проверка элементов:**
- [ ] Title теги уникальны для каждой страницы
- [ ] Meta descriptions заполнены
- [ ] H1 заголовки присутствуют на всех страницах
- [ ] Alt атрибуты у изображений
- [ ] Canonical URLs
- [ ] Open Graph теги (для соцсетей)
- [ ] Structured Data (Schema.org)

**Онлайн инструменты для SEO:**
- [ ] https://search.google.com/test/rich-results - тест структурированных данных
- [ ] https://validator.w3.org/ - валидация HTML
- [ ] https://www.seoptimer.com/ - общий SEO аудит

### 7.6 Безопасность

**Проверка безопасности:**
- [ ] HTTPS работает корректно
- [ ] Нет mixed content (HTTP ресурсы на HTTPS странице)
- [ ] Security headers настроены:
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] X-XSS-Protection
  - [ ] Strict-Transport-Security (HSTS)
- [ ] Доступ к служебным файлам заблокирован:
  - [ ] /.git
  - [ ] /server.js
  - [ ] /.env
  - [ ] /package.json

**Инструменты:**
- [ ] https://securityheaders.com/ - проверка security headers
- [ ] https://www.ssllabs.com/ssltest/ - проверка SSL конфигурации

### 7.7 Доступность (Accessibility)

**Инструменты:**
- [ ] WAVE (https://wave.webaim.org/)
- [ ] Lighthouse Accessibility Audit
- [ ] axe DevTools

**Проверка:**
- [ ] Навигация с клавиатуры работает
- [ ] Контрастность текста достаточна
- [ ] ARIA атрибуты присутствуют где необходимо
- [ ] Формы имеют правильные labels

---

## Этап 8: Настройка аналитики и мониторинга (0.5 дня)

### 8.1 Google Analytics

1. **Создать аккаунт Google Analytics 4**
   - Перейти на https://analytics.google.com/
   - Создать новый ресурс
   - Получить Measurement ID (G-XXXXXXXXXX)

2. **Добавить код отслеживания**
   - Вставить GA4 код в `<head>` всех HTML страниц
   - Или использовать Google Tag Manager

3. **Настроить цели и события**
   - Просмотр страниц
   - Добавление в корзину
   - Начало оформления заказа
   - Завершение заказа

### 8.2 Яндекс.Метрика

1. **Создать счетчик**
   - Перейти на https://metrika.yandex.ru/
   - Создать новый счетчик
   - Получить код счетчика

2. **Настроить веб-визор и карты**
   - Включить вебвизор
   - Настроить карты кликов
   - Настроить формы

3. **Настроить цели**
   - Посещение страницы успешного заказа
   - Клики по кнопкам заказа
   - Звонки по телефону (Яндекс.Телефония)

### 8.3 Мониторинг сервера (для VPS)

**Установка инструментов мониторинга:**

```bash
# Установка htop для мониторинга ресурсов
sudo apt install htop

# Установка netdata (опционально)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

**PM2 Monitoring:**
```bash
# Просмотр логов
pm2 logs belka-flowers

# Мониторинг в реальном времени
pm2 monit

# Статус приложения
pm2 status
```

### 8.4 Uptime мониторинг

**Сервисы для мониторинга доступности:**
- [ ] UptimeRobot (https://uptimerobot.com/) - бесплатно до 50 мониторов
- [ ] Pingdom
- [ ] StatusCake

**Настройка:**
- Добавить URL: https://flowers-belka.ru
- Интервал проверки: 5 минут
- Уведомления: email, SMS, Telegram
- Мониторить HTTP статус код (200)

### 8.5 Error tracking (опционально)

**Sentry для отслеживания ошибок JavaScript:**
```javascript
// Добавить в head всех страниц
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_DSN_HERE' });
</script>
```

---

## Этап 9: Настройка резервного копирования (0.5 дня)

### 9.1 Для VPS

**Создание скрипта резервного копирования:**

```bash
# Создать директорию для бэкапов
sudo mkdir -p /var/backups/belka-flowers

# Создать скрипт
sudo nano /usr/local/bin/backup-belka.sh
```

Содержимое скрипта:
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/belka-flowers"
SOURCE_DIR="/var/www/belka-flowers"

# Создание архива
tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz $SOURCE_DIR

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: backup_$TIMESTAMP.tar.gz"
```

Настройка прав и автоматизация:
```bash
sudo chmod +x /usr/local/bin/backup-belka.sh

# Добавить в crontab (ежедневно в 3:00)
sudo crontab -e
# Добавить строку:
0 3 * * * /usr/local/bin/backup-belka.sh
```

### 9.2 Для Shared хостинга

- Использовать встроенные инструменты хостинга для backup
- Настроить автоматическое резервное копирование в панели управления
- Частота: ежедневно
- Хранение: минимум 7 дней

### 9.3 Для Vercel/Netlify

- Бэкапы не требуются (все хранится в Git)
- Убедиться, что код в Git репозитории актуален
- Создать теги релизов в Git для версионирования

---

## Этап 10: Оптимизация и улучшения (1 день)

### 10.1 Оптимизация изображений

**Инструменты для сжатия:**
- [ ] TinyPNG (https://tinypng.com/) - для PNG/JPG
- [ ] Squoosh (https://squoosh.app/) - для всех форматов
- [ ] ImageOptim (для Mac)

**Действия:**
- [ ] Сжать все изображения в папке /images/
- [ ] Конвертировать в WebP формат (если поддерживается)
- [ ] Использовать responsive images (разные размеры для разных устройств)

### 10.2 Настройка CDN (опционально)

**Cloudflare (бесплатный план):**
1. Зарегистрироваться на https://cloudflare.com/
2. Добавить домен flowers-belka.ru
3. Изменить NS-серверы на Cloudflare
4. Включить:
   - [ ] Auto Minify (HTML, CSS, JS)
   - [ ] Brotli compression
   - [ ] HTTP/3 (QUIC)
   - [ ] Always Use HTTPS
   - [ ] Auto HTTPS Rewrites

### 10.3 Настройка кэширования

**Для Nginx:**
```nginx
# Добавить в конфигурацию
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Для Apache (.htaccess):**
```apache
# Уже настроено в .htaccess
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

### 10.4 Настройка robots.txt для конкретного домена

Обновить robots.txt с правильным доменом:
```txt
Sitemap: https://flowers-belka.ru/sitemap.xml
```

### 10.5 Создание Google My Business

1. **Регистрация в Google My Business**
   - Перейти на https://www.google.com/business/
   - Создать профиль для Belka Flowers
   - Указать адрес, телефон, часы работы
   - Добавить фотографии букетов

2. **Верификация**
   - Пройти процесс верификации (обычно через телефон)

3. **Настройка**
   - Добавить описание бизнеса
   - Категории: Магазин цветов, Доставка цветов
   - Загрузить фотографии (минимум 10)

---

## Этап 11: Маркетинг и продвижение (постоянная задача)

### 11.1 Регистрация в поисковых системах

- [ ] **Google Search Console**
  - Добавить и верифицировать сайт
  - Отправить sitemap.xml
  - Проверить индексацию страниц

- [ ] **Яндекс.Вебмастер**
  - Добавить и верифицировать сайт
  - Отправить sitemap.xml
  - Проверить индексацию страниц

- [ ] **Bing Webmaster Tools**
  - Добавить сайт
  - Отправить sitemap.xml

### 11.2 Настройка социальных сетей

**Создание профилей:**
- [ ] Instagram (@belkaflowers)
- [ ] ВКонтакте (vk.com/belkaflowers)
- [ ] Facebook
- [ ] Одноклассники

**Настройка интеграции:**
- [ ] Добавить кнопки соцсетей на сайт
- [ ] Настроить Open Graph теги для красивых превью
- [ ] Создать контент-план для постов

### 11.3 Контекстная реклама

**Яндекс.Директ:**
- [ ] Создать аккаунт Яндекс.Директ
- [ ] Настроить рекламные кампании:
  - Поисковая реклама (ключевые слова: "купить цветы", "доставка цветов")
  - РСЯ (Рекламная сеть Яндекса)
  - Ретаргетинг

**Google Ads:**
- [ ] Создать аккаунт Google Ads
- [ ] Настроить поисковые кампании
- [ ] Настроить медийные кампании (GDN)
- [ ] Настроить ремаркетинг

### 11.4 Email маркетинг

**Настройка email сервиса:**
- [ ] Выбрать платформу (MailChimp, SendPulse, UniSender)
- [ ] Создать форму подписки на сайте
- [ ] Настроить автоматические письма:
  - Подтверждение заказа
  - Уведомление о доставке
  - Напоминание о праздниках (8 марта, 14 февраля)

### 11.5 Локальное SEO

**Для бизнеса с доставкой:**
- [ ] Оптимизировать страницы для локальных запросов:
  - "Доставка цветов Химки"
  - "Доставка цветов Красногорск"
  - "Цветы с доставкой Москва"
- [ ] Добавить бизнес в 2ГИС, Яндекс.Карты, Google Maps
- [ ] Получить отзывы клиентов на Google и Яндекс

---

## Этап 12: Документация и передача (0.5 дня)

### 12.1 Создание документации для клиента

**Создать документ с информацией:**
- [ ] Доступы к серверу (SSH, FTP, панель управления)
- [ ] Доступы к доменному регистратору
- [ ] Доступы к аналитике (Google Analytics, Яндекс.Метрика)
- [ ] Доступы к соцсетям и рекламным аккаунтам
- [ ] Инструкции по обновлению контента
- [ ] Контакты службы поддержки хостинга
- [ ] Инструкции по восстановлению из backup

### 12.2 Обучение клиента (если требуется)

**Темы для обучения:**
- [ ] Как просматривать аналитику
- [ ] Как добавлять/изменять товары (если есть админка)
- [ ] Как проверять логи и статус сайта
- [ ] Как связаться с поддержкой при проблемах

### 12.3 Передача материалов

- [ ] Передать все доступы и пароли (в безопасном виде)
- [ ] Передать исходный код (если не в Git)
- [ ] Передать документацию
- [ ] Передать контакты для технической поддержки

---

## Этап 13: Пост-запуск и поддержка (постоянная задача)

### 13.1 Мониторинг первой недели

**Ежедневные проверки:**
- [ ] Проверка доступности сайта (uptime)
- [ ] Проверка логов сервера на ошибки
- [ ] Мониторинг трафика в Google Analytics
- [ ] Проверка работы форм заказа
- [ ] Ответы на обращения клиентов

### 13.2 Регулярное обслуживание

**Еженедельно:**
- [ ] Проверка безопасности (обновления, уязвимости)
- [ ] Анализ трафика и конверсий
- [ ] Проверка работоспособности всех страниц
- [ ] Мониторинг скорости загрузки

**Ежемесячно:**
- [ ] Обновление контента (при необходимости)
- [ ] Проверка SSL сертификата
- [ ] Анализ SEO позиций
- [ ] Обзор рекламных кампаний (ROI)
- [ ] Оптимизация на основе данных аналитики

**Ежеквартально:**
- [ ] Полный аудит SEO
- [ ] Проверка безопасности
- [ ] Обновление Node.js (если требуется)
- [ ] Оптимизация производительности
- [ ] Анализ конкурентов

### 13.3 План на случай ЧП (Disaster Recovery Plan)

**Действия при падении сайта:**
1. Проверить статус сервера (ping, SSH доступ)
2. Проверить логи: `pm2 logs` или `tail -f /var/log/nginx/error.log`
3. Перезапустить приложение: `pm2 restart belka-flowers`
4. Перезапустить Nginx: `sudo systemctl restart nginx`
5. Если не помогает - восстановить из backup
6. Уведомить клиента о проблеме и времени восстановления

**Контакты экстренной связи:**
- Техподдержка хостинга: [телефон/email]
- Администратор сервера: [контакт]
- Ответственное лицо клиента: [контакт]

---

## Чек-лист перед запуском

### Технические требования
- [x] Node.js сервер работает
- [ ] SSL сертификат установлен
- [ ] DNS настроены правильно
- [ ] Все страницы открываются без ошибок
- [ ] 404 страница работает
- [ ] robots.txt и sitemap.xml доступны
- [ ] Формы отправки заказов работают

### SEO и контент
- [ ] Title и meta descriptions на всех страницах
- [ ] Все изображения имеют alt атрибуты
- [ ] Sitemap отправлен в Google и Яндекс
- [ ] Open Graph теги настроены
- [ ] Контент проверен на ошибки

### Производительность
- [ ] PageSpeed Score > 80
- [ ] Все изображения оптимизированы
- [ ] Кэширование настроено
- [ ] CDN настроен (опционально)
- [ ] Gzip/Brotli сжатие включено

### Безопасность
- [ ] HTTPS работает на всех страницах
- [ ] Security headers настроены
- [ ] Служебные файлы недоступны извне
- [ ] Firewall настроен
- [ ] Backup настроен

### Аналитика и мониторинг
- [ ] Google Analytics настроен
- [ ] Яндекс.Метрика настроена
- [ ] Uptime мониторинг настроен
- [ ] Email уведомления о проблемах настроены

### Бизнес-требования
- [ ] Контактная информация актуальна
- [ ] Цены проверены
- [ ] Условия доставки указаны
- [ ] Политика конфиденциальности опубликована
- [ ] Способы оплаты описаны

---

## Сроки выполнения

| Этап | Описание | Длительность | Дни |
|------|----------|--------------|-----|
| 1 | Подготовительные работы | 1-2 дня | 1-2 |
| 2 | Настройка сервера | 1 день | 1 |
| 3 | Развертывание сайта | 1 день | 1 |
| 4 | Настройка веб-сервера | 0.5 дня | 0.5 |
| 5 | Настройка DNS | 0.5 дня | 0.5 |
| 6 | Настройка SSL/HTTPS | 0.5 дня | 0.5 |
| 7 | Тестирование | 1 день | 1 |
| 8 | Аналитика и мониторинг | 0.5 дня | 0.5 |
| 9 | Резервное копирование | 0.5 дня | 0.5 |
| 10 | Оптимизация | 1 день | 1 |
| 11 | Маркетинг (базовая настройка) | 1 день | 1 |
| 12 | Документация и передача | 0.5 дня | 0.5 |

**Общая длительность:** 9-10 рабочих дней

**+ Время на распространение DNS:** 1-2 дня

**Итого:** 10-12 календарных дней от начала до полного запуска

---

## Бюджет (примерный)

### Обязательные расходы

| Статья | Стоимость (руб/мес) | Разово (руб) |
|--------|---------------------|--------------|
| Домен .ru | 200-300 | - |
| VPS хостинг | 300-500 | - |
| SSL сертификат | Бесплатно (Let's Encrypt) | 0 |
| **Итого ежемесячно** | **500-800** | **200-300** |

### Опциональные расходы

| Статья | Стоимость |
|--------|-----------|
| CDN (Cloudflare Pro) | $20/мес (по желанию, базовый план бесплатен) |
| Uptime мониторинг (премиум) | $5-10/мес (базовый бесплатен) |
| Email сервис (SendPulse) | от 500 руб/мес |
| Реклама (Яндекс.Директ) | от 10,000 руб/мес |
| Реклама (Google Ads) | от 10,000 руб/мес |

---

## Контакты и ресурсы

### Техническая поддержка
- **Телефон:** +7 (903) 734-98-44
- **Email:** info@belka-flowers.ru
- **WhatsApp:** +7 (903) 734-98-44

### Полезные ссылки
- **Основной домен:** https://flowers-belka.ru
- **Документация Next.js:** https://nextjs.org/docs
- **Node.js документация:** https://nodejs.org/docs
- **Nginx документация:** https://nginx.org/ru/docs/

### Инструменты
- **FileZilla (FTP клиент):** https://filezilla-project.org/
- **PuTTY (SSH клиент для Windows):** https://www.putty.org/
- **PM2 документация:** https://pm2.keymetrics.io/docs/
- **Certbot (SSL):** https://certbot.eff.org/

---

## Заключение

Этот план покрывает все необходимые шаги для успешного запуска интернет-магазина Belka Flowers. 

**Ключевые моменты:**
1. ✅ Проект готов к деплою - все файлы на месте
2. 🚀 Выбор хостинга зависит от бюджета и технических навыков
3. 📊 Обязательно настроить аналитику с первого дня
4. 🔒 SSL и безопасность - критичные требования
5. 📈 План на пост-запуск не менее важен, чем сам запуск

**Следующий шаг:** Выбрать вариант хостинга и начать с Этапа 1.

Удачи с запуском! 🚀🌸
