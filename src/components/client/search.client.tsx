import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AutoComplete, Button, Form, Image, Typography } from 'antd';
import { CancelCircleIcon, Search01Icon } from '@/config/hugeicons';
import { ProForm } from '@ant-design/pro-components';
import debounce from 'lodash/debounce';
import styles from '@/styles/client.module.scss';
import { callSearchCourseSuggestions } from '@/config/api';
import { useNavigate } from 'react-router-dom';
import { ICourseSearchResult } from '@/types/backend';

interface SearchClientProps {
    clearSignal?: number;
}

const SearchClient = ({ clearSignal }: SearchClientProps) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<{ value: string; label: ReactNode }[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchKeyword = Form.useWatch('keyword', form) as string | undefined;
    const searchRequestId = useRef(0);
    const navigate = useNavigate();

    const searchCourse = async (keyword: string) => {
        const requestId = ++searchRequestId.current;
        if (!keyword?.trim()) {
            setOptions([]);
            return;
        }

        try {
            const res = await callSearchCourseSuggestions(keyword);
            if (requestId !== searchRequestId.current) return;

            const suggestions = (res?.data?.result ?? [] as ICourseSearchResult[])
                .map((course) => ({
                    value: course.title,
                    label: <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '5px 2px' }}>
                        <Image
                            preview={false}
                            src={course.thumbnail ? `${import.meta.env.VITE_BACKEND_URL || ''}/upload/thumbnails/${course.thumbnail}` : undefined}
                            width={72}
                            height={48}
                            style={{ flex: '0 0 auto', borderRadius: 8, objectFit: 'cover', background: '#eef2f7' }}
                        />
                        <Typography.Text ellipsis style={{ minWidth: 0 }}>{course.title}</Typography.Text>
                    </div>,
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

    const clearSearch = () => {
        debouncedSearch.cancel();
        searchRequestId.current += 1;
        form.setFieldValue('keyword', '');
        setOptions([]);
    };

    useEffect(() => {
        if (clearSignal) clearSearch();
    }, [clearSignal]);

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
                        popupMatchSelectWidth={560}
                        onSearch={debouncedSearch}
                        filterOption={false}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onSelect={(value) => form.setFieldValue('keyword', value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                form.submit();
                            }
                        }}
                    />
                </ProForm.Item>

                {isFocused && (searchKeyword || options.length > 0) && <Button
                    type="text"
                    shape="circle"
                    size="small"
                    aria-label="Xóa nội dung tìm kiếm"
                    title="Xóa nội dung tìm kiếm"
                    style={{ flex: '0 0 auto', color: '#667085', fontSize: 14, lineHeight: 1 }}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={clearSearch}
                    icon={<CancelCircleIcon />}
                />}

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
