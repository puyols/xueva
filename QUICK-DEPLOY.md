# 🌸 Быстрое развертывание Belka Flowers

## Архив для развертывания

Файл: **`belka-flowers-deploy.tar.gz`** (2.0 GB)

Этот архив содержит полностью готовый для развертывания сайт. Просто распакуйте и запустите!

---

## 🚀 Быстрый старт

### Вариант 1: Node.js сервер (Рекомендуется)

```bash
# 1. Загрузите архив на сервер и распакуйте
tar -xzf belka-flowers-deploy.tar.gz
cd belka-flowers

# 2. Запустите сервер
node server.js

# 3. Откройте в браузере
http://localhost:8080
```

### Вариант 2: С автозапуском (PM2)

```bash
# 1. Установите PM2 (если еще не установлен)
npm install -g pm2

# 2. Распакуйте архив
tar -xzf belka-flowers-deploy.tar.gz
cd belka-flowers

# 3. Запустите с PM2
pm2 start ecosystem.config.js

# 4. Сохраните для автозапуска при перезагрузке
pm2 save
pm2 startup
```

### Вариант 3: Apache (Статический хостинг)

```bash
# 1. Распакуйте в корневую директорию сайта
cd /var/www/html  # или public_html
tar -xzf belka-flowers-deploy.tar.gz
mv belka-flowers/* .
mv belka-flowers/.htaccess .
mv belka-flowers/.env.example .

# 2. Включите mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2

# 3. Готово! Сайт доступен
```

### Вариант 4: Shared-хостинг (FTP)

1. Распакуйте архив локально
2. Загрузите содержимое папки `belka-flowers` на хостинг через FTP
3. Если поддерживается Node.js - запустите server.js
4. Если только Apache - файлы уже готовы к работе

---

## ⚙️ Настройка порта

По умолчанию сервер работает на порту **8080**. Для изменения:

```bash
# Создайте файл .env
echo "PORT=3000" > .env

# Или экспортируйте переменную
export PORT=3000
node server.js
```

---

## 🔒 Настройка SSL (HTTPS)

### С Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name flowers-belka.ru www.flowers-belka.ru;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Установите SSL сертификат
sudo certbot --nginx -d flowers-belka.ru -d www.flowers-belka.ru
```

### С Apache:

```bash
# Установите SSL сертификат
sudo certbot --apache -d flowers-belka.ru -d www.flowers-belka.ru
```

---

## 📋 Проверка работоспособности

После развертывания проверьте эти URL:

- ✅ `/` - главная страница
- ✅ `/bukety_tsvetov` - каталог букетов
- ✅ `/korzina` - корзина
- ✅ `/checkout` - оформление заказа
- ✅ `/robots.txt` - robots.txt
- ✅ `/sitemap.xml` - карта сайта
- ✅ `/manifest.json` - PWA манифест

---

## 📦 Содержимое архива

- ✅ Все HTML страницы (предрендеренные)
- ✅ Next.js runtime в `_next/`
- ✅ Все изображения в `images/`
- ✅ Node.js сервер (`server.js`)
- ✅ Apache конфигурация (`.htaccess`)
- ✅ PWA манифест и SEO файлы
- ✅ PM2 конфигурация (`ecosystem.config.js`)
- ✅ Скрипт быстрого запуска (`start.sh`)
- ✅ Подробная инструкция (`README-DEPLOYMENT.txt`)

---

## 🛠️ Требования

### Для Node.js варианта:
- Node.js >= 14.0.0
- ~2 GB дискового пространства
- Доступный порт (по умолчанию 8080)

### Для Apache варианта:
- Apache 2.4+
- mod_rewrite включен
- AllowOverride All в конфигурации

---

## 📞 Поддержка

- **Email:** info@belka-flowers.ru
- **Телефон:** +7 (903) 734-98-44
- **WhatsApp:** +7 (903) 734-98-44

---

## 🎯 Полная инструкция

Подробная инструкция по всем вариантам развертывания находится внутри архива:
`belka-flowers/README-DEPLOYMENT.txt`

---

**Создано:** $(date +"%Y-%m-%d %H:%M:%S")
**Версия:** 1.0
**Архив:** belka-flowers-deploy.tar.gz (2.0 GB)
