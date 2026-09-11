import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';

const Navbar = ({ userData }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
        }
    }, [token]);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');

        messageApi.success('Logout successful');

        // Redirect to login page
        navigate('/login');

        setIsLoggedIn(false);
    };

    return (
        <>
            {contextHolder}

            <nav className="navbar">

                <h1 className="logo">
                    <Link to="/">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-amd"
                            viewBox="0 0 16 16"
                        >
                            <path d="m.334 0 4.358 4.359h7.15v7.15l4.358 4.358V0zM.2 9.72l4.487-4.488v6.281h6.28L6.48 16H.2z" />
                        </svg>
                        LOGO
                    </Link>
                </h1>

                <div
                    className={`menu-icon ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-list"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                        />
                    </svg>
                </div>

                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>

                    {/* Home */}
                    <li className="nav-item" onClick={toggleMenu}>
                        <Link to="/">Home</Link>
                    </li>

                    {/* About */}
                    <li className="nav-item" onClick={toggleMenu}>
                        <Link to="/about">About</Link>
                    </li>

                    {/* Services */}
                    <li className="nav-item" onClick={toggleMenu}>
                        <Link to="/services">Services</Link>
                    </li>

                    {/* Contact */}
                    <li className="nav-item" onClick={toggleMenu}>
                        <Link to="/contact">Contact</Link>
                    </li>

                    {isLoggedIn ? (
                        <>
                            {/* User Profile */}
                            <li
                                className="nav-item"
                                onClick={toggleMenu}
                            >
                                <Link to="/user-profile">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-person-circle"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                        <path
                                            fillRule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 1 8 1"
                                        />
                                    </svg>

                                    {userData?.first_name}
                                </Link>
                            </li>

                            {/* Logout */}
                            <li
                                className="nav-item"
                                onClick={toggleMenu}
                            >
                                <Button onClick={handleLogout}>
                                    Logout
                                </Button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Login */}
                            <li
                                className="nav-item"
                                onClick={toggleMenu}
                            >
                                <Link to="/login">Login</Link>
                            </li>
                        </>
                    )}

                </ul>
            </nav>
        </>
    );
};

export default Navbar;
