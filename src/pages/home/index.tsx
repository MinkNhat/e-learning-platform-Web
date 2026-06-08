import CourseSection from '@/components/client/section/course.section';
import styles from 'styles/client.module.scss';

const HomePage = () => {
    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            <CourseSection />
        </div>
    )
}

export default HomePage;