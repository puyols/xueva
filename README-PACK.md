# 📦 Создание архива для развертывания

## Быстрое использование

### Создать архив:

```bash
./pack-deploy.sh
```

Скрипт создаст архив `belka-flowers-deploy-YYYYMMDD_HHMMSS.tar.gz` со всем необходимым для развертывания.

---

## Что делает скрипт

1. ✅ Собирает все HTML страницы
2. ✅ Копирует ресурсы (_next, images, api)
3. ✅ Включает server.js для Node.js хостинга
4. ✅ Добавляет .htaccess для Apache
5. ✅ Создает PM2 конфигурацию
6. ✅ Добавляет скрипт быстрого запуска
7. ✅ Генерирует подробную инструкцию по развертыванию

---

## Содержимое архива

```
belka-flowers/
├── *.html                      # Все предрендеренные страницы
├── _next/                      # Next.js runtime
├── images/                     # Все изображения (~2GB)
├── api/                        # API endpoints
├── server.js                   # Node.js сервер
├── package.json                # Package info
├── .htaccess                   # Apache конфигурация
├── .env.example                # Пример настроек
├── manifest.json               # PWA манифест
├── robots.txt                  # SEO
├── sitemap.xml                 # Карта сайта
├── ecosystem.config.js         # PM2 конфигурация
├── start.sh                    # Быстрый запуск
└── README-DEPLOYMENT.txt       # Инструкция по развертыванию
```

---

## Размер архива

- **Несжатый:** ~2.0 GB
- **Сжатый (tar.gz):** ~2.0 GB (изображения уже оптимизированы)

---

## Использование архива

### На сервере с Node.js:

```bash
tar -xzf belka-flowers-deploy-*.tar.gz
cd belka-flowers
node server.js
```

### С PM2:

```bash
tar -xzf belka-flowers-deploy-*.tar.gz
cd belka-flowers
pm2 start ecosystem.config.js
```

### На Apache:

```bash
tar -xzf belka-flowers-deploy-*.tar.gz
mv belka-flowers/* /var/www/html/
```

---

## Дополнительная документация

- **QUICK-DEPLOY.md** - Краткое руководство по развертыванию
- **DEPLOYMENT.md** - Полное руководство со всеми вариантами
- **README-DEPLOYMENT.txt** (внутри архива) - Инструкция для пользователя

---

## Примечания

- Архив не коммитится в git (добавлен в .gitignore)
- Архив готов к развертыванию "из коробки"
- Не требует установки зависимостей
- Работает на любом хостинге с Node.js >= 14.0.0
- Также работает на Apache с mod_rewrite
