const apiKey = '572dff33-797a-4a74-9574-8429aa7c330e'; // Ваш API-ключ The Guardian
const newsContainer = document.getElementById('news-container');
let currentPage = 1; // Текущая страница новостей
let isLoading = false; // Флаг для предотвращения множественных запросов

// Функция для загрузки новостей
async function fetchNews(page = 1) {
    if (isLoading) return; // Если уже загружаем новости, выходим
    isLoading = true;

    try {
        const response = await fetch(`https://content.guardianapis.com/search?show-fields=thumbnail&page=${page}&api-key=${apiKey}`);
        const data = await response.json();
        console.log(data); // Логируем ответ
        if (data.response && data.response.status === "ok") {
            displayNews(data.response.results);
            currentPage++; // Увеличиваем номер страницы для следующей загрузки
        } else {
            console.error('API Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    } finally {
        isLoading = false; // Сбрасываем флаг загрузки
    }
}

// Функция для отображения новостей
function displayNews(articles) {
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        // Миниатюра
        const thumbnail = article.fields?.thumbnail || 'https://via.placeholder.com/300x200'; // Заглушка, если нет изображения
        const image = document.createElement('img');
        image.src = thumbnail;
        image.alt = article.webTitle;

        // Контент
        const content = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = `
            <h2>${article.webTitle}</h2>
            <p>${article.sectionName || ''}</p>
        `;

        // Иконка для перехода к новости
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-external-link-alt', 'icon');
        icon.addEventListener('click', () => {
            window.open(article.webUrl, '_blank'); // Открываем новость в новой вкладке
        });

        // Добавляем элементы в карточку
        newsItem.appendChild(image);
        newsItem.appendChild(content);
        newsItem.appendChild(icon);
        newsContainer.appendChild(newsItem);
    });
}

// Функция для проверки скролла
function checkScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
        fetchNews(currentPage); // Загружаем следующую страницу новостей
    }
}

// Загружаем новости при загрузке страницы
fetchNews(currentPage);

// Добавляем обработчик скролла
window.addEventListener('scroll', checkScroll);