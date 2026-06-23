import { callFetchRootCategory } from '@/config/api';
import { getHugeIconComponent } from '@/config/utils';
import { ICategory, IModelPaginate } from '@/types/backend';
import { Skeleton, Typography } from 'antd';
import { createElement, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import styles from 'styles/client.module.scss';

type CategorySectionProps = {
    title?: string;
    titleStyle?: CSSProperties;
}

const CategorySection = ({
    title,
    titleStyle = {}
}: CategorySectionProps) => {
    const [rootCategories, setRootCategories] = useState<ICategory[]>([]);
    const [isLoadingRootCategories, setIsLoadingRootCategories] = useState<boolean>(false);

    useEffect(() => {
        fetchRootCategories();
    }, []);

    const fetchRootCategories = async () => {
        setIsLoadingRootCategories(true);
        const res = await callFetchRootCategory('current=1&pageSize=20&sort=createdAt');
        const data = res?.data as unknown as ICategory[] | ICategory | IModelPaginate<ICategory> | undefined;

        if (Array.isArray(data)) {
            setRootCategories(data);
        } else if (data && 'result' in data && Array.isArray(data.result)) {
            setRootCategories(data.result);
        } else if (data && '_id' in data) {
            setRootCategories([data]);
        }

        setIsLoadingRootCategories(false);
    }

    return (
        <section>
            <div className={styles["section-heading"]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, marginBottom: 18 }}>
                <div>
                    <Typography.Text style={{ color: 'var(--primary-color-dark)', fontWeight: 700, textTransform: 'uppercase', fontSize: 16, ...titleStyle }}>
                        {title || 'Khám phá danh mục'}
                    </Typography.Text>
                </div>
            </div>

            <div className={styles["category-chip-cloud"]}>
                {isLoadingRootCategories &&
                    Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton.Button
                            key={index}
                            active
                            size="large"
                            shape="round"
                            className={styles["category-chip-skeleton"]}
                            style={{ width: index % 3 === 0 ? 220 : 180, height: 54 }}
                        />
                    ))
                }

                {!isLoadingRootCategories && rootCategories.map((category) => {
                    const IconComponent = getHugeIconComponent(category.icon);

                    return (
                        <Link
                            key={category._id ?? category.slug}
                            to={`/explore/${category.slug}`}
                            className={styles["category-chip"]}
                        >
                            {IconComponent && createElement(IconComponent, { style: { fontSize: 20, flex: '0 0 auto' } })}
                            <Typography.Text>{category.name}</Typography.Text>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default CategorySection;
