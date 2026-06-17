import { useEffect, useRef, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ConfigProvider } from 'antd';
import NotFound from 'components/share/not.found';
import Loading from 'components/share/loading';
import LoginPage from 'pages/auth/login';
import RegisterPage from 'pages/auth/register';
import LayoutAdmin from 'components/admin/layout.admin';
import ProtectedRoute from 'components/share/protected-route.ts';
import Header from 'components/client/header.client';
import Footer from 'components/client/footer.client';
import HomePage from 'pages/home';
import styles from 'styles/app.module.scss';
import DashboardPage from './pages/admin/dashboard';
import PermissionPage from './pages/admin/permission';
import RolePage from './pages/admin/role';
import UserPage from './pages/admin/user';
import CategoryPage from './pages/admin/category';
import { fetchAccount } from './redux/slice/accountSlide';
import LayoutApp from './components/share/layout.app';
import CoursePage from './pages/admin/course';
import AdminCourseDetailPage from './pages/admin/course/detail';
import ClientCoursePage from './pages/course';
import ClientCourseDetailPage from './pages/course/detail';
import PaymentResultPage from './pages/payment/result';
import MyCoursesPage from './pages/my-courses';
import ClientLessonDetailPage from './pages/my-courses/lesson';

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location]);

  return (
    <div className='layout-app' ref={rootRef}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles['content-app']}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);


  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "course", element: <ClientCoursePage /> },
        { path: "course/:slug", element: <ClientCourseDetailPage /> },
        {
          path: "my-courses",
          element:
            <ProtectedRoute>
              <MyCoursesPage />
            </ProtectedRoute>
        },
        {
          path: "my-courses/lessons/:lessonId",
          element:
            <ProtectedRoute>
              <ClientLessonDetailPage />
            </ProtectedRoute>
        },
        { path: "payment-result", element: <PaymentResultPage /> },
      ],
    },

    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /> </LayoutApp>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
        },

        {
          path: "course",
          element:
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>,
        },
        {
          path: "course/:id",
          element:
            <ProtectedRoute>
              <AdminCourseDetailPage />
            </ProtectedRoute>,
        },
        {
          path: "category",
          element:
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
        },
        {
          path: "permission",
          element:
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
        }
      ],
    },


    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Roboto, sans-serif',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}
