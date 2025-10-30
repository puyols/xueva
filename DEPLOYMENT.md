# Инструкции по развертыванию Belka Flowers

## Варианты хостинга

### 1. Хостинг с Node.js (Рекомендуется)

#### Требования:
- Node.js >= 14.0.0
- SSH доступ к серверу

#### Шаги:

1. **Загрузка файлов на сервер**
   ```bash
   # Через Git
   git clone <repository-url>
   cd belka-flowers-static
   
   # Или через FTP/SFTP - загрузите все файлы в директорию сайта
   ```

2. **Установка PM2 (опционально, но рекомендуется)**
   ```bash
   npm install -g pm2
   ```

3. **Запуск сервера**
   ```bash
   # Прямой запуск
   npm start
   
   # Или с PM2 (автозапуск и управление)
   pm2 start server.js --name belka-flowers
   pm2 save
   pm2 startup
   ```

4. **Настройка порта (опционально)**
   ```bash
   # Создайте файл .env
   echo "PORT=3000" > .env
   
   # Или установите переменную окружения
   export PORT=3000
   npm start
   ```

5. **Настройка Nginx в качестве reverse proxy (рекомендуется)**
   ```nginx
   server {
       listen 80;
       server_name flowers-belka.ru www.flowers-belka.ru;
       
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
   }
   ```

### 2. Хостинг с Apache (Альтернатива)

#### Требования:
- Apache 2.4+
- mod_rewrite включен
- PHP не требуется

#### Шаги:

1. **Загрузка файлов**
   - Загрузите все файлы в корневую директорию сайта (обычно `public_html` или `www`)

2. **Проверка .htaccess**
   - Файл `.htaccess` уже настроен и включен в проект
   - Убедитесь, что mod_rewrite включен на сервере:
     ```bash
     # Проверка/включение mod_rewrite
     sudo a2enmod rewrite
     sudo systemctl restart apache2
     ```

3. **Настройка прав доступа**
   ```bash
   # Установите правильные права
   find . -type f -exec chmod 644 {} \;
   find . -type d -exec chmod 755 {} \;
   ```

4. **Проверка**
   - Откройте сайт в браузере
   - Все маршруты должны работать автоматически

### 3. Statically hosted (Vercel, Netlify, GitHub Pages)

#### Vercel:

1. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Деплой:
   ```bash
   vercel
   ```

3. Или подключите через GitHub:
   - Загрузите проект на GitHub
   - Импортируйте в Vercel
   - Настройки:
     - Build Command: (оставить пустым)
     - Output Directory: `.`

#### Netlify:

1. Установите Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Деплой:
   ```bash
   netlify deploy --prod
   ```

3. Или через веб-интерфейс:
   - Drag & Drop всех файлов
   - Или подключите GitHub репозиторий

#### GitHub Pages:

1. Создайте репозиторий `username.github.io`
2. Загрузите файлы
3. В настройках репозитория включите GitHub Pages
4. Сайт будет доступен по адресу `https://username.github.io`

### 4. Shared Hosting (например, Hostiman, Beget)

#### Шаги:

1. **Через FTP/SFTP клиент**
   - Подключитесь к FTP
   - Загрузите все файлы в корневую директорию (`public_html`, `www`, или `httpdocs`)

2. **Если поддерживается Node.js**
   - Загрузите файлы
   - В панели управления добавьте приложение Node.js
   - Укажите `server.js` как entry point
   - Установите порт (обычно предоставляется хостингом)

3. **Если только Apache/PHP**
   - Просто загрузите файлы
   - `.htaccess` сделает всю работу
   - Node.js сервер не нужен

## Проверка работоспособности

После развертывания проверьте следующие URL:

- `https://ваш-домен.ru/` - главная страница
- `https://ваш-домен.ru/bukety_tsvetov` - каталог букетов
- `https://ваш-домен.ru/manifest.json` - PWA манифест
- `https://ваш-домен.ru/robots.txt` - robots.txt
- `https://ваш-домен.ru/sitemap.xml` - sitemap
- `https://ваш-домен.ru/nonexistent` - должна показать 404 страницу

## Настройка SSL (HTTPS)

### Для Nginx:
```bash
# Установите Certbot
sudo apt install certbot python3-certbot-nginx

# Получите сертификат
sudo certbot --nginx -d flowers-belka.ru -d www.flowers-belka.ru
```

### Для Apache:
```bash
# Установите Certbot
sudo apt install certbot python3-certbot-apache

# Получите сертификат
sudo certbot --apache -d flowers-belka.ru -d www.flowers-belka.ru
```

## Мониторинг и логи

### С PM2:
```bash
# Просмотр логов
pm2 logs belka-flowers

# Мониторинг
pm2 monit

# Статус
pm2 status
```

### С systemd:
```bash
# Просмотр логов
journalctl -u belka-flowers -f
```

## Обновление сайта

### С PM2:
```bash
# Остановите приложение
pm2 stop belka-flowers

# Обновите файлы (git pull или загрузка через FTP)
git pull

# Перезапустите
pm2 restart belka-flowers
```

### С Apache:
```bash
# Просто замените файлы
# Apache автоматически отдаст новые файлы
```

## Troubleshooting

### Проблема: 404 на всех страницах кроме главной

**Решение для Apache:**
```bash
# Проверьте, включен ли mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2

# Проверьте права на .htaccess
chmod 644 .htaccess
```

**Решение для Nginx:**
```nginx
# Добавьте try_files в конфигурацию
location / {
    try_files $uri $uri.html $uri/ /index.html;
}
```

### Проблема: Порт занят (Node.js)

```bash
# Найдите процесс на порту
lsof -i :8080

# Убейте процесс
kill -9 <PID>

# Или используйте другой порт
PORT=3000 npm start
```

### Проблема: Permission denied

```bash
# Исправьте права доступа
chmod -R 755 .
find . -type f -exec chmod 644 {} \;
```

## Контакты поддержки

Если возникли проблемы с развертыванием:
- Email: info@belka-flowers.ru
- Телефон: +7 (903) 734-98-44
- WhatsApp: +7 (903) 734-98-44
