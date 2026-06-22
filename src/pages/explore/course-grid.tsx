import CourseCard from '@/components/client/card/course.card';
import type { ICourse } from '@/types/backend';
import { Card, Col, Empty, Row, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from 'styles/explore.module.scss';

type CourseGridProps = {
    courses: ICourse[];
    isLoading: boolean;
    emptyDescription: string;
};

const CourseGrid = ({ courses, isLoading, emptyDescription }: CourseGridProps) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Row gutter={[18, 18]}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card className={styles["course-skeleton-card"]}>
                            <Skeleton active title={{ width: '88%' }} paragraph={{ rows: 4 }} />
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    }

    if (!courses.length) {
        return (
            <div className={styles["empty-block"]}>
                <Empty description={emptyDescription} />
            </div>
        );
    }

    return (
        <Row gutter={[18, 18]}>
            {courses.map((course) => (
                <Col xs={24} sm={12} lg={6} key={course._id ?? course.slug ?? course.title}>
                    <CourseCard
                        course={course}
                        onClick={() => course.slug && navigate(`/course/${course.slug}`)}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default CourseGrid;
