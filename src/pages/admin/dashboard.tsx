import { Card, Col, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import { useEffect, useState } from "react";
import { callFetchDashboardStats } from "@/config/api";
import { IDashboardStats } from "@/types/backend";

const DashboardPage = () => {
    const [stats, setStats] = useState<IDashboardStats>({
        users: 0,
        courses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        blogs: 0,
        enrollments: 0,
        orders: 0,
        payments: 0,
    });

    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };

    useEffect(() => {
        const init = async () => {
            const res = await callFetchDashboardStats();
            if (res.data) setStats(res.data);
        };

        init();
    }, []);

    return (
        <Row gutter={[20, 20]}>
            <Col span={24} md={8}>
                <Card title="Users" bordered={false}>
                    <Statistic title="Total users" value={stats.users} formatter={formatter} />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Courses" bordered={false}>
                    <Statistic title="Total courses" value={stats.courses} formatter={formatter} />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Blogs" bordered={false}>
                    <Statistic title="Total blogs" value={stats.blogs} formatter={formatter} />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Enrollments" bordered={false}>
                    <Statistic title="Total enrollments" value={stats.enrollments} formatter={formatter} />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Orders" bordered={false}>
                    <Statistic title="Total orders" value={stats.orders} formatter={formatter} />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Payments" bordered={false}>
                    <Statistic title="Total payments" value={stats.payments} formatter={formatter} />
                </Card>
            </Col>
        </Row>
    )
}

export default DashboardPage;
