# Lampa Entertainment Plugin - Полное руководство

## 📋 Описание

Мощный плагин для приложения **Lampa**, добавляющий функциональность для просмотра:
- 🎬 Фильмов
- 📺 Сериалов  
- 📡 IPTV каналов
- ⭐ Новинок и трендов
- 🔞 Контента 18+ (с родительским контролем)

## 🚀 Установка

### Способ 1: Прямая установка (рекомендуется)

1. Скопируйте файлы плагина в папку расширений Lampa:
```bash
# Linux/Mac
cp lampa-plugin.js ~/.local/share/lampa/plugins/
cp lampa-plugin.css ~/.local/share/lampa/plugins/

# Windows
copy lampa-plugin.js "%APPDATA%\Lampa\plugins\"
copy lampa-plugin.css "%APPDATA%\Lampa\plugins\"
```

2. Перезагрузите Lampa

### Способ 2: Через пакетный менеджер

```bash
npm install lampa-entertainment-plugin
```

### Способ 3: Ручная установка

1. Откройте Lampa
2. Перейдите в **Настройки → Плагины → Установить плагин**
3. Укажите путь к файлу `lampa-plugin.js`
4. Подтвердите установку

## ⚙️ Конфигурация

### Основные настройки

Создайте файл `config.json` в папке плагина:

```json
{
  "sources": {
    "movies": [
      {
        "name": "The Movie Database",
        "api": "https://api.themoviedb.org/3",
        "apiKey": "YOUR_API_KEY_HERE"
      }
    ],
    "iptv": [
      {
        "name": "IPTV Source 1",
        "url": "http://example.com/playlist.m3u8",
        "timeout": 5000
      }
    ]
  },
  "settings": {
    "defaultQuality": "1080p",
    "enableSubtitles": true,
    "saveHistory": true,
    "cacheSize": 500,
    "parentalControl": {
      "enabled": false,
      "pin": "1234"
    }
  }
}
```

### API Ключи

#### The Movie Database (TMDB)
1. Зарегистрируйтесь на https://www.themoviedb.org/
2. Перейдите в настройки → API
3. Скопируйте ваш API ключ
4. Вставьте в конфиг

#### Open Movie Database (OMDB)
1. Зарегистрируйтесь на http://www.omdbapi.com/
2. Получите бесплатный API ключ
3. Вставьте в конфиг

## 📖 Использование

### Основное меню

После установки плагин будет доступен в главном меню:

```
Развлечения
├── 🎬 Фильмы
├── 📺 Сериалы
├── 📡 IPTV
├── ⭐ Новинки
└── 🔞 18+ (защищено PIN)
```

### Просмотр фильмов

1. **Выберите фильм** из каталога
2. **Применяйте фильтры**:
   - По жанру
   - По году выпуска
   - По рейтингу
3. **Нажмите на карточку** для подробной информации
4. **Кликните "Смотреть"** для воспроизведения

### Просмотр сериалов

1. **Выберите сериал**
2. **Выберите сезон и серию**
3. **Смотрите с субтитрами** (если доступны)
4. **Отслеживание прогресса** - плагин сохраняет, где вы остановились

### Просмотр IPTV

1. **Загрузка плейлистов** в формате M3U
2. **Выбор канала** из списка
3. **Мгновенное воспроизведение**
4. **Быстрая переключение** между каналами

### Родительский контроль (18+)

#### Включение:

```javascript
// В консоли браузера:
localStorage.setItem('lampa_parental_control', 'true');
localStorage.setItem('lampa_parental_pin', '1234');
```

#### Использование:

При попытке доступа к контенту 18+ будет запрошен PIN-код.

## 🎨 Настройка внешнего вида

### Изменение темы цвета

Отредактируйте переменные в `lampa-plugin.css`:

```css
/* Основной цвет */
:root {
    --primary-color: #00d4ff;
    --primary-dark: #00a8cc;
    --background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    --card-background: rgba(42, 42, 78, 0.8);
}
```

### Размер сетки карточек

Изменить в CSS:

```css
.lampa-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    /* Увеличьте 180px для больших карточек */
}
```

## 🔌 Добавление своих источников

### Пример: Добавление нового источника фильмов

```javascript
// В файле lampa-plugin.js добавьте в функцию initializeSources():

this.sources.movies.push({
    id: 'my_source',
    name: 'My Custom Source',
    api: 'https://api.mysource.com/v1',
    apiKey: 'YOUR_API_KEY',
    parseFunction: async (response) => {
        // Ваша функция обработки ответа
        return response.data.map(item => ({
            title: item.name,
            poster: item.image_url,
            rating: item.score,
            year: item.release_year,
            description: item.overview,
            url: item.watch_url
        }));
    }
});
```

