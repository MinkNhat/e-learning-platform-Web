import { useState, useEffect, useRef } from 'react';
import { ArrowRight01Icon, Logout01Icon, Menu01Icon, MoreHorizontalIcon } from '@/config/hugeicons';
import { Avatar, Divider, Drawer, Dropdown, Grid, MenuProps, Space, message } from 'antd';
import { Menu } from 'antd';
import styles from '@/styles/client.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callFetchChildCategory, callFetchRootCategory, callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import SearchClient from './search.client';
import { ICategory } from '@/types/backend';

type HeaderNavItem = {
    label: string;
    path: string;
};

const getActiveNavPath = (pathname: string) => {
    if (pathname.startsWith('/explore')) return '/explore';
    if (pathname.startsWith('/blog')) return '/blog';

    return pathname;
};

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
    const screens = Grid.useBreakpoint();
    const isMobileLayout = !screens.md;

    const [current, setCurrent] = useState('home');
    const navLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const navMenuRef = useRef<HTMLElement | null>(null);
    const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });
    const location = useLocation();
    const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);
    const [rootCategories, setRootCategories] = useState<ICategory[]>([]);
    const [hoveredRootSlug, setHoveredRootSlug] = useState('');
    const [childrenByRoot, setChildrenByRoot] = useState<Record<string, ICategory[]>>({});
    const [searchClearSignal, setSearchClearSignal] = useState(0);

    const clearHeaderSearch = () => setSearchClearSignal((currentSignal) => currentSignal + 1);

    const resolveAvatarUrl = (avatar?: string, authProvider?: string) => {
        if (!avatar) return undefined;

        const normalizedAvatar = avatar.trim();
        if (!normalizedAvatar) return undefined;

        const hasAbsoluteUrl = /^[a-z][a-z\d+\-.]*:/i.test(normalizedAvatar) || normalizedAvatar.startsWith('//');
        if (hasAbsoluteUrl) return normalizedAvatar;

        const normalizedProvider = authProvider?.trim().toLowerCase();
        if (normalizedProvider && normalizedProvider !== 'local') {
            return normalizedAvatar;
        }

        if (!BASE_URL) return normalizedAvatar;

        if (normalizedAvatar.startsWith('/')) {
            return `${BASE_URL}${normalizedAvatar}`;
        }

        if (normalizedAvatar.startsWith('upload/')) {
            return `${BASE_URL}/${normalizedAvatar}`;
        }

        return `${BASE_URL}/upload/avatars/${normalizedAvatar}`;
    };

    const renderAvatarSrc = (avatar?: string, authProvider?: string) => {
        const avatarUrl = resolveAvatarUrl(avatar, authProvider);
        if (!avatarUrl) return undefined;

        const normalizedProvider = authProvider?.trim().toLowerCase();
        if (normalizedProvider && normalizedProvider !== 'local') {
            return <img src={avatarUrl} alt={user?.name || 'avatar'} referrerPolicy="no-referrer" />;
        }

        return avatarUrl;
    };

    useEffect(() => {
        setCurrent(getActiveNavPath(location.pathname));
    }, [location])

    useEffect(() => {
        const fetchRootCategories = async () => {
            const res = await callFetchRootCategory('current=1&pageSize=30&sort=createdAt');
            const categories = res?.data ?? [];

            setRootCategories(categories);
            setHoveredRootSlug((currentSlug) => currentSlug || categories[0]?.slug || '');
        };

        fetchRootCategories();
    }, []);

    useEffect(() => {
        if (!hoveredRootSlug || childrenByRoot[hoveredRootSlug]) return;

        const fetchChildren = async () => {
            const res = await callFetchChildCategory(hoveredRootSlug);
            setChildrenByRoot((currentMap) => ({
                ...currentMap,
                [hoveredRootSlug]: res?.data ?? [],
            }));
        };

        fetchChildren();
    }, [childrenByRoot, hoveredRootSlug]);

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
            label: 'Diễn đàn',
            path: '/blog',
        },
        // {
        //     label: 'Trình độ',
        //     path: '/levels',
        // }
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
            const navMenu = navMenuRef.current;

            if (!activeLink || !navMenu) {
                setActiveIndicator({ left: 0, width: 0 });
                return;
            }

            const activeLinkRect = activeLink.getBoundingClientRect();
            const navMenuRect = navMenu.getBoundingClientRect();

            setActiveIndicator({
                left: activeLinkRect.left - navMenuRect.left + 2,
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
        clearHeaderSearch();
    };

    const handleLogout = async () => {
        clearHeaderSearch();
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const canAccessAdmin = user?.role?.name?.trim().toUpperCase() !== 'USER';
    const itemsDropdown: MenuProps['items'] = [
        ...(canAccessAdmin
            ? [{
                label: 'Trang Quản Trị',
                key: 'admin',
                icon: <MoreHorizontalIcon />
            }]
            : []),
        {
            label: 'Đăng xuất',
            key: 'logout',
            icon: <Logout01Icon />
        },
    ];

    const onAccountDropdownClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'admin') {
            clearHeaderSearch();
            navigate('/admin');
            return;
        }

        if (key === 'logout') {
            handleLogout();
        }
    };

    const loginItem: MenuProps['items'] = [
        {
            label: <Link to={'/login'} onClick={clearHeaderSearch}>Đăng Nhập</Link>,
            key: '/login',
        }
    ];

    const mobileAccountItems: MenuProps['items'] = isAuthenticated
        ? itemsDropdown
        : loginItem;

    const onMobileAccountClick: MenuProps['onClick'] = (info) => {
        onClick(info);

        if (isAuthenticated) {
            onAccountDropdownClick(info);
        }
    };

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobileLayout ?
                        <div className={styles['header-desktop']}>
                            <div className={styles['brand']} onClick={() => {
                                clearHeaderSearch();
                                navigate('/');
                            }}>
                                <img 
                                    src="/capy-logo.png" 
                                    alt="Logo" 
                                    className={styles['logo']}
                                />
                            </div>
                            <div className={styles['top-menu']}>
                                <div className={styles['menu']}>
                                    <nav className={styles['nav-menu']} ref={navMenuRef}>
                                        {navItems.map(item => {
                                            if (item.path === '/explore') {
                                                const activeRoot = rootCategories.find(category => category.slug === hoveredRootSlug);
                                                const childCategories = hoveredRootSlug ? childrenByRoot[hoveredRootSlug] ?? [] : [];

                                                return (
                                                    <div
                                                        key={item.path}
                                                        className={styles['explore-nav-wrap']}
                                                        onMouseEnter={() => setIsExploreMenuOpen(true)}
                                                        onMouseLeave={() => setIsExploreMenuOpen(false)}
                                                    >
                                                        <Link
                                                            to={item.path}
                                                            ref={(element) => {
                                                                navLinkRefs.current[item.path] = element;
                                                            }}
                                                            className={`${styles['nav-link']} ${current === item.path ? styles['active'] : ''}`}
                                                            onClick={clearHeaderSearch}
                                                        >
                                                            {item.label}
                                                        </Link>

                                                        {isExploreMenuOpen && !isMobileLayout &&
                                                            <div className={styles['explore-mega-menu']}>
                                                                <div className={styles['explore-root-menu']}>
                                                                    {rootCategories.map(category => (
                                                                        <Link
                                                                            key={category._id ?? category.slug}
                                                                            to={`/explore/${category.slug}`}
                                                                            className={`${styles['explore-menu-item']} ${hoveredRootSlug === category.slug ? styles['active'] : ''}`}
                                                                            onMouseEnter={() => category.slug && setHoveredRootSlug(category.slug)}
                                                                            onClick={() => {
                                                                                clearHeaderSearch();
                                                                                setIsExploreMenuOpen(false);
                                                                            }}
                                                                        >
                                                                            <span>{category.name}</span>
                                                                            <ArrowRight01Icon />
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                                <div className={styles['explore-child-menu']}>
                                                                    {childCategories.length > 0 ?
                                                                        childCategories.map(category => (
                                                                            <Link
                                                                                key={category._id ?? category.slug}
                                                                                to={`/explore/${category.slug}`}
                                                                                className={styles['explore-menu-item']}
                                                                                onClick={() => {
                                                                                    clearHeaderSearch();
                                                                                    setIsExploreMenuOpen(false);
                                                                                }}
                                                                            >
                                                                                <span>{category.name}</span>
                                                                            </Link>
                                                                        ))
                                                                        :
                                                                        <Link
                                                                            to={activeRoot ? `/explore/${activeRoot.slug}` : '/explore'}
                                                                            className={styles['explore-menu-empty']}
                                                                            onClick={() => {
                                                                                clearHeaderSearch();
                                                                                setIsExploreMenuOpen(false);
                                                                            }}
                                                                        >
                                                                            Xem tất cả trong danh mục này
                                                                        </Link>
                                                                    }
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    ref={(element) => {
                                                        navLinkRefs.current[item.path] = element;
                                                    }}
                                                    className={`${styles['nav-link']} ${current === item.path ? styles['active'] : ''}`}
                                                    onClick={clearHeaderSearch}
                                                >
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                        <span
                                            className={styles['active-indicator']}
                                            style={{
                                                left: activeIndicator.left,
                                                width: activeIndicator.width,
                                            }}
                                        />
                                    </nav>
                                    <div className={styles['search-wrapper']}>
                                        <SearchClient clearSignal={searchClearSignal} />
                                    </div>
                                </div>
                                
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <Link to={'/login'} onClick={clearHeaderSearch}>Đăng Nhập</Link>
                                        :
                                        <Dropdown menu={{ items: itemsDropdown, onClick: onAccountDropdownClick }} trigger={['click']}>
                                            <Space style={{ cursor: "pointer" }}>
                                                <span>Welcome {user?.name}</span>
                                                <Avatar src={renderAvatarSrc(user?.avatar, user?.authProvider)}> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                                            </Space>
                                        </Dropdown>
                                    }

                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']}>
                            <div className={styles['brand']} onClick={() => {
                                clearHeaderSearch();
                                navigate('/');
                            }}>
                                <img 
                                    src="/capy-logo.png" 
                                    alt="Logo" 
                                    className={styles['logo']}
                                />
                            </div>
                            <Menu01Icon onClick={() => setOpenMobileMenu(true)} />
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
                    onClick={onMobileAccountClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={mobileAccountItems}
                />
            </Drawer>
        </>
    )
};

export default Header;
