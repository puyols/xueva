#!/bin/bash

# Script to create deployment archive for Belka Flowers
# This archive can be extracted directly on any hosting

VERSION=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="belka-flowers-deploy-${VERSION}.tar.gz"

echo "🌸 Creating deployment archive for Belka Flowers..."

# Create temporary directory for packing
TEMP_DIR=$(mktemp -d)
DEPLOY_DIR="${TEMP_DIR}/belka-flowers"
mkdir -p "${DEPLOY_DIR}"

echo "📦 Copying production files..."

# Copy all HTML files (pre-rendered pages)
cp *.html "${DEPLOY_DIR}/" 2>/dev/null || true

# Copy all XML/TXT/JSON config files needed for production
cp robots.txt "${DEPLOY_DIR}/" 2>/dev/null || true
cp sitemap.xml "${DEPLOY_DIR}/" 2>/dev/null || true
cp manifest.json "${DEPLOY_DIR}/" 2>/dev/null || true
cp package.json "${DEPLOY_DIR}/" 2>/dev/null || true
cp .htaccess "${DEPLOY_DIR}/" 2>/dev/null || true
cp .env.example "${DEPLOY_DIR}/" 2>/dev/null || true

# Copy icons
cp favicon.ico "${DEPLOY_DIR}/" 2>/dev/null || true
cp icon.svg "${DEPLOY_DIR}/" 2>/dev/null || true

# Copy Node.js server
cp server.js "${DEPLOY_DIR}/" 2>/dev/null || true

# Copy directories
echo "📂 Copying directories..."
cp -r _next "${DEPLOY_DIR}/" 2>/dev/null || true
cp -r images "${DEPLOY_DIR}/" 2>/dev/null || true
cp -r api "${DEPLOY_DIR}/" 2>/dev/null || true

# Copy category subdirectories (only if they exist)
for dir in bukety_tsvetov devushke novosti piony rozy sukhotsvety tsvety_v_korobke tulpany; do
  if [ -d "$dir" ]; then
    cp -r "$dir" "${DEPLOY_DIR}/"
  fi
done

# Create deployment instructions
cat > "${DEPLOY_DIR}/README-DEPLOYMENT.txt" << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║            ИНСТРУКЦИЯ ПО РАЗВЕРТЫВАНИЮ BELKA FLOWERS             ║
╚══════════════════════════════════════════════════════════════════╝

Этот архив содержит готовый для развертывания сайт Belka Flowers.

═══════════════════════════════════════════════════════════════════
 ВАРИАНТ 1: ХОСТИНГ С NODE.JS (Рекомендуется)
═══════════════════════════════════════════════════════════════════

1. Распакуйте архив на сервере:
   tar -xzf belka-flowers-deploy-*.tar.gz
   cd belka-flowers

2. Настройте порт (опционально):
   echo "PORT=8080" > .env

3. Запустите сервер:
   # Прямой запуск:
   node server.js

   # ИЛИ с PM2 (автозапуск):
   npm install -g pm2
   pm2 start server.js --name belka-flowers
   pm2 save
   pm2 startup

4. Настройте Nginx как reverse proxy (рекомендуется):
   server {
       listen 80;
       server_name flowers-belka.ru;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }

5. Установите SSL сертификат:
   sudo certbot --nginx -d flowers-belka.ru

═══════════════════════════════════════════════════════════════════
 ВАРИАНТ 2: APACHE (Статический хостинг)
═══════════════════════════════════════════════════════════════════

