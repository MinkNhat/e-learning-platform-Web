import { useEffect, useRef } from 'react';
import { message, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { callFetchAccount } from '@/config/api';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import { getSocialProvider, SOCIAL_LOGIN_CALLBACK_KEY, SOCIAL_PROVIDER_LABEL } from './social-auth';

const SocialLoginSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasHandledLogin = useRef(false);

    useEffect(() => {
        const handleLoginSuccess = async () => {
            if (hasHandledLogin.current) return;
            hasHandledLogin.current = true;

            const accessToken = searchParams.get('access_token');
            const errorMessage = searchParams.get('error');
            const provider = getSocialProvider(searchParams.get('provider'));
            const providerLabel = SOCIAL_PROVIDER_LABEL[provider];
            const callback = sessionStorage.getItem(SOCIAL_LOGIN_CALLBACK_KEY) || '/';

            sessionStorage.removeItem(SOCIAL_LOGIN_CALLBACK_KEY);

            if (errorMessage || !accessToken) {
                message.error(errorMessage || `Đăng nhập ${providerLabel} thất bại.`);
                navigate('/login', { replace: true });
                return;
            }

            localStorage.setItem('access_token', accessToken);

            const res = await callFetchAccount();
            if (res?.data?.user) {
                dispatch(setUserLoginInfo(res.data.user));
                message.success(`Đăng nhập ${providerLabel} thành công!`);
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

export default SocialLoginSuccessPage;
