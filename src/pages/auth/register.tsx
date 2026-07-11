import { Button, Form, Input, message, notification } from 'antd';
import { useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { navigateWithAuthTransition } from './auth-transition';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: { name: string; email: string; password: string }) => {
        const { name, email, password } = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string);
        setIsSubmit(false);
        if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công!');
            navigateWithAuthTransition(navigate, '/login', 'to-login');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    const handleLoginNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigateWithAuthTransition(navigate, '/login', 'to-login');
    };

    return (
        <div className={styles["register-page"]}>
            <main>
                <div className={styles["login-container"]}>
                    <section className={styles["login-shell"]}>
                        <div className={styles["login-panel"]}>
                            <div className={styles.heading}>
                                <h3 className={styles["text-large"]}>Đăng ký</h3>
                            </div>

                            <Form
                                name="register"
                                onFinish={onFinish}
                                autoComplete="off"
                                layout="vertical"
                                className={styles["login-form"]}
                            >
                                <Form.Item
                                    label="Họ tên"
                                    name="name"
                                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                >
                                    <Input size="large" />
                                </Form.Item>

                                <Form.Item
                                    label="Email"
                                    name="email"
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
                                    hasFeedback
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
                                        Đăng ký
                                    </Button>
                                </Form.Item>

                                <p className={styles["signup-copy"]}>Đã có tài khoản?
                                    <Link to='/login' onClick={handleLoginNavigate}> Đăng nhập</Link>
                                </p>
                            </Form>
                        </div>

                        <aside className={styles["login-visual"]} aria-label="Không gian học tập trực tuyến">
                            <img src="/register.png" alt="Minh họa đăng ký nền phong cảnh" />
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage;
