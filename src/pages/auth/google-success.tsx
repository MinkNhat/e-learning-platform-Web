import { useEffect, useRef } from 'react';
import { message, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { callFetchAccount } from '@/config/api';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';

const GoogleLoginSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasHandledLogin = useRef(false);

    useEffect(() => {
        const handleLoginSuccess = async () => {
            if (hasHandledLogin.current) return;
            hasHandledLogin.current = true;

            const accessToken = searchParams.get('access_token');
            const callback = sessionStorage.getItem('google_login_callback') || '/';

            if (!accessToken) {
                message.error('Đăng nhập Google thất bại.');
                navigate('/login', { replace: true });
                return;
            }

            localStorage.setItem('access_token', accessToken);
            sessionStorage.removeItem('google_login_callback');

            const res = await callFetchAccount();
            if (res?.data?.user) {
                dispatch(setUserLoginInfo(res.data.user));
                message.success('Đăng nhập Google thành công!');
                navigate(callback, { replace: true });
                return;
            }

            localStorage.removeItem('access_token');
            message.error(res?.message || 'Không thể lấy thông tin tài khoản.');
            navigate('/login', { replace: true });
        };

        handleLoginSuccess();
    }, [dispatch, navigate, searchParams]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
        </div>
    );
};

export default GoogleLoginSuccessPage;
