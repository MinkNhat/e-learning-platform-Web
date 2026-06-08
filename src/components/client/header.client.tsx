import { useState, useEffect } from 'react';
import { DashOutlined, LogoutOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from 'antd';
import { Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import SearchClient from './search.client';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            
        },
        {
            label: <Link to={'/explore'}>Khám phá</Link>,
            key: '/explore',
            // icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/my-courses'}>Khoá học của tôi</Link>,
            key: '/my-courses',
        },
        {
            label: <Link to={'/levels'}>Trình độ</Link>,
            key: '/levels',
        }
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <Link to={"/admin"}>Trang Quản Trị</Link>,
            key: 'admin',
            icon: <DashOutlined />
        },
        {
            label: 
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles['brand']} onClick={() => navigate('/')}>
                                <img 
                                    src="/capy-logo.png" 
                                    alt="Logo" 
                                    className={styles['logo']}
                                />
                            </div>
                            <div className={styles['top-menu']}>
                                <div className={styles['menu']}>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: 'var(--white-color)',
                                                colorBgContainer: 'var(--white-color)',
                                                colorText: 'var(--text-primary)',
                                            },
                                        }}
                                    >

                                        <Menu
                                            onClick={onClick}
                                            selectedKeys={[current]}
                                            mode="horizontal"
                                            items={items}
                                        />
                                    </ConfigProvider>
                                    <SearchClient />
                                </div>
                                
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <Link to={'/login'}>Đăng Nhập</Link>
                                        :
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                            <Space style={{ cursor: "pointer" }}>
                                                <span>Welcome {user?.name}</span>
                                                <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                                            </Space>
                                        </Dropdown>
                                    }

                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']}>
                            <span>E Learning</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>
            <Drawer title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
        </>
    )
};

export default Header;