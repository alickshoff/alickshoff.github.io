# 🚀 БЫСТРЫЙ СТАРТ - Установка плагина Lampa

## ⚡ 1 минутная установка

### Шаг 1: Загрузьте файлы плагина

Скачайте эти файлы:
- `lampa-plugin.js` - основной плагин
- `lampa-plugin.css` - стили
- `plugin-utils.js` - утилиты (опционально)
- `config.json` - конфигурация

### Шаг 2: Скопируйте в папку Lampa

**Для Linux/Mac:**
```bash
mkdir -p ~/.local/share/lampa/plugins
cp lampa-plugin.js ~/.local/share/lampa/plugins/
cp lampa-plugin.css ~/.local/share/lampa/plugins/
```

**Для Windows:**
```cmd
mkdir "%APPDATA%\Lampa\plugins"
copy lampa-plugin.js "%APPDATA%\Lampa\plugins\"
copy lampa-plugin.css "%APPDATA%\Lampa\plugins\"
```

### Шаг 3: Подключите в HTML

Если используете Lampa как веб-приложение, добавьте в HTML:

```html
<!-- Загрузить утилиты -->
<script src="path/to/plugin-utils.js"></script>

<!-- Загрузить стили -->
<link rel="stylesheet" href="path/to/lampa-plugin.css">

<!-- Загрузить плагин -->
<script src="path/to/lampa-plugin.js"></script>
```

### Шаг 4: Перезагрузите Lampa

Закройте и откройте Lampa заново.

✅ **Плагин установлен!**

---

## 🔑 Получение API ключей

### TMDB (The Movie Database)

1. Зайдите на https://www.themoviedb.org/settings/api
2. Выберите **Create an API Key**
3. Согласитесь с условиями
4. Получите API ключ
5. Скопируйте ключ в `config.json`:

```json
{
  "sources": {
    "movies": [
      {
        "id": "tmdb",
        "apiKey": "ВАШ_КЛЮЧ_ЗДЕСЬ"
      }
    ]
  }
}
```

### OMDB (Open Movie Database)

1. Зайдите на http://www.omdbapi.com/apikey.aspx
2. Выберите **Free** или **Paid**
3. Введите email
4. Подтвердите email
5. Скопируйте ключ в конфиг

---

## 📺 Первый запуск

1. Откройте Lampa
2. Перейдите в меню → найдите **"Развлечения"**
3. Выберите нужную категорию:
   - 🎬 Фильмы
   - 📺 Сериалы
   - 📡 IPTV
   - ⭐ Новинки
   - 🔞 18+

---

## ⚙️ Базовая настройка

### Изменить источник контента

Отредактируйте `config.json`:

```json
{
  "sources": {
    "movies": [
      {
        "id": "tmdb",
        "apiKey": "YOUR_KEY"
      }
    ]
  }
}
```

### Добавить IPTV плейлист

```json
{
  "sources": {
    "iptv": [
      {
        "name": "Мой плейлист",
        "playlistUrl": "http://example.com/playlist.m3u8"
      }
    ]
  }
}
```

### Включить родительский контроль

```javascript
// В консоли браузера (F12):
localStorage.setItem('lampa_parental_control', 'true');
localStorage.setItem('lampa_parental_pin', '1234');
```

---

## 🛠️ Решение проблем

### Плагин не появляется в меню

**Решение:**
1. Убедитесь, что файлы находятся в правильной папке
2. Проверьте консоль (F12) на ошибки
3. Перезагрузите Lampa полностью (закройте все окна)
4. Очистите кэш браузера

### "API Key не валиден"

**Решение:**
1. Проверьте, правильно ли скопирован ключ
2. Убедитесь, что ключ активирован на сайте API
3. Для TMDB ключ должен быть **v3 API Key**

### Видео не воспроизводится

**Решение:**
1. Проверьте интернет соединение
2. Убедитесь, что источник видео доступен
3. Попробуйте другой источник контента
4. Используйте браузер Chrome/Firefox (Chromium-based)

### IPTV каналы не загружаются

**Решение:**
1. Проверьте URL плейлиста
2. Убедитесь, что плейлист в формате M3U
3. Попробуйте другой плейлист
4. Проверьте доступность сервера

---

## 📱 Использование на разных устройствах

### Android
1. Используйте Lampa для Android из Play Store
2. Установите плагин аналогично (в папке приложения)
3. Перезагрузите приложение

### Apple TV
1. Используйте Lampa для tvOS
2. Скопируйте плагин в папку приложения
3. Используйте пульт для навигации

### Raspberry Pi
1. Установите Lampa на Raspberry Pi
2. Скопируйте плагин в `/home/pi/.local/share/lampa/plugins/`
3. Запустите Lampa

### Smart TV
1. Установите Lampa (если поддерживается)
2. Установите плагин
3. Используйте пульт TV для управления

---

## 🎬 Быстрые команды

### JavaScript консоль (F12)

```javascript
// Показать список фильмов
window.plugin.showMovies();

// Показать сериалы
window.plugin.showSeries();

// Показать IPTV
window.plugin.showIPTV();

// Показать новинки
window.plugin.showTrending();

// Очистить кэш
window.plugin.cache = {};

// Получить информацию о плагине
console.log(window.plugin);

// Показать логи
console.log('[Lampa Plugin]');
```

---

## 🌐 Добавление своего источника контента

```javascript
// В консоли браузера:

const mySource = {
    id: 'my_api',
    name: 'Мой API',
    api: 'https://my-api.com',
    apiKey: 'my_key'
};

window.plugin.sources.movies.push(mySource);
```

---

## 📚 Дополнительные ресурсы

- 📖 [Полная документация](./README.md)
- 💻 [Примеры кода](./examples.js)
- ⚙️ [Утилиты](./plugin-utils.js)
- 🎨 [Стили](./lampa-plugin.css)

---

## 💬 Получить помощь

1. **Проверьте логи** - Откройте консоль (F12) и посмотрите ошибки
2. **Читайте документацию** - Найдите ответ в README.md
3. **Ищите примеры** - Посмотрите examples.js
4. **Форум Lampa** - Задайте вопрос на forums.lampa.app

---

## 🎯 Что дальше?

Установка завершена! Теперь вы можете:

✅ Смотреть фильмы и сериалы  
✅ Включать IPTV каналы  
✅ Добавлять свои источники  
✅ Пользоваться родительским контролем  
✅ Сохранять историю просмотров  
✅ Искать контент  
✅ Получать рекомендации  

---

**Наслаждайтесь просмотром! 🎬📺🍿**

Версия: 1.0.0  
Дата: 2024  
Лицензия: MIT
