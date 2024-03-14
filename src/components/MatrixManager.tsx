import React, { useState } from 'react'
import axios from 'axios'
import "../style/matrix.css"
import "../style/notification.css"

const API_BASE_URL = 'https://api.micmaclaynd.ru/api/analytics'

interface Matrix {
    id: number
    name: string
    userId: number
}

const MatrixManager: React.FC = () => {
    const [name, setName] = useState<string>('')
    const [matrix, setMatrix] = useState<Matrix | null>(null)
    const [matrices, setMatrices] = useState<Matrix[]>([])
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' })

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => {
            document.querySelector('.notification')?.classList.add('notification-show')
        }, 10)

        setTimeout(() => {
            document.querySelector('.notification')?.classList.remove('notification-show')
            setTimeout(() => {
                setNotification({ type: '', message: '' })
            }, 500)
        }, 5000)
    }

    const handleAddMatrix = async () => {
        try {
            const response = await axios.post(`https://avito.micmaclaynd.ru/api/analytics/matrices/add`, { name })
            if (response.data.isSuccess) {
                showNotification('success', "Матрица успешно добавлена")
                setMatrix(response.data.result)
            } else {
                showNotification('error', "Ошибка добавления матрицы")
            }
        } catch (error) {
            console.error('Error sending add matrix request:', error)
            showNotification('error', "Please try again later.")
        }
    }

    const handleGetMatrix = async (matrixName: string) => {
        try {
            const response = await axios.get(`https://avito.micmaclaynd.ru/api/analytics/matrices/get`, {
                params: { name: matrixName }
            })
            if (response.data.isSuccess) {
                setMatrix(response.data.result)
            } else {
                showNotification('error', "Ошибка получения матрицы")
            }
        } catch (error) {
            console.error('Error getting matrix details:', error)
            showNotification('error', "Please try again later.")
        }
    }

    const searchMatrices = async (search: string, limit: number = 10, offset: number = 0) => {
        try {
            const response = await axios.get(`https://avito.micmaclaynd.ru/api/analytics/matrices/search`, {
                params: { name: search, limit, offset }
            })
            if (response.data.isSuccess) {
                setMatrices(response.data.result)
            } else {
                console.error('Search error:', response.data.error)
                setMatrices([])
            }
        } catch (error) {
            console.error('Search request error:', error)
            setMatrices([])
        }
    }

    return (
        <div className="matrix-manager">
            {notification.type && (
                <div className={`notification ${notification.type === 'success' ? 'notification-success' : 'notification-error'}`}>
                    {notification.message}
                </div>
            )}
            <div>
                <input
                    type="text"
                    placeholder="Название матрицы"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleAddMatrix}>Добавить матрицу</button>
                <button onClick={() => handleGetMatrix(name)}>Получить матрицу</button>
                <button onClick={() => searchMatrices(name)}>Найти матрицу</button>
            </div>
            <div>
                {matrix && (
                    <div>
                        <h3>Matrix Details</h3>
                        <p>ID: {matrix.id}</p>
                        <p>Name: {matrix.name}</p>
                        <p>User ID: {matrix.userId}</p>
                    </div>
                )}
                <ul>
                    {matrices.map((m, index) => (
                        <li key={index}>Name: {m.name}, ID: {m.id}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default MatrixManager
