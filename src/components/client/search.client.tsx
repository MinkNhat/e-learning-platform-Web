import { useEffect, useMemo, useState } from 'react';
import { AutoComplete, Button, Form } from 'antd';
import { Search01Icon } from '@/config/hugeicons';
import { ProForm } from '@ant-design/pro-components';
import debounce from 'lodash/debounce';
import styles from '@/styles/client.module.scss';
import { callSearchCourses } from '@/config/api';
import { useNavigate } from 'react-router-dom';

const SearchClient = () => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<any[]>([]);
    const navigate = useNavigate();

    const searchCourse = async (keyword: string) => {
        if (!keyword?.trim()) {
            setOptions([]);
            return;
        }

        try {
            // Backend search also checks module and lesson titles. Fetch its maximum
            // suggestion window, then deliberately retain only course-title matches.
            const res = await callSearchCourses(keyword, 1, 100);
            const suggestions = (res?.data?.result ?? [])
                .filter((course) => course.matches.some((match) => match.type === 'course'))
                .slice(0, 6)
                .map((course) => ({
                    value: course.title,
                    label: course.title,
                }));
            setOptions(suggestions);
        } catch (error) {
            console.error(error);
        }
    };

    const debouncedSearch = useMemo(
        () => debounce(searchCourse, 500),
        []
    );

    useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

    const onFinish = async (values: any) => {
        const keyword = values.keyword?.trim();
        if (keyword) navigate(`/search?q=${encodeURIComponent(keyword)}`);
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
                        onSelect={(value) => form.setFieldValue('keyword', value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                form.submit();
                            }
                        }}
                    />
                </ProForm.Item>

                <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    style={{backgroundColor: 'var(--primary-color-dark)'}}
                    icon={<Search01Icon />}
                    onClick={() => form.submit()}
                />
            </div>
        </ProForm>
    );
};

export default SearchClient;
