/**
 * Lampa Plugin - Utilities & Helpers
 * Вспомогательные функции для плагина
 */

class PluginUtils {
    /**
     * Логирование
     */
    static log(message, type = 'info', data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [Lampa Plugin]`;
        
        switch (type) {
            case 'error':
                console.error(prefix, '❌', message, data || '');
                break;
            case 'warning':
                console.warn(prefix, '⚠️', message, data || '');
                break;
            case 'success':
                console.log(prefix, '✅', message, data || '');
                break;
            default:
                console.log(prefix, 'ℹ️', message, data || '');
        }
    }

    /**
     * Валидация URL
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Получить расширение файла
     */
    static getFileExtension(url) {
        return url.split('.').pop().split('?')[0].toLowerCase();
    }

    /**
     * Преобразование времени в читаемый формат
     */
    static formatTime(seconds) {
        if (!seconds) return '00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    }

    /**
     * Форматирование размера файла
     */
    static formatFileSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Задержка (для async/await)
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Дебаунс функции
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle функции
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Глубокое копирование объекта
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }

    /**
     * Получить значение из вложенного объекта
     */
    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, prop) => 
            current?.[prop], obj);
    }

    /**
     * Установить значение в вложенный объект
     */
    static setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
        target[lastKey] = value;
    }

    /**
     * Генерация уникального ID
     */
    static generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Проверка доступности URL
     */
    static async checkUrlAvailability(url, timeout = 5000) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Сортировка массива объектов
     */
    static sortArray(array, key, ascending = true) {
        return array.sort((a, b) => {
            if (a[key] < b[key]) return ascending ? -1 : 1;
            if (a[key] > b[key]) return ascending ? 1 : -1;
            return 0;
        });
    }

    /**
     * Фильтрация массива по нескольким критериям
     */
    static filterArray(array, filters) {
        return array.filter(item => {
            return Object.keys(filters).every(key => {
                if (typeof filters[key] === 'function') {
                    return filters[key](item[key]);
                }
                return item[key] === filters[key];
            });
        });
    }

    /**
     * Группировка массива по ключу
     */
    static groupArray(array, key) {
        return array.reduce((grouped, item) => {
            const groupKey = item[key];
            if (!grouped[groupKey]) grouped[groupKey] = [];
            grouped[groupKey].push(item);
            return grouped;
        }, {});
    }
}

/**
 * Storage Helper - Управление локальным хранилищем
 */
class StorageHelper {
    constructor(prefix = 'lampa_') {
        this.prefix = prefix;
    }

    /**
     * Сохранить данные
     */
    set(key, value, expireIn = null) {
        const data = {
            value: value,
            timestamp: Date.now(),
            expireAt: expireIn ? Date.now() + expireIn : null
        };
        localStorage.setItem(this.prefix + key, JSON.stringify(data));
    }

    /**
     * Получить данные
     */
    get(key) {
        const item = localStorage.getItem(this.prefix + key);
        if (!item) return null;

        try {
            const data = JSON.parse(item);
            
            // Проверить срок действия
            if (data.expireAt && data.expireAt < Date.now()) {
                this.remove(key);
                return null;
            }
            
            return data.value;
        } catch (error) {
            return null;
        }
    }

    /**
     * Удалить данные
     */
    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    /**
     * Очистить все данные
     */
    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    /**
     * Получить размер хранилища
     */
    getSize() {
        let size = 0;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                size += localStorage.getItem(key).length;
            }
        });
        return size;
    }

    /**
     * Получить все ключи
     */
    getAllKeys() {
        const keys = [];
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                keys.push(key.replace(this.prefix, ''));
            }
        });
        return keys;
    }
}

/**
 * Network Helper - Работа с сетью
 */
class NetworkHelper {
    /**
     * GET запрос
     */
    static async get(url, headers = {}) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Lampa-Plugin/1.0',
                    ...headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            PluginUtils.log(`GET ошибка: ${url}`, 'error', error.message);
            throw error;
        }
    }

    /**
     * POST запрос
     */
    static async post(url, data = {}, headers = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Lampa-Plugin/1.0',
                    ...headers
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            PluginUtils.log(`POST ошибка: ${url}`, 'error', error.message);
            throw error;
        }
    }

    /**
     * Параллельные запросы
     */
    static async parallel(requests, maxConcurrent = 5) {
        const results = [];
        const executing = [];

        for (const request of requests) {
            const promise = Promise.resolve().then(() => request()).then(
                result => {
                    executing.splice(executing.indexOf(promise), 1);
                    return result;
                }
            );

            results.push(promise);
            executing.push(promise);

            if (executing.length >= maxConcurrent) {
                await Promise.race(executing);
            }
        }

        return Promise.all(results);
    }

    /**
     * Retry запрос
     */
    static async retryRequest(fn, maxAttempts = 3, delay = 1000) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxAttempts - 1) throw error;
                await PluginUtils.delay(delay * (i + 1));
            }
        }
    }
}

/**
 * Parser Helper - Парсинг различных форматов
 */
class ParserHelper {
    /**
     * Парсинг M3U плейлиста
     */
    static parseM3U(content) {
        const channels = [];
        const lines = content.split('\n');

        let currentChannel = {};

        for (let line of lines) {
            line = line.trim();

            if (line.startsWith('#EXTINF:')) {
                const match = line.match(/,(.*)$/);
                if (match) {
                    currentChannel.name = match[1];
                    
                    // Парсить атрибуты
                    const logoMatch = line.match(/tvg-logo="([^"]*)"/);
                    if (logoMatch) currentChannel.logo = logoMatch[1];

                    const idMatch = line.match(/tvg-id="([^"]*)"/);
                    if (idMatch) currentChannel.id = idMatch[1];

                    const groupMatch = line.match(/group-title="([^"]*)"/);
                    if (groupMatch) currentChannel.group = groupMatch[1];
                }
            } else if (line && !line.startsWith('#') && line.includes('://')) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = {};
            }
        }

        return channels;
    }

    /**
     * Парсинг XSPF плейлиста
     */
    static parseXSPF(content) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        const tracks = [];

        xmlDoc.querySelectorAll('track').forEach(track => {
            const location = track.querySelector('location')?.textContent;
            const title = track.querySelector('title')?.textContent;
            const image = track.querySelector('image')?.textContent;

            if (location) {
                tracks.push({
                    url: location,
                    name: title || 'Unknown',
                    logo: image
                });
            }
        });

        return tracks;
    }

    /**
     * Парсинг JSON
     */
    static parseJSON(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            PluginUtils.log('JSON парс ошибка', 'error', error.message);
            return null;
        }
    }

    /**
     * Парсинг HTML (базовый)
     */
    static parseHTML(content, selector) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        return doc.querySelectorAll(selector);
    }
}

/**
 * DOM Helper - Работа с DOM
 */
class DOMHelper {
    /**
     * Создать элемент с атрибутами
     */
    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'class') {
                element.className = attributes[key];
            } else if (key === 'style') {
                Object.assign(element.style, attributes[key]);
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    }

    /**
     * Добавить класс с анимацией
     */
    static addClassWithAnimation(element, className, duration = 300) {
        return new Promise(resolve => {
            element.classList.add(className);
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }

    /**
     * Удалить класс с анимацией
     */
    static removeClassWithAnimation(element, className, duration = 300) {
        return new Promise(resolve => {
            element.classList.remove(className);
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }

    /**
     * Показать элемент
     */
    static show(element) {
        element.style.display = '';
    }

    /**
     * Скрыть элемент
     */
    static hide(element) {
        element.style.display = 'none';
    }

    /**
     * Toggle видимость
     */
    static toggle(element) {
        element.style.display = element.style.display === 'none' ? '' : 'none';
    }

    /**
     * Получить позицию элемента
     */
    static getPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    }

    /**
     * Скролл к элементу
     */
    static scrollToElement(element, smooth = true) {
        element.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'center'
        });
    }
}

/**
 * Event Helper - Работа с событиями
 */
class EventHelper {
    constructor() {
        this.events = {};
    }

    /**
     * Подписаться на событие
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * Отписаться от события
     */
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }

    /**
     * Вызвать событие
     */
    emit(eventName, data) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => callback(data));
    }

    /**
     * One-time событие
     */
    once(eventName, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(eventName, wrapper);
        };
        this.on(eventName, wrapper);
    }
}

/**
 * Timer Helper - Работа с таймерами
 */
class TimerHelper {
    constructor() {
        this.timers = {};
    }

    /**
     * Установить таймер
     */
    set(name, fn, delay) {
        this.timers[name] = setTimeout(fn, delay);
    }

    /**
     * Отменить таймер
     */
    clear(name) {
        if (this.timers[name]) {
            clearTimeout(this.timers[name]);
            delete this.timers[name];
        }
    }

    /**
     * Отменить все таймеры
     */
    clearAll() {
        Object.keys(this.timers).forEach(name => this.clear(name));
    }

    /**
     * Установить интервал
     */
    setInterval(name, fn, delay) {
        this.timers[name] = setInterval(fn, delay);
    }

    /**
     * Очистить интервал
     */
    clearInterval(name) {
        if (this.timers[name]) {
            clearInterval(this.timers[name]);
            delete this.timers[name];
        }
    }
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PluginUtils,
        StorageHelper,
        NetworkHelper,
        ParserHelper,
        DOMHelper,
        EventHelper,
        TimerHelper
    };
}
