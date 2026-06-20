import { useState, useEffect, useRef } from 'react';
import { DashOutlined, LogoutOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Avatar, Divider, Drawer, Dropdown, Grid, MenuProps, Space, message } from 'antd';
import { Menu } from 'antd';
import styles from '@/styles/client.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import SearchClient from './search.client';

type HeaderNavItem = {
    label: string;
    path: string;
};

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
    const screens = Grid.useBreakpoint();
    const isMobileLayout = !screens.md;

    const [current, setCurrent] = useState('home');
    const navLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });
    const location = useLocation();

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const publicNavItems: HeaderNavItem[] = [
        {
            label: 'Trang Chủ',
            path: '/',
            
        },
        {
            label: 'Khám phá',
            path: '/explore',
        },
        {
            label: 'Trình độ',
            path: '/levels',
        }
    ];

    const privateNavItems: HeaderNavItem[] = [
        {
            label: 'Khoá học của tôi',
            path: '/my-courses',
        },
    ];

    const navItems: HeaderNavItem[] = isAuthenticated
        ? [...publicNavItems, ...privateNavItems]
        : publicNavItems;

    const drawerNavItems: MenuProps['items'] = navItems.map(item => ({
        label: <Link to={item.path}>{item.label}</Link>,
        key: item.path,
    }));

    useEffect(() => {
        const updateActiveIndicator = () => {
            const activeLink = navLinkRefs.current[current];

            if (!activeLink) {
                setActiveIndicator({ left: 0, width: 0 });
                return;
            }

            setActiveIndicator({
                left: activeLink.offsetLeft + 2,
                width: Math.max(activeLink.offsetWidth - 4, 0),
            });
        };

        updateActiveIndicator();
        window.addEventListener('resize', updateActiveIndicator);

        return () => window.removeEventListener('resize', updateActiveIndicator);
    }, [current, isAuthenticated, isMobileLayout]);

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        setOpenMobileMenu(false);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown: MenuProps['items'] = [
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

    const loginItem: MenuProps['items'] = [
        {
            label: <Link to={'/login'}>Đăng Nhập</Link>,
            key: '/login',
        }
    ];

    const mobileAccountItems: MenuProps['items'] = isAuthenticated
        ? itemsDropdown
        : loginItem;

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobileLayout ?
                        <div className={styles['header-desktop']}>
                            <div className={styles['brand']} onClick={() => navigate('/')}>
                                <img 
                                    src="/capy-logo.png" 
                                    alt="Logo" 
                                    className={styles['logo']}
                                />
                            </div>
                            <div className={styles['top-menu']}>
                                <div className={styles['menu']}>
                                    <nav className={styles['nav-menu']}>
                                        {navItems.map(item => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                ref={(element) => {
                                                    navLinkRefs.current[item.path] = element;
                                                }}
                                                className={`${styles['nav-link']} ${current === item.path ? styles['active'] : ''}`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                        <span
                                            className={styles['active-indicator']}
                                            style={{
                                                left: activeIndicator.left,
                                                width: activeIndicator.width,
                                            }}
                                        />
                                    </nav>
                                    <div className={styles['search-wrapper']}>
                                        <SearchClient />
                                    </div>
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
                            <div className={styles['brand']} onClick={() => navigate('/')}>
                                <img 
                                    src="/capy-logo.png" 
                                    alt="Logo" 
                                    className={styles['logo']}
                                />
                            </div>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>
            <Drawer title="Chức năng"
                placement="right"
                width="70%"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={drawerNavItems}
                />
                <Divider className={styles['mobile-menu-divider']} />
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={mobileAccountItems}
                />
            </Drawer>
        </>
    )
};

export default Header;