### Пример: Добавление IPTV плейлиста

```javascript
// Добавьте в конфиг:
{
    "iptv": [
        {
            "name": "My IPTV",
            "url": "http://example.com/my-playlist.m3u8"
        }
    ]
}
```

## 🎬 Примеры интеграции

### Интеграция с вашим сервером

```javascript
// Замените URL API на свой сервер
async apiRequest(endpoint, params) {
    const query = new URLSearchParams(params);
    const url = `https://your-domain.com/api${endpoint}?${query}`;
    // ... остальной код
}
```

### Добавление собственного плеера

```javascript
createPlayer(item) {
    // Используйте ваш любимый плеер
    // Поддерживаемые форматы: HLS, DASH, MP4
    const player = new YourCustomPlayer({
        url: item.url,
        title: item.title,
        subtitles: item.subtitles
    });
}
```

## 📱 Кэширование и производительность

### Управление кэшем

```javascript
// Очистить весь кэш
localStorage.clear();

// Или через плагин:
window.LampaPlugin.cache = {};
```

### Оптимизация для медленного интернета

В конфиге установите меньший размер кэша:

```json
{
    "settings": {
        "cacheSize": 100,
        "cacheTimeout": 1800000
    }
}
```

## 🔐 Безопасность

### Хранение API ключей

⚠️ **НИКОГДА** не добавляйте API ключи прямо в код на клиенте!

Вместо этого:

1. **Используйте backend сервер** как прокси
2. **Сохраняйте ключи** на сервере, не на клиенте
3. **Используйте переменные окружения**

```bash
# Пример для Linux/Mac
export TMDB_API_KEY="your_key_here"
```

## 🐛 Решение проблем

### Плагин не загружается

1. Проверьте консоль браузера (F12)
2. Убедитесь, что файлы находятся в правильной папке
3. Перезагрузите Lampa полностью

### Видео не воспроизводится

- Проверьте формат видео (поддерживаются HLS, DASH, MP4)
- Убедитесь, что URL видео доступен
- Проверьте CORS настройки вашего сервера

### IPTV каналы не загружаются

- Проверьте, доступен ли M3U плейлист
- Убедитесь, что URL правильный
- Проверьте интернет соединение

### Ошибка "API Key не валиден"

- Проверьте API ключ в конфиге
- Убедитесь, что ключ активирован
- Возможно, истёк лимит запросов (подождите)

## 📊 Статистика и мониторинг

```javascript
// Получить статистику использования:
console.log(window.LampaPlugin.stats);

// Проверить размер кэша:
console.log(JSON.stringify(window.LampaPlugin.cache).length / 1024 + ' KB');
```

## 🌐 Поддерживаемые форматы

### Видео
- HLS (.m3u8)
- DASH (.mpd)
- MP4 (.mp4)
- WebM (.webm)

### Субтитры
- SRT (.srt)
- VTT (.vtt)
- ASS (.ass)

### Изображения
- JPEG, PNG, WebP
- SVG

## 📚 Дополнительные ресурсы

- [Документация Lampa](https://lampa.app)
- [TMDB API Docs](https://developers.themoviedb.org/3)
- [MDN Web Docs](https://developer.mozilla.org/)

## 💬 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте этот файл README
2. Посмотрите логи в консоли браузера
3. Проверьте форум Lampa
4. Откройте issue на GitHub

## 📄 Лицензия

MIT License - Свободное использование в личных и коммерческих целях

## ✨ Особенности

✅ Поддержка множества источников контента
✅ Встроенное кэширование для быстрой загрузки
✅ Родительский контроль с PIN кодом
✅ Адаптивный интерфейс для всех устройств
✅ Поддержка субтитров на множестве языков
✅ История просмотров
✅ Рекомендации на основе просмотров
✅ Интеграция с различными API
✅ Тёмная тема с нееоновым стилем
✅ Быстрая навигация и поиск

## 🎯 Планы развития

- [ ] Интеграция с Kodi
- [ ] Синхронизация просмотров между устройствами
- [ ] Рекомендательная система на основе ML
- [ ] Поддержка торрентов
- [ ] Встроенный торрент-клиент
- [ ] Социальные функции (шеринг, комментарии)
- [ ] Виджеты для рабочего стола

---

**Наслаждайтесь просмотром! 🎬**
