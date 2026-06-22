import {
    ApiOutlined,
    CodeOutlined,
    CompassOutlined,
    DatabaseOutlined,
    Html5Outlined,
    NodeIndexOutlined,
    RocketOutlined,
} from '@ant-design/icons';
import type { Instructor, PathCard, RoleCard } from './types';

const roleImage ='https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/00atxywtfxvd/5rYF1dB5rQdD8Ude60Vcgk/a64d122febc9a54ee56402dd3d012042/Data_Scientist-hero_2x.png';
const pathImage = 'https://files.f8.edu.vn/f8-prod/learning-paths/2/63b4642136f3e.png';

export const roleCards: RoleCard[] = [
    {
        id: 'data-scientist',
        title: 'Nhà khoa học dữ liệu',
        description: 'Phân tích dữ liệu lớn, xây dựng mô hình và trực quan hóa thông tin để hỗ trợ quyết định kinh doanh.',
        img: roleImage,
    },
    {
        id: 'ml-engineer',
        title: 'Kỹ sư học máy',
        description: 'Thiết kế pipeline dữ liệu, huấn luyện mô hình và triển khai AI vào các sản phẩm thực tế.',
        img: roleImage,
    }
];

export const pathCards: PathCard[] = [
    {
        id: 'backend',
        title: 'Lộ trình học Back-end',
        description: 'Hiểu cách thiết kế API, xử lý dữ liệu và vận hành server để làm chủ phần lõi của ứng dụng web.',
        image: pathImage,
        skills: [
            { label: 'API', icon: <ApiOutlined />, progress: 86 },
            { label: 'NodeJS', icon: <NodeIndexOutlined />, progress: 68 },
            { label: 'Database', icon: <DatabaseOutlined />, progress: 54 },
            { label: 'Kiến trúc', icon: <CompassOutlined />, progress: 38 },
            { label: 'Triển khai', icon: <RocketOutlined />, progress: 24 },
        ],
    },
    {
        id: 'fullstack',
        title: 'Lộ trình học Fullstack',
        description: 'Kết hợp frontend, backend, database và triển khai để tự xây dựng một sản phẩm hoàn chỉnh.',
        image: pathImage,
        skills: [
            { label: 'Frontend', icon: <Html5Outlined />, progress: 88 },
            { label: 'Backend', icon: <ApiOutlined />, progress: 72 },
            { label: 'Database', icon: <DatabaseOutlined />, progress: 56 },
            { label: 'React', icon: <CodeOutlined />, progress: 42 },
            { label: 'Deploy', icon: <RocketOutlined />, progress: 30 },
        ],
    },
];

export const mockInstructors: Instructor[] = [
    {
        id: 'ai-coding',
        name: 'AI Coding',
        title: 'Claude Code, Vibe Coding',
        rating: 4.7,
        learners: '14,103 học viên',
        courses: '4 khóa học',
    },
    {
        id: 'linh-nguyen',
        name: 'Linh Nguyen',
        title: 'Amazon AWS, CICD',
        rating: 4.7,
        learners: '7,133 học viên',
        courses: '3 khóa học',
    },
    {
        id: 'thanh-nguyen',
        name: 'Thanh Nguyen',
        title: 'n8n, Generative AI',
        rating: 4.6,
        learners: '8,635 học viên',
        courses: '11 khóa học',
    },
    {
        id: 'bach-canh-ky',
        name: 'Bạch Cảnh Kỳ',
        title: 'Artificial Intelligence',
        rating: 4.7,
        learners: '7,573 học viên',
        courses: '13 khóa học',
    },
];
