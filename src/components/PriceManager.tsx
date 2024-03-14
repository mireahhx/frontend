import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "../style/notification.css"
import "../style/price.css"

const API_BASE_URL = 'https://api.micmaclaynd.ru/api/analytics'

interface PriceDetails {
    id: number
    price: number
    location: {
        id: number
        name: string
        parentId: number
        userId: number
    }
    category: {
        id: number
        name: string
        parentId: number
        userId: number
    }
    matrix: {
        id: number
        name: string
        userId: number
    }
}

const PriceManager: React.FC = () => {
    const [categoryName, setCategoryName] = useState<string>('')
    const [locationName, setLocationName] = useState<string>('')
    const [matrixName, setMatrixName] = useState<string>('')
    const [price, setPrice] = useState<number>(0)
    const [priceDetails, setPriceDetails] = useState<PriceDetails | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' })

    const search = (prefix: string, name: string, datalistId: string) => {
        if (name) {
            axios.get(`https://avito.micmaclaynd.ru/api/analytics/${prefix}/search`, {
                params: {
                    name, limit: 10, offset: 0
                }
            }).then(result => result.data).then(data => {
                let datalist = document.querySelector(datalistId)
                if (datalist) {
                    datalist.innerHTML = ''
                    for (let category of data.result) {
                        let option = document.createElement('option')
                        option.value = category.name
                        datalist.appendChild(option)
                        console.log(category)
                    }
                }
            })
        }
    }

    useEffect(() => {
        search('categories', categoryName, '#categoryDataList')
    }, [categoryName])

    useEffect(() => {
        search('locations', locationName, '#locationDataList')
    }, [locationName])

    useEffect(() => {
        search('matrices', matrixName, '#matrixDataList')
    }, [matrixName])

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

    const handleAddPrice = async () => {
        try {
            const response = await axios.post(`https://avito.micmaclaynd.ru/api/analytics/price/add`, {
                categoryName,
                locationName,
                matrixName,
                price
            })
            if (response.data.isSuccess) {
                showNotification('success', "Цена успешно добавлена")
                setPriceDetails(response.data.result)
            } else {
                showNotification('error', "Ошибка при добавлении цены")
            }
        } catch (error) {
            console.error('Error sending add price request:', error)
            showNotification('error', "Please try again later.")
        }
    }

    const handleGetPrice = async () => {
        try {
            const response = await axios.get(`https://avito.micmaclaynd.ru/api/analytics/price/get`, {
                params: { categoryName, locationName }
            })
            if (response.data.isSuccess) {
                setPriceDetails(response.data.result)
            } else {
                showNotification('error', "Ошибка при получении цены")
            }
        } catch (error) {
            console.error('Error getting price details:', error)
            showNotification('error', "Ошибка при получении цены")
        }
    }

    return (
        <div className="price-manager">
            {notification.type && (
                <div className={`notification ${notification.type === 'success' ? 'notification-success' : 'notification-error'}`}>
                    {notification.message}
                </div>
            )}
            <div>
                <input
                    type="text"
                    list='categoryDataList'
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <datalist id='categoryDataList'/>
                <input
                    type="text"
                    list='locationDataList'
                    placeholder="Location Name"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                />
                <datalist id='locationDataList'/>
                <input
                    type="text"
                    list='matrixDataList'
                    placeholder="Matrix Name"
                    value={matrixName}
                    onChange={(e) => setMatrixName(e.target.value)}
                />
                <datalist id='matrixDataList'/>
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <button onClick={handleAddPrice}>Добавить цену</button>
                <button onClick={handleGetPrice}>Получить детали</button>
            </div>
            {priceDetails && (
                <div>
                    <h3>Детали</h3>
                    <p>ID: {priceDetails.id}</p>
                    <p>Price: {priceDetails.price}</p>
                    <p>Location: {priceDetails.location.name}</p>
                    <p>Category: {priceDetails.category.name}</p>
                    <p>Matrix: {priceDetails.matrix.name}</p>
                </div>
            )}
        </div>
    )
}

export default PriceManager
