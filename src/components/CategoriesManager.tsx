import React, { useState } from 'react';
import axios from 'axios';
import '../style/categories.css';
import '../style/notification.css';

interface CategoryResponse {
    isSuccess: boolean;
    result: Category | Category[];
    error?: string;
}

interface Category {
    id: number;
    name: string;
    parentId?: number;
    userId?: number;
}

const CategoriesManager: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => {
            document.querySelector('.notification')?.classList.add('notification-show');
        }, 10);

        setTimeout(() => {
            document.querySelector('.notification')?.classList.remove('notification-show');
            setTimeout(() => {
                setNotification({ type: '', message: '' });
            }, 500);
        }, 5000);
    };

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (!value) {
            setCategories([]);
            return;
        }
        try {
            const response = await axios.get(`https://avito.micmaclaynd.ru/api/analytics/categories/search`, {
                params: { name: value, limit: 10 }
            });
            // Проверка на успешный ответ и наличие массива в result
            if (response.data.isSuccess && Array.isArray(response.data.result)) {
                setCategories(response.data.result);
            } else {
                console.error('Поиск неудачен или полученные данные не являются массивом', response.data.error);
                setCategories([]);
            }
        } catch (error) {
            console.error('Ошибка поиска категорий:', error);
            setCategories([]);
        }
    };


    const handleAddCategory = async () => {
        const payload = {
            parentName: description,
            names: [name]
        };
        try {
            const response = await axios.post(`https://avito.micmaclaynd.ru/api/analytics/categories/add`, payload);

            if (response.data.isSuccess) {
                setName('');
                showNotification('success', "Категория успешно добавлена")
            } else {
                showNotification('error', "Ошибка при добавлении категории")
                console.error('Ошибка при добавлении категории:', response.data.error);
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса на добавление категории:', error);
        }
    };

    const handleGetCategory = async (name: string) => {
        if (!name) {
            alert('Имя категории не может быть пустым.');
            return;
        }

        try {
            const response = await axios.get<CategoryResponse>(`https://avito.micmaclaynd.ru/api/analytics/categories/get`, {
                params: { name }
            });

            if (response.data.isSuccess) {
                const category = response.data.result;
                if (Array.isArray(category)) {
                    category.forEach(cat => console.log(cat.name));
                } else {
                    console.log(category.name);
                }
            } else {
                alert(`Ошибка при получении категории: ${response.data.error}`);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса на получение категории:', error);
            alert('Произошла ошибка при выполнении запроса на получение категории. Пожалуйста, попробуйте позже.');
        }
    };


    return (
        <div className="category-manager">
            {notification.type && (
                <div className={`notification ${notification.type === 'success' ? 'notification-success' : 'notification-error'}`}>
                    {notification.message}
                </div>
            )}
            <div>
                <input
                    type="text"
                    placeholder="Поиск категорий..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>{category.name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Имя категории"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Родительская категория"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={handleAddCategory}>Добавить категорию</button>
            </div>
        </div>
    );
};

export default CategoriesManager;