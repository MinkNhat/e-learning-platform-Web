import CourseSection from '@/components/client/section/course.section';
import { Col, Divider, Row } from 'antd';
import styles from 'styles/client.module.scss';

const ClientCoursePage = (props: any) => {
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CourseSection showPagination={true}/>
                    
                </Col>
            </Row>
        </div>
    )
}

export default ClientCoursePage;