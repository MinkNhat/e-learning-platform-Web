import { useMemo } from 'react';
import { Button, Result, Space } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const paymentResult = useMemo(() => {
        const success = searchParams.get('success') === 'true';
        const isValid = searchParams.get('isValid') === 'true';

        return {
            success,
            isValid,
            code: searchParams.get('code') || '',
            courseId: searchParams.get('courseId') || '',
            orderId: searchParams.get('orderId') || '',
            txnRef: searchParams.get('txnRef') || '',
        };
    }, [searchParams]);

    const goHome = () => {
        navigate('/', { replace: true });
    };

    const startLearning = () => {
        navigate(paymentResult.courseId ? `/course/${paymentResult.courseId}` : '/course', { replace: true });
    };

    if (paymentResult.success && paymentResult.isValid) {
        return (
            <Result
                status="success"
                title="Thanh toán thành công"
                subTitle="Khóa học đã được thêm vào tài khoản của bạn."
                extra={
                    <Space>
                        <Button key="home" onClick={goHome}>
                            Về trang chủ
                        </Button>
                        <Button type="primary" key="learn" onClick={startLearning}>
                            Bắt đầu học ngay
                        </Button>
                    </Space>
                }
            />
        );
    }

    return (
        <Result
            status="error"
            title="Thanh toán chưa hoàn tất"
            subTitle={`Mã phản hồi: ${paymentResult.code || 'Không xác định'}`}
            extra={[
                <Button key="home" onClick={goHome}>
                    Về trang chủ
                </Button>,
                <Button type="primary" key="course" onClick={startLearning}>
                    Quay lại khóa học
                </Button>,
            ]}
        />
    );
};

export default PaymentResultPage;
