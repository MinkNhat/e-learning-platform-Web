export type SocialProvider = 'google' | 'facebook';

export const SOCIAL_LOGIN_CALLBACK_KEY = 'social_login_callback';

export const SOCIAL_PROVIDER_LABEL: Record<SocialProvider, string> = {
    google: 'Google',
    facebook: 'Facebook',
};

export const getSocialProvider = (provider: string | null): SocialProvider => (
    provider === 'facebook' ? 'facebook' : 'google'
);
