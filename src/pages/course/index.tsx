import CourseSection from '@/components/client/section/course.section';
import { callFetchCourse } from '@/config/api';
import { ICourse } from '@/types/backend';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import styles from 'styles/client.module.scss';

const ClientCoursePage = (props: any) => {
    const [courses, setCourses] = useState<ICourse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    useEffect(() => {
        fetchCourse();
    }, [current, pageSize, filter, sortQuery]);

    const fetchCourse = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchCourse(query);
        if (res && res.data) {
            setCourses(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    const handleChangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    }

    const handleChangeFilter = (value: string) => {
        setFilter(value);
        setCurrent(1);
    }

    const handleChangeSort = (value: string) => {
        setSortQuery(value);
        setCurrent(1);
    }

    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`} style={{ marginTop: 28, marginBottom: 56 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CourseSection
                        courses={courses}
                        isLoading={isLoading}
                        showPagination={true}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        filter={filter}
                        sortQuery={sortQuery}
                        onChangePage={handleChangePage}
                        onChangeFilter={handleChangeFilter}
                        onChangeSort={handleChangeSort}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientCoursePage;
