create TABLE category(id SERIAL PRIMARY KEY,code INTEGER,name VARCHAR(255));

create TABLE product(id SERIAL PRIMARY KEY,name VARCHAR(255),price DECIMAL(10, 2),category_id INTEGER,FOREIGN KEY (category_id) REFERENCES category(id),);

create TABLE category(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255),
	created_at timestamp,
	image VARCHAR(255),
	name_en VARCHAR(255),
	global_category_id INTEGER,
	FOREIGN KEY (global_category_id) REFERENCES global_category(id)
);

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
	name VARCHAR(255),
	created_at timestamp,
	image VARCHAR(255),
	name_en VARCHAR(255),
    categories INTEGER[]
);

-- Поиск по элементу массива (например элемент = 5)

-- 1 способ
SELECT * FROM my_table
WHERE 5 = ANY(my_array);

-- 2 способ
SELECT * FROM my_table
WHERE my_array @> ARRAY[5];

DROP TABLE table_name;








В Next.js можно использовать транслитерацию для создания SEO-дружественных URL с русскими словами. Для этого можно воспользоваться библиотекой `transliteration`, которая предоставляет удобные функции для транслитерации текста.

Вот пример, как можно использовать транслитерацию в Next.js:

1. **Установите библиотеку `transliteration`**:

```bash
npm install transliteration
```

2. **Создайте функцию для транслитерации**:

Создайте файл `utils/transliterate.js` и добавьте следующий код:

```javascript
import { transliterate as tr } from 'transliteration';

export function transliterate(text) {
    return tr(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
```

Эта функция принимает текст на русском языке, транслитерирует его в латиницу, приводит к нижнему регистру и заменяет все неалфавитно-цифровые символы на дефисы.

3. **Используйте функцию транслитерации в маршрутах**:

Предположим, у вас есть динамический маршрут для статей, и вы хотите использовать транслитерированные заголовки в URL.

Создайте файл `pages/articles/[slug].js`:

```javascript
import { useRouter } from 'next/router';
import { transliterate } from '../../utils/transliterate';

const articles = [
    { id: 1, title: 'Первая статья', content: 'Содержание первой статьи' },
    { id: 2, title: 'Вторая статья', content: 'Содержание второй статьи' },
];

export default function ArticlePage() {
    const router = useRouter();
    const { slug } = router.query;

    const article = articles.find(a => transliterate(a.title) === slug);

    if (!article) {
        return <div>Статья не найдена</div>;
    }

    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.content}</p>
        </div>
    );
}

export async function getStaticPaths() {
    const paths = articles.map(article => ({
        params: { slug: transliterate(article.title) },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const article = articles.find(a => transliterate(a.title) === params.slug);

    return {
        props: {
            article,
        },
    };
}
```

В этом примере:

- `getStaticPaths` генерирует пути для статической генерации страниц на основе транслитерированных заголовков статей.
- `getStaticProps` получает данные статьи на основе транслитерированного заголовка.
- `ArticlePage` отображает содержимое статьи, если она найдена.

Теперь вы можете переходить по URL, содержащим транслитерированные заголовки статей, например:

- `/articles/pervaya-statya`
- `/articles/vtoraya-statya`

Этот подход позволяет создавать SEO-дружественные URL с русскими словами, преобразованными в латиницу.