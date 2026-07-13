import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect, type MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import { navigateWithAuthTransition } from './auth-transition';
import { SOCIAL_AUTH_CALLBACK_PATH, SOCIAL_LOGIN_CALLBACK_KEY, type SocialProvider } from './social-auth';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    const location = useLocation();
    const callback = new URLSearchParams(location.search).get("callback");

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/';
        }
    }, [])

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user))
            message.success('Đăng nhập tài khoản thành công!');
            window.location.href = callback ? callback : '/';
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    const handleSocialLogin = (provider: SocialProvider) => {
        if (callback) {
            sessionStorage.setItem(SOCIAL_LOGIN_CALLBACK_KEY, callback);
        } else {
            sessionStorage.removeItem(SOCIAL_LOGIN_CALLBACK_KEY);
        }

        const redirectUrl = new URL(SOCIAL_AUTH_CALLBACK_PATH, window.location.origin);
        redirectUrl.searchParams.set('provider', provider);

        const authUrl = new URL(`/api/v1/auth/${provider}`, import.meta.env.VITE_BACKEND_URL);
        authUrl.searchParams.set('redirect_uri', redirectUrl.toString());

        window.location.href = authUrl.toString();
    };

    const handleUnavailableProvider = (provider: string) => {
        notification.info({
            message: `${provider} chưa khả dụng`,
            description: 'Bạn có thể đăng nhập bằng phương thức khác trong thời gian chờ đợi',
            duration: 3
        });
    };

    const handleRegisterNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigateWithAuthTransition(navigate, '/register', 'to-register');
    };


    return (
        <div className={styles["login-page"]}>
            <main>
                <div className={styles["login-container"]}>
                    <section className={styles["login-shell"]}>
                        <div className={styles["login-panel"]}>
                            <div className={styles.heading}>
                                <h3 className={styles["text-large"]}>Đăng nhập</h3>
                            </div>
                            <Form
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                                layout="vertical"
                                className={styles["login-form"]}
                            >
                                <Form.Item
                                    label="Email"
                                    name="username"
                                    rules={[
                                        { required: true, message: 'Email không được để trống!' },
                                        { type: 'email', message: 'Email không hợp lệ!' }
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password size="large" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isSubmit}
                                        block
                                        size="large"
                                        className={styles["login-submit"]}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>

                                <p className={styles["signup-copy"]}>Chưa có tài khoản?
                                    <Link to='/register' onClick={handleRegisterNavigate}> Đăng ký</Link>
                                </p>

                                <Divider className={styles["social-divider"]}>Hoặc đăng nhập bằng</Divider>

                                <div className={styles["social-options"]}>
                                    <button
                                        type="button"
                                        className={styles["social-button"]}
                                        onClick={() => handleSocialLogin('google')}
                                        aria-label="Đăng nhập với Google"
                                    >
                                        <img src="/google.svg" alt="" className={styles["provider-icon"]} />
                                    </button>
                                    <button
                                        type="button"
                                        className={styles["social-button"]}
                                        onClick={() => handleUnavailableProvider('Apple')}
                                        aria-label="Đăng nhập với Apple"
                                    >
                                        <img src="/apple.svg" alt="" className={styles["provider-icon"]} />
                                    </button>
                                    <button
                                        type="button"
                                        className={styles["social-button"]}
                                        onClick={() => handleSocialLogin('facebook')}
                                        aria-label="Đăng nhập với Facebook"
                                    >
                                        <img src="/facebook.svg" alt="" className={styles["provider-icon"]} />
                                    </button>
                                </div>
                            </Form>
                        </div>
                        <aside className={styles["login-visual"]} aria-label="Không gian học tập trực tuyến">
                            <img src="/login.png" alt="Minh họa đăng nhập nền phong cảnh" />
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;
