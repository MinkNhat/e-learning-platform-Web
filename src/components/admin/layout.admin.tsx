import React, { useState, useEffect } from 'react';
import {
    ApiIcon,
    AppStoreIcon,
    BookOpenIcon,
    CodeIcon,
    ContentWritingIcon,
    Menu01Icon,
    Money01Icon,
    MoreHorizontalIcon,
    OnlineLearning01Icon,
    TagsIcon,
    UserIcon,
} from '@/config/hugeicons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { callLogout } from 'config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { ALL_PERMISSIONS } from '@/config/permissions';

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useAppSelector(state => state.account.user);

    const permissions = useAppSelector(state => state.account.user.permissions);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (permissions?.length) {
            const viewUser = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )

            const viewCourse = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.COURSES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.COURSES.GET_PAGINATE.method
            )

            const viewRole = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
            )

            const viewCategory = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.CATEGORIES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.CATEGORIES.GET_PAGINATE.method
            )

            const viewBlog = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.BLOGS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.BLOGS.GET_PAGINATE.method
            )

            const viewPayment = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.PAYMENTS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.PAYMENTS.GET_PAGINATE.method
            )

            const viewEnrollment = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.ENROLLMENTS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.ENROLLMENTS.GET_PAGINATE.method
            )

            const viewPermission = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.method
            )

            const full = [
                {
                    label: <Link to='/admin'>Dashboard</Link>,
                    key: '/admin',
                    icon: <AppStoreIcon />
                },
                ...(viewUser ? [{
                    label: <Link to='/admin/user'>User</Link>,
                    key: '/admin/user',
                    icon: <UserIcon />
                }] : []),
                ...(viewCourse ? [{
                    label: <Link to='/admin/course'>Course</Link>,
                    key: '/admin/course',
                    icon: <BookOpenIcon />
                }] : []),
                ...(viewCategory ? [{
                    label: <Link to='/admin/category'>Category</Link>,
                    key: '/admin/category',
                    icon: <TagsIcon />
                }] : []),
                ...(viewBlog ? [{
                    label: <Link to='/admin/blog'>Blog</Link>,
                    key: '/admin/blog',
                    icon: <ContentWritingIcon />
                }] : []),
                ...(viewPayment ? [{
                    label: <Link to='/admin/payment'>Payment</Link>,
                    key: '/admin/payment',
                    icon: <Money01Icon />
                }] : []),
                ...(viewEnrollment ? [{
                    label: <Link to='/admin/enrollment'>Enrollment</Link>,
                    key: '/admin/enrollment',
                    icon: <OnlineLearning01Icon />
                }] : []),
                ...(viewPermission ? [{
                    label: <Link to='/admin/permission'>Permission</Link>,
                    key: '/admin/permission',
                    icon: <ApiIcon />
                }] : []),
                ...(viewRole ? [{
                    label: <Link to='/admin/role'>Role</Link>,
                    key: '/admin/role',
                    icon: <MoreHorizontalIcon />
                }] : []),
            ];

            setMenuItems(full);
        }
    }, [permissions])
    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    // if (isMobile) {
    //     items.push({
    //         label: <label
    //             style={{ cursor: 'pointer' }}
    //             onClick={() => handleLogout()}
    //         >Đăng xuất</label>,
    //         key: 'logout',
    //         icon: <Logout01Icon />
    //     })
    // }

    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                {!isMobile ?
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}>
                        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                            <CodeIcon />  ADMIN
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                    :
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                }

                <Layout>
                    {!isMobile &&
                        <div className='admin-header' style={{ display: "flex", justifyContent: "space-between", marginRight: 20 }}>
                            <Button
                                type="text"
                                icon={React.createElement(Menu01Icon)}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />

                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    Welcome {user?.name}
                                    <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>

                                </Space>
                            </Dropdown>
                        </div>
                    }
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    {/* <Footer style={{ padding: 10, textAlign: 'center' }}>
                        React Typescript series Nest.JS &copy; Hỏi Dân IT - Made with <HeartTwoTone />
                    </Footer> */}
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;
