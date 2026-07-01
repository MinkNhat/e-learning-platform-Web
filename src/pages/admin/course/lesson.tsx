import { useState } from 'react';
import { ICourseItem, ILesson, IQuestion, IQuestionOption, IQuiz } from "@/types/backend";
import {
    callCreateLesson,
    callCreateQuestion,
    callCreateQuiz,
    callDeleteLesson,
    callDeleteQuestion,
    callDeleteQuiz,
    callFetchQuizForManage,
    callUpdateLesson,
    callUpdateQuestion,
    callUpdateQuiz,
} from "@/config/api";
import { Button, Col, Empty, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Switch, Tag, message, notification } from "antd";
import { Add01Icon, Delete02Icon, PencilEdit02Icon } from "@/config/hugeicons";
import CKEditorField from '@/components/share/CKEditorField';

interface LessonManagerProps {
    moduleOrder: number;
    moduleId: string;
    items: ICourseItem[];
    onRefetch: () => Promise<void>;
}

const QUESTION_TYPES = [
    { value: 'single_choice', label: 'Single choice' },
    { value: 'multi_choice', label: 'Multi choice' },
    { value: 'true_false', label: 'True/False' },
    { value: 'fill_blank', label: 'Fill blank' },
];

const getQuestionDefaults = (type: IQuestion['type']) => {
    if (type === 'true_false') {
        return [
            { content: 'True', isCorrect: true, order: 1 },
            { content: 'False', isCorrect: false, order: 2 },
        ];
    }

    return [
        { content: '', isCorrect: true, order: 1 },
        { content: '', isCorrect: false, order: 2 },
    ];
};

