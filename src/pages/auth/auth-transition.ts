import { flushSync } from 'react-dom';

type AuthTransitionDirection = 'to-login' | 'to-register';

type ViewTransitionDocument = Document & {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

export const navigateWithAuthTransition = (
    navigate: (path: string) => void,
    path: string,
    direction: AuthTransitionDirection
) => {
    const transitionDocument = document as ViewTransitionDocument;
    const root = document.documentElement;
    const transitionClass = direction === 'to-register' ? 'auth-route-to-register' : 'auth-route-to-login';

    if (!transitionDocument.startViewTransition) {
        navigate(path);
        return;
    }

    root.classList.add(transitionClass);
    const transition = transitionDocument.startViewTransition(() => {
        flushSync(() => navigate(path));
    });
    transition.finished.finally(() => root.classList.remove(transitionClass));
};
