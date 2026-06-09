import { Breadcrumb } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface IClientBreadcrumbItem {
    title: ReactNode;
    path?: string;
}

interface IClientBreadcrumbProps {
    items: IClientBreadcrumbItem[];
    className?: string;
    style?: CSSProperties;
    variant?: 'default' | 'light';
}

const ClientBreadcrumb = ({ items, className, style, variant = 'default' }: IClientBreadcrumbProps) => {
    const isLight = variant === 'light';
    const linkStyle: CSSProperties = isLight ? { color: '#d1d5db' } : {};
    const currentStyle: CSSProperties = isLight ? { color: '#fff' } : {};

    return (
        <Breadcrumb
            className={className}
            style={style}
            separator={isLight ? <span style={{ color: '#9ca3af' }}>&gt;</span> : undefined}
            items={items.map((item) => ({
                title: item.path
                    ? <Link to={item.path} style={linkStyle}>{item.title}</Link>
                    : <span style={currentStyle}>{item.title}</span>,
            }))}
        />
    );
};

export default ClientBreadcrumb;
