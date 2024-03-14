import React from 'react'
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import CategoriesManager from './components/CategoriesManager'
import LocationManager from './components/LocationManager'
import Login from './components/Login'
import MatrixManager from './components/MatrixManager'
import PriceManager from './components/PriceManager'
import Registration from './components/Registration'
import './style/App.scss'


const App: React.FC = () => {
    return (
        <Router basename='admin'>
            <div className='main'>
                <div className='top-menu'>
                    <Link className='nav-link' to='/categories'>Категории</Link>
                    <Link className='nav-link' to='/locations'>Локации</Link>
                    <Link className='nav-link' to='/matrices'>Матрицы</Link>
                    <Link className='nav-link' to='/prices'>Цены</Link>
                </div>
                <div className='container'>
                    <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Registration />} />
                        <Route path='/categories' element={<CategoriesManager />} />
                        <Route path='/locations' element={<LocationManager />} />
                        <Route path='/matrices' element={<MatrixManager />} />
                        <Route path='/prices' element={<PriceManager />} />
                        <Route path='*' element={<Navigate to={'/register'} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App