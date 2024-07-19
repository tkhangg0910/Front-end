import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHome, FaSun, FaMoon, FaBars, FaBook } from 'react-icons/fa';
import { CiLogout, CiTrophy, CiSettings } from 'react-icons/ci';
import { MdOutlineManageHistory } from 'react-icons/md';
import axiosUrl from '../../AxiosConfig';
import '../styles/Aside.css';

const Aside = ({ role, id }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const bodyEl = document.querySelector('body');
    const navigate = useNavigate();

    const toggleSideBar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        bodyEl.classList.toggle('dark');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');
        navigate('/login');
    };

    useEffect(() => {
        if (!role || !id) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await axiosUrl.get('/api/users/get-user', {
                    headers: {
                        user_id: id,
                        role: role
                    }
                });

                console.log('API Response:', res);

                if (role === 'student') {
                    const { first_name, last_name, avatar } = res.data;
                    console.log('Student Data:', { first_name, last_name, avatar });
                    setUserInfo({ name: `${first_name} ${last_name}`, avatar });
                } else {
                    const { corpName, avatar } = res.data;
                    console.log('Corp Data:', { corpName, avatar });
                    setUserInfo({ name: corpName, avatar });
                }
                setLoading(false);
            } catch (err) {
                console.error('Verification failed: ', err);
                // You might want to set some error state here
                setLoading(false);  // Set loading to false to prevent infinite loop
            }
        };

        fetchUserData();

        // Cleanup function
        return () => {
            setUserInfo({});
        };
    }, [role, id, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`sidebar ${isSidebarOpen ? '' : 'close'}`}>
            <header className='flex flex-col'>
                <div className="flex justify-end items-center my-3 mx-3">
                    <FaBars className='toggle' onClick={toggleSideBar}></FaBars>
                </div>
                <div className="image-text py-2">
                    <span className="image">
                        <img src={userInfo.avatar} alt="User Avatar" />
                    </span>
                    <div className="text logo-text">
                        <span className="name">{userInfo.name || 'Loading...'}</span>
                        <span className="profession">{role.toUpperCase()}</span>
                    </div>
                </div>
            </header>
            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                        <li className="nav-link">
                            <Link to='/'>
                                <FaHome className="icon" />
                                <span className="text nav-text">Home</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to='/competition'>
                                <CiTrophy className="icon" />
                                <span className="text nav-text">Competition</span>
                            </Link>
                        </li>
                        {role === 'student' ? (
                            <li className="nav-link">
                                <Link to='/your-contest'>
                                    <FaBook className="icon" />
                                    <span className="text nav-text">Your Contest</span>
                                </Link>
                            </li>
                        ) : (
                            <li className="nav-link">
                                <Link to='/manage-contest'>
                                    <MdOutlineManageHistory className="icon" />
                                    <span className="text nav-text">Manage Contest</span>
                                </Link>
                            </li>
                        )}
                        <li className="nav-link">
                            <Link to='/profile'>
                                <FaUser className="icon" />
                                <span className="text nav-text">Profile</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to='/settings'>
                                <CiSettings className="icon" />
                                <span className="text nav-text">Settings</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="bottom-content cursor-pointer">
                    <li className="nav-link" onClick={handleLogout}>
                        <CiLogout className='icon' />
                        <span className="text nav-text">Logout</span>
                    </li>
                    <li className="mode" onClick={toggleDarkMode}>
                        <div className="sun-moon">
                            {isDarkMode ? <FaSun className='icon' /> : <FaMoon className='icon' />}
                        </div>
                        <span className="mode-text text">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                        <div className="toggle-switch">
                            <span className="switch"></span>
                        </div>
                    </li>
                </div>
            </div>
        </div>
    );
};

export default Aside;
