import { useMemo, useState } from 'react';
import { AutoComplete, Button, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import debounce from 'lodash/debounce';
import styles from '@/styles/client.module.scss';

const SearchClient = () => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<any[]>([]);

    const searchCourse = async (keyword: string) => {
        if (!keyword?.trim()) {
            setOptions([]);
            return;
        }

        try {
            /**
             * TODO:
             * Thay bằng API thật của bạn
             */

            // const res = await courseApi.search(keyword);

            // Demo data
            const courses = [
                'React JS cơ bản',
                'React Native',
                'NestJS Backend',
                'Spring Boot',
                'MongoDB Mastery',
            ].filter((item) =>
                item.toLowerCase().includes(keyword.toLowerCase())
            );

            setOptions(
                courses.map((item) => ({
                    value: item,
                    label: item,
                }))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const debouncedSearch = useMemo(
        () => debounce(searchCourse, 500),
        []
    );

    const onFinish = async (values: any) => {
        console.log(values);

        /**
         * Ví dụ:
         * router.push(`/courses?keyword=${values.keyword}`);
         */
    };

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
                render: () => null,
            }}
        >
            <div className={styles.searchBox}>
                <ProForm.Item
                    name="keyword"
                    noStyle
                >
                    <AutoComplete
                        className={styles.searchInput}
                        placeholder="Bạn muốn học gì?"
                        options={options}
                        onSearch={debouncedSearch}
                        filterOption={false}
                    />
                </ProForm.Item>

                <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    style={{backgroundColor: 'var(--primary-color-dark)'}}
                    icon={<SearchOutlined />}
                    onClick={() => form.submit()}
                />
            </div>
        </ProForm>
    );
};

export default SearchClient;