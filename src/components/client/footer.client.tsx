
import { GlobalIcon } from "@/config/hugeicons";
import { Col, Divider, Row, Select, Space, Typography } from "antd";
import styles from "@/styles/client.module.scss";

const { Text, Title } = Typography;

const footerColumns = [
    {
        title: "Về E-Learning",
        links: ["Giới thiệu nền tảng", "Cơ hội nghề nghiệp", "Liên hệ đội ngũ", "Blog học tập", "Nhà đầu tư"]
    },
    {
        title: "Khám phá",
        links: ["Khóa học nổi bật", "Lộ trình kỹ năng", "Dạy học cùng chúng tôi", "Gói học tập", "Trợ giúp và hỗ trợ"]
    },
    {
        title: "Dành cho tổ chức",
        links: ["E-Learning Business", "Đào tạo đội nhóm", "Giải pháp doanh nghiệp", "Đối tác liên kết", "Tài nguyên giảng viên"]
    }
];

const Footer = () => {
    return (
        <footer
            style={{
                background: "#171923",
                color: "#f7fafc",
                padding: "32px 0 28px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)"
            }}
        >
            <div
                style={{
                    width: "min(1180px, calc(100% - 32px))",
                    margin: "0 auto"
                }}
            >
                <Row gutter={[32, 36]}>
                    {footerColumns.map((column) => (
                        <Col xs={24} sm={12} lg={6} key={column.title}>
                            <Title
                                level={4}
                                style={{
                                    color: "#ffffff",
                                    fontSize: 18,
                                    lineHeight: 1.25,
                                    margin: "0 0 18px",
                                    letterSpacing: 0
                                }}
                            >
                                {column.title}
                            </Title>
                            <Space direction="vertical" size={12}>
                                {column.links.map((link) => (
                                    <a
                                        href="#"
                                        key={link}
                                        style={{
                                            color: "rgba(255, 255, 255, 0.74)",
                                            fontSize: 15,
                                            lineHeight: 1.45,
                                            textDecoration: "none"
                                        }}
                                    >
                                        {link}
                                    </a>
                                ))}
                            </Space>
                        </Col>
                    ))}

                    <Col xs={24} sm={12} lg={6}>
                        <Title
                            level={4}
                            style={{
                                color: "#ffffff",
                                fontSize: 18,
                                lineHeight: 1.25,
                                margin: "0 0 12px",
                                letterSpacing: 0
                            }}
                        >
                            Học mọi lúc, mọi nơi
                        </Title>
                        <Text
                            style={{
                                display: "block",
                                color: "rgba(255, 255, 255, 0.66)",
                                fontSize: 14,
                                lineHeight: 1.6,
                                marginBottom: 18
                            }}
                        >
                            Tải ứng dụng để lưu bài học, theo dõi tiến độ và tiếp tục khóa học ngay trên điện thoại của bạn.
                        </Text>
                        <Space direction="vertical" size={10}>
                            <img
                                src="/dowload-app-store.png"
                                alt="Tải trên App Store"
                                style={{
                                    width: 156,
                                    height: "auto",
                                    display: "block",
                                    borderRadius: 8
                                }}
                            />
                            <img
                                src="/dowload-ch-play.png"
                                alt="Tải trên Google Play"
                                style={{
                                    width: 156,
                                    height: "auto",
                                    display: "block",
                                    borderRadius: 8
                                }}
                            />
                        </Space>
                    </Col>
                </Row>

                <Divider style={{ borderColor: "rgba(255, 255, 255, 0.12)", margin: "40px 0 24px" }} />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                        flexWrap: "wrap"
                    }}
                >
                    <Space size={12} wrap>
                        <img
                            src="/capy-logo.png"
                            alt="E-Learning"
                            style={{
                                width: 42,
                                height: 42,
                                objectFit: "contain",
                                borderRadius: 10,
                                background: "#ffffff"
                            }}
                        />
                        <Text style={{ color: "rgba(255, 255, 255, 0.76)", fontSize: 14 }}>
                            © 2026 E-Learning, Inc
                        </Text>
                    </Space>

                    <Space size={10}>
                        <GlobalIcon style={{ color: "rgba(255, 255, 255, 0.78)", fontSize: 18 }} />
                        <Select
                            className={styles["footer-language-select"]}
                            defaultValue="vi"
                            variant="borderless"
                            style={{
                                width: 138,
                                background: "rgba(255, 255, 255, 0.08)",
                                borderRadius: 8
                            }}
                            options={[
                                { value: "vi", label: "Tiếng Việt" },
                                { value: "en", label: "English" }
                            ]}
                        />
                    </Space>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
