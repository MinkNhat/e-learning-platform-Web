import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row } from 'antd';
import styles from 'styles/client.module.scss';
import CourseCard from '@/components/client/card/job.card';

const ClientCoursePage = (props: any) => {
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <SearchClient />
                </Col>
                <Divider />

                <Col span={24}>
                    <CourseCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientCoursePage;