import React, { useState } from 'react'
import axios from 'axios'
import "../style/notification.css"
import "../style/locations.css"

interface Location {
    id: number
    name: string
    parentId: number
    userId: number
}

const LocationManager: React.FC = () => {
    const [name, setName] = useState<string>('')
    const [parentName, setParentName] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [locations, setLocations] = useState<Location[]>([])
    const [location, setLocation] = useState<Location | null>(null)
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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setSearchTerm(value)
        if (value.trim()) {
            searchLocations(value)
        } else {
            setLocations([])
        }
    }

    const searchLocations = async (search: string, limit: number = 10, offset: number = 0) => {
        try {
            const response = await axios.get(`https://avito.micmaclaynd.ru/api/analytics/locations/search`, {
                params: { name: search, limit, offset }
            })
            if (response.data.isSuccess && Array.isArray(response.data.result)) {
                setLocations(response.data.result)
            } else {
                console.error('Search error:', response.data.error)
                setLocations([])
            }
        } catch (error) {
            console.error('Search request error:', error)
            setLocations([])
        }
    }

    const handleAddLocation = async () => {
        const payload = {
            parentName: parentName,
            names: [name]
        }
        try {
            const response = await axios.post(`https://avito.micmaclaynd.ru/api/analytics/locations/add`, payload)
            if (response.data.isSuccess) {
                setName('')
                setParentName('')
                showNotification('success', "Локация успешно добавлена")
            } else {
                showNotification('error', "Произошла ошибка в добавлении локации")
            }
        } catch (error) {
            console.error('Error sending add location request:', error)
            showNotification('error', "Please try again later.")
        }
    }

    const handleGetLocation = async (locationName: string) => {
        try {
            const response = await axios.get(`https://avito.micmaclaynd.ru/api/analytics/locations/get`, {
                params: { name: locationName }
            })
            if (response.data.isSuccess && response.data.result) {
                setLocation(response.data.result)
                showNotification('success', "Локация успешно найдена")
            } else {
                showNotification('error', "Локация не найдена")
                setLocation(null)
            }
        } catch (error) {
            console.error('Error getting location details:', error)
            showNotification('error', "Please try again later.")
            setLocation(null)
        }
    }

    return (
        <div className="location-manager">
            {notification.type && (
                <div className={`notification ${notification.type === 'success' ? 'notification-success' : 'notification-error'}`}>
                    {notification.message}
                </div>
            )}
            <div>
                <input
                    type="text"
                    placeholder="Поиск локации..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button onClick={() => handleGetLocation(searchTerm)}>Получить местоположение</button>
                {locations.length > 0 ? (
                    <ul>
                        {locations.map((location) => (
                            <li key={location.id}>{location.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p></p>
                )}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Имя родительского местоположения (оставьте пустым для root)"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Название местоположения"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleAddLocation}>Добавить местоположение</button>
            </div>
            {location && (
                <div>
                    <h3>Детали</h3>
                    <p>ID: {location.id}</p>
                    <p>Name: {location.name}</p>
                    <p>Parent ID: {location.parentId}</p>
                    <p>User ID: {location.userId}</p>
                </div>
            )}
        </div>
    )
}

export default LocationManager