const LessonManager = ({ moduleOrder, moduleId, items, onRefetch }: LessonManagerProps) => {
    const sortedItems = [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const maxOrder = sortedItems.length > 0 ? Math.max(...sortedItems.map(item => item.order || 0)) : 0;

    const [openLessonModal, setOpenLessonModal] = useState<boolean>(false);
    const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
    const [lessonType, setLessonType] = useState<ILesson['type']>("video");
    const [lessonForm] = Form.useForm();

    const [openQuizModal, setOpenQuizModal] = useState<boolean>(false);
    const [editingQuiz, setEditingQuiz] = useState<IQuiz | null>(null);
    const [quizForm] = Form.useForm();

    const [openQuestionModal, setOpenQuestionModal] = useState<boolean>(false);
    const [activeQuiz, setActiveQuiz] = useState<IQuiz | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null);
    const [questionType, setQuestionType] = useState<IQuestion['type']>('single_choice');
    const [questionForm] = Form.useForm();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAddLesson = () => {
        setEditingLesson(null);
        setLessonType('video');
        lessonForm.resetFields();
        lessonForm.setFieldsValue({ order: maxOrder + 1, type: 'video', isActive: true, isFree: false });
        setOpenLessonModal(true);
    };

    const handleEditLesson = (lesson: ILesson) => {
        const currentLessonType = (lesson as any).lessonType || lesson.type;
        setEditingLesson(lesson);
        setLessonType(currentLessonType);
        lessonForm.setFieldsValue({
            name: lesson.name,
            type: currentLessonType,
            order: lesson.order,
            isActive: lesson.isActive,
            isFree: lesson.isFree,
            videoUrl: lesson.metadata?.videoUrl,
            content: lesson.content,
        });
        setOpenLessonModal(true);
    };

    const buildLessonPayload = (values: any, includeModule: boolean) => {
        const payload: any = {
            name: values.name,
            type: values.type,
            order: Number(values.order),
            isActive: values.isActive,
            isFree: values.isFree,
            content: values.content,
        };

        if (includeModule) payload.module = moduleId;
        if (values.type === 'video') payload.metadata = { videoUrl: values.videoUrl };

        return payload as ILesson;
    };

    const handleSubmitLesson = async (values: any) => {
        setIsLoading(true);
        try {
            const res = editingLesson?._id
                ? await callUpdateLesson(buildLessonPayload(values, false), editingLesson._id)
                : await callCreateLesson(buildLessonPayload(values, true));

            if (res?.data) {
                message.success(editingLesson?._id ? 'Cập nhật bài học thành công' : 'Tạo bài học thành công');
                setOpenLessonModal(false);
                lessonForm.resetFields();
                await onRefetch();
            }
        } catch (error: any) {
            notification.error({
                message: 'Lỗi',
                description: error?.response?.data?.message || 'Có lỗi xảy ra'
            });
        }
        setIsLoading(false);
    };

    const handleDeleteLesson = async (lessonId: string) => {
        const res = await callDeleteLesson(lessonId);
        if (res?.statusCode === 200) {
            message.success('Xóa bài học thành công');
            await onRefetch();
        }
    };

    const handleAddQuiz = () => {
        setEditingQuiz(null);
        quizForm.resetFields();
        quizForm.setFieldsValue({
            order: maxOrder + 1,
            isActive: true,
            isFree: false,
            passingScore: 70,
            maxAttempts: 1,
            shuffleQuestions: false,
            shuffleOptions: false,
            showResultAfterSubmit: true,
        });
        setOpenQuizModal(true);
    };

    const handleEditQuiz = (quiz: IQuiz) => {
        setEditingQuiz(quiz);
        quizForm.setFieldsValue(quiz);
        setOpenQuizModal(true);
    };

    const handleSubmitQuiz = async (values: any) => {
        setIsLoading(true);
        try {
            const payload: any = {
                title: values.title,
                description: values.description,
                order: Number(values.order),
                isActive: values.isActive,
                isFree: values.isFree,
                timeLimitSeconds: values.timeLimitSeconds,
                passingScore: values.passingScore,
                maxAttempts: values.maxAttempts,
                shuffleQuestions: values.shuffleQuestions,
                shuffleOptions: values.shuffleOptions,
                showResultAfterSubmit: values.showResultAfterSubmit,
            };
            if (!editingQuiz?._id) payload.module = moduleId;

            const res = editingQuiz?._id
                ? await callUpdateQuiz(editingQuiz._id, payload)
                : await callCreateQuiz(payload);

            if (res?.data) {
                message.success(editingQuiz?._id ? 'Cập nhật quiz thành công' : 'Tạo quiz thành công');
                setOpenQuizModal(false);
                quizForm.resetFields();
                await onRefetch();
            }
        } catch (error: any) {
            notification.error({
                message: 'Lỗi',
                description: error?.response?.data?.message || 'Có lỗi xảy ra'
            });
        }
        setIsLoading(false);
    };

    const handleDeleteQuiz = async (quizId: string) => {
        const res = await callDeleteQuiz(quizId);
        if (res?.statusCode === 200) {
            message.success('Xóa quiz thành công');
            await onRefetch();
        }
    };

    const openQuestionManager = async (quiz: IQuiz) => {
        if (!quiz._id) return;
        const res = await callFetchQuizForManage(quiz._id);
        if (res?.data) {
            setActiveQuiz(res.data);
            setOpenQuestionModal(true);
        }
    };

    const handleAddQuestion = () => {
        setEditingQuestion(null);
        setQuestionType('single_choice');
        const nextOrder = activeQuiz?.questions?.length ? Math.max(...activeQuiz.questions.map(item => item.order || 0)) + 1 : 1;
        questionForm.resetFields();
        questionForm.setFieldsValue({
            type: 'single_choice',
            points: 1,
            order: nextOrder,
            options: getQuestionDefaults('single_choice'),
        });
    };

    const handleEditQuestion = (question: IQuestion) => {
        setEditingQuestion(question);
        setQuestionType(question.type);
        questionForm.setFieldsValue({
            ...question,
            acceptedAnswersText: question.acceptedAnswers?.join('; '),
        });
    };

    const refreshActiveQuiz = async () => {
        if (!activeQuiz?._id) return;
        const res = await callFetchQuizForManage(activeQuiz._id);
        if (res?.data) setActiveQuiz(res.data);
    };

    const handleSubmitQuestion = async (values: any) => {
        if (!activeQuiz?._id) return;

        const payload: any = {
            type: values.type,
            content: values.content,
            explanation: values.explanation,
            points: Number(values.points || 1),
            order: Number(values.order),
            caseSensitive: values.caseSensitive,
        };

        if (values.type === 'fill_blank') {
            payload.acceptedAnswers = values.acceptedAnswersText?.split(';').map((item: string) => item.trim()).filter(Boolean);
        } else {
            payload.options = (values.options || []).map((item: IQuestionOption, index: number) => ({
                content: item.content,
                isCorrect: !!item.isCorrect,
                order: Number(item.order || index + 1),
            }));
        }

        if (!editingQuestion?._id) payload.quiz = activeQuiz._id;

        const res = editingQuestion?._id
            ? await callUpdateQuestion(editingQuestion._id, payload)
            : await callCreateQuestion(payload);

        if (res?.data) {
            message.success(editingQuestion?._id ? 'Cập nhật câu hỏi thành công' : 'Tạo câu hỏi thành công');
            setEditingQuestion(null);
            questionForm.resetFields();
            await refreshActiveQuiz();
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        const res = await callDeleteQuestion(questionId);
        if (res?.statusCode === 200) {
            message.success('Xóa câu hỏi thành công');
            await refreshActiveQuiz();
        }
    };

    return (
        <>
            {sortedItems.length > 0 ? (
                <div>
                    {sortedItems.map((item) => {
                        const isQuiz = item.type === 'quiz';
                        const lesson = item as any as ILesson;
                        const quiz = item as IQuiz;
                        const currentLessonType = (lesson as any).lessonType || lesson.type;

                        return (
                            <div
                                key={item._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: item._id !== sortedItems[sortedItems.length - 1]._id ? '1px solid #f0f0f0' : 'none',
                                }}
                            >
                                <Space>
                                    <span>{moduleOrder}.{item.order || 0}. {isQuiz ? quiz.title : lesson.name}</span>
                                    <Tag color={isQuiz ? 'purple' : 'blue'}>{isQuiz ? 'QUIZ' : currentLessonType?.toUpperCase()}</Tag>
                                    {item.isActive === false && <Tag color="red">INACTIVE</Tag>}
                                    {item.isFree && <Tag color="green">FREE</Tag>}
                                </Space>
                                <Space onClick={(e) => e.stopPropagation()}>
                                    {isQuiz && (
                                        <Button size="small" onClick={() => openQuestionManager(quiz)}>
                                            Questions
                                        </Button>
                                    )}
                                    <PencilEdit02Icon
                                        style={{ color: '#ffa500', cursor: 'pointer' }}
                                        onClick={() => isQuiz ? handleEditQuiz(quiz) : handleEditLesson(lesson)}
                                    />
                                    <Popconfirm
                                        title={isQuiz ? "Xác nhận xóa quiz" : "Xác nhận xóa bài học"}
                                        description={isQuiz ? "Bạn có chắc chắn muốn xóa quiz này?" : "Bạn có chắc chắn muốn xóa bài học này?"}
                                        onConfirm={() => isQuiz ? handleDeleteQuiz(item._id!) : handleDeleteLesson(item._id!)}
                                        okText="Xác nhận"
                                        cancelText="Hủy"
                                    >
                                        <Delete02Icon style={{ color: '#ff4d4f', cursor: 'pointer' }} />
                                    </Popconfirm>
                                </Space>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Empty description="Chưa có bài học hoặc quiz nào" style={{ margin: '20px 0' }} />
            )}

            <Space style={{ width: '100%', marginBottom: '16px' }} direction="vertical">
                <Button type="dashed" block icon={<Add01Icon />} onClick={handleAddLesson}>
                    Thêm bài học
                </Button>
                <Button type="dashed" block icon={<Add01Icon />} onClick={handleAddQuiz}>
                    Thêm quiz
                </Button>
            </Space>

            <Modal
                title={editingLesson?._id ? 'Cập nhật bài học' : 'Tạo bài học'}
                open={openLessonModal}
                onCancel={() => setOpenLessonModal(false)}
                onOk={() => lessonForm.submit()}
                confirmLoading={isLoading}
                width={800}
            >
                <Form form={lessonForm} layout="vertical" onFinish={handleSubmitLesson}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Lesson name is required' }]}>
                        <Input placeholder="Enter lesson name" />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please select a type' }]}>
                                <Select onChange={(val) => setLessonType(val)}>
                                    <Select.Option value="video">Video</Select.Option>
                                    <Select.Option value="article">Article</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Active" name="isActive" initialValue={true} valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Free" name="isFree" initialValue={false} valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Order" name="order" rules={[{ required: true, message: 'Please enter the order' }]}>
                                <Input type="number" placeholder="Order"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    {lessonType === "video" && (
                        <Form.Item
                            label="Video URL"
                            name="videoUrl"
                            rules={[
                                { required: true, message: 'Please enter video URL' },
                                { type: 'url', message: 'Please enter a valid URL' }
                            ]}
                        >
                            <Input placeholder="Enter video URL" />
                        </Form.Item>
                    )}

                    <Form.Item label="Content" name="content">
                        <CKEditorField placeholder="Enter content..." />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editingQuiz?._id ? 'Cập nhật quiz' : 'Tạo quiz'}
                open={openQuizModal}
                onCancel={() => setOpenQuizModal(false)}
                onOk={() => quizForm.submit()}
                confirmLoading={isLoading}
                width={760}
            >
                <Form form={quizForm} layout="vertical" onFinish={handleSubmitQuiz}>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Quiz title is required' }]}>
                        <Input placeholder="Enter quiz title" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={3} placeholder="Enter description" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={6}><Form.Item label="Order" name="order" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="Time limit" name="timeLimitSeconds"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="Passing score" name="passingScore"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="Max attempts" name="maxAttempts"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}><Form.Item label="Active" name="isActive" valuePropName="checked"><Switch /></Form.Item></Col>
                        <Col span={6}><Form.Item label="Free" name="isFree" valuePropName="checked"><Switch /></Form.Item></Col>
                        <Col span={6}><Form.Item label="Shuffle Q" name="shuffleQuestions" valuePropName="checked"><Switch /></Form.Item></Col>
                        <Col span={6}><Form.Item label="Shuffle options" name="shuffleOptions" valuePropName="checked"><Switch /></Form.Item></Col>
                    </Row>
                    <Form.Item label="Show result after submit" name="showResultAfterSubmit" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={activeQuiz?.title ? `Questions - ${activeQuiz.title}` : 'Questions'}
                open={openQuestionModal}
                onCancel={() => {
                    setOpenQuestionModal(false);
                    setActiveQuiz(null);
                    setEditingQuestion(null);
                    questionForm.resetFields();
                }}
                footer={null}
                width={960}
            >
                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span>{activeQuiz?.questions?.length || 0} questions</span>
                    <Button type="primary" icon={<Add01Icon />} onClick={handleAddQuestion}>Thêm câu hỏi</Button>
                </Space>

                {activeQuiz?.questions?.length ? activeQuiz.questions.map((question) => (
                    <div key={question._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <Space>
                            <span>{question.order}. {question.content}</span>
                            <Tag>{question.type}</Tag>
                            <Tag color="blue">{question.points || 1} point</Tag>
                        </Space>
                        <Space>
                            <PencilEdit02Icon style={{ color: '#ffa500', cursor: 'pointer' }} onClick={() => handleEditQuestion(question)} />
                            <Popconfirm title="Xóa câu hỏi?" onConfirm={() => handleDeleteQuestion(question._id!)}>
                                <Delete02Icon style={{ color: '#ff4d4f', cursor: 'pointer' }} />
                            </Popconfirm>
                        </Space>
                    </div>
                )) : <Empty description="Chưa có câu hỏi" />}

                <Form form={questionForm} layout="vertical" onFinish={handleSubmitQuestion} style={{ marginTop: 24 }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                                <Select
                                    options={QUESTION_TYPES}
                                    onChange={(type: IQuestion['type']) => {
                                        setQuestionType(type);
                                        questionForm.setFieldsValue({ options: type === 'fill_blank' ? undefined : getQuestionDefaults(type) });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}><Form.Item label="Order" name="order" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Points" name="points"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <Form.Item label="Content" name="content" rules={[{ required: true, message: 'Question content is required' }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    {questionType === 'fill_blank' ? (
                        <>
                            <Form.Item label="Accepted answers" name="acceptedAnswersText" rules={[{ required: true, message: 'Enter at least one answer' }]}>
                                <Input placeholder="answer 1; answer 2" />
                            </Form.Item>
                            <Form.Item label="Case sensitive" name="caseSensitive" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </>
                    ) : (
                        <Form.List name="options">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <Row gutter={12} key={field.key} align="middle">
                                            <Col span={14}>
                                                <Form.Item {...field} label="Option" name={[field.name, 'content']} rules={[{ required: true }]}>
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item {...field} label="Order" name={[field.name, 'order']}>
                                                    <InputNumber min={1} style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item {...field} label="Correct" name={[field.name, 'isCorrect']} valuePropName="checked">
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                            <Col span={2}>
                                                {questionType !== 'true_false' && <Button danger onClick={() => remove(field.name)}>Xóa</Button>}
                                            </Col>
                                        </Row>
                                    ))}
                                    {questionType !== 'true_false' && <Button onClick={() => add({ content: '', isCorrect: false, order: fields.length + 1 })}>Thêm option</Button>}
                                </>
                            )}
                        </Form.List>
                    )}

                    <Form.Item label="Explanation" name="explanation" style={{ marginTop: 16 }}>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Button type="primary" onClick={() => questionForm.submit()}>
                        {editingQuestion?._id ? 'Cập nhật câu hỏi' : 'Tạo câu hỏi'}
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default LessonManager;