1. Распакуйте архив в корневую директорию сайта:
   cd /var/www/html  # или public_html
   tar -xzf belka-flowers-deploy-*.tar.gz
   mv belka-flowers/* .
   mv belka-flowers/.htaccess .

2. Включите mod_rewrite (если не включен):
   sudo a2enmod rewrite
   sudo systemctl restart apache2

3. Убедитесь что AllowOverride включен в конфигурации Apache:
   <Directory /var/www/html>
       AllowOverride All
   </Directory>

4. Установите правильные права:
   find . -type f -exec chmod 644 {} \;
   find . -type d -exec chmod 755 {} \;

5. Установите SSL сертификат:
   sudo certbot --apache -d flowers-belka.ru

═══════════════════════════════════════════════════════════════════
 ВАРИАНТ 3: SHARED ХОСТИНГ (Beget, Hostiman и др.)
═══════════════════════════════════════════════════════════════════

1. Через FTP/SFTP загрузите содержимое папки belka-flowers
   в корневую директорию сайта (обычно public_html или www)

2. Если хостинг поддерживает Node.js:
   - В панели управления добавьте приложение Node.js
   - Укажите server.js как точку входа
   - Установите порт (обычно предоставляется хостингом)

3. Если только Apache/PHP:
   - Файлы уже готовы к работе
   - .htaccess настроен автоматически

═══════════════════════════════════════════════════════════════════
 ТРЕБОВАНИЯ
═══════════════════════════════════════════════════════════════════

Для варианта с Node.js:
- Node.js >= 14.0.0
- 100 MB свободного места
- Порт 8080 (или другой по выбору)

Для варианта с Apache:
- Apache 2.4+
- mod_rewrite включен
- AllowOverride All

═══════════════════════════════════════════════════════════════════
 ПРОВЕРКА РАБОТОСПОСОБНОСТИ
═══════════════════════════════════════════════════════════════════

После развертывания проверьте:
✓ https://ваш-домен/ - главная страница
✓ https://ваш-домен/bukety_tsvetov - каталог букетов
✓ https://ваш-домен/korzina - корзина
✓ https://ваш-домен/robots.txt - robots.txt
✓ https://ваш-домен/sitemap.xml - карта сайта

═══════════════════════════════════════════════════════════════════
 ПОДДЕРЖКА
═══════════════════════════════════════════════════════════════════

Email: info@belka-flowers.ru
Телефон/WhatsApp: +7 (903) 734-98-44

═══════════════════════════════════════════════════════════════════
EOF

# Create .gitignore for deployment package
cat > "${DEPLOY_DIR}/.gitignore" << 'EOF'
# Environment
.env
.env.local

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db

# Temporary
*.tmp
*.temp
EOF

# Create start script for quick launch
cat > "${DEPLOY_DIR}/start.sh" << 'EOF'
#!/bin/bash
echo "🌸 Starting Belka Flowers server..."
PORT=${PORT:-8080}
echo "Server will run on port ${PORT}"
node server.js
EOF

chmod +x "${DEPLOY_DIR}/start.sh"

# Create PM2 ecosystem file
cat > "${DEPLOY_DIR}/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'belka-flowers',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    }
  }]
};
EOF

echo "🗜️  Creating archive..."
cd "${TEMP_DIR}"

# Create archive with progress indicator
tar -czf "${ARCHIVE_NAME}" belka-flowers/ 2>&1 &
TAR_PID=$!

# Show progress
while kill -0 $TAR_PID 2>/dev/null; do
  echo -n "."
  sleep 1
done
wait $TAR_PID
echo ""

# Move archive to original directory
ORIG_DIR="${OLDPWD}"
mv "${ARCHIVE_NAME}" "${ORIG_DIR}/"

# Get archive size
ARCHIVE_SIZE=$(du -h "${ORIG_DIR}/${ARCHIVE_NAME}" | cut -f1)

# Cleanup
rm -rf "${TEMP_DIR}"

echo "✅ Archive created successfully!"
echo "📦 Archive: ${ARCHIVE_NAME}"
echo "📏 Size: ${ARCHIVE_SIZE}"
echo ""
echo "Чтобы развернуть на хостинге:"
echo "  1. Загрузите архив на сервер"
echo "  2. Распакуйте: tar -xzf ${ARCHIVE_NAME}"
echo "  3. Следуйте инструкциям в README-DEPLOYMENT.txt"
echo ""
echo "Быстрый старт с Node.js:"
echo "  cd belka-flowers && ./start.sh"
echo ""
echo "Или с PM2:"
echo "  cd belka-flowers && pm2 start ecosystem.config.js"
