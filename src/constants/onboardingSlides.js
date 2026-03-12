/**
 * Onboarding slide data for Finovo.
 *
 * Each slide is self-describing:
 *  - `header`      : 'logo-skip' | 'back-title'
 *  - `illustration`: { type: 'icon', name } | { type: 'image', source }
 *  - `cta`         : 'arrow-button' | 'get-started'
 *
 * Slide content lives here. Screen logic + styles are untouched when adding slides.
 */
const ONBOARDING_SLIDES = [
    {
        id: '1',
        title: 'Track Your Spending',
        subtitle:
            'Log your daily expenses in seconds and stay on top of your financial goals effortlessly.',
        header: 'logo-skip',
        illustration: { type: 'icon', name: 'wallet-outline' },
        cta: 'arrow-button',
    },
    {
        id: '2',
        title: 'Save Smarter',
        subtitle:
            'Gain insights into your habits and grow your wealth effortlessly.',
        header: 'back-title',
        // Place a photo named save_smarter.jpg in frontend/assets/images/
        // and change type to 'image' with source: require('../assets/images/save_smarter.jpg')
        illustration: { type: 'photo-placeholder', tint: '#4A6741' },
        cta: 'get-started',
    },
    {
        id: '3',
        title: 'Reach Your Goals',
        subtitle:
            'Visualize your savings progress and build healthy financial habits every day.',
        header: 'back-title',
        illustration: { type: 'icon', name: 'flag-checkered' },
        cta: 'get-started',
    },
];

export default ONBOARDING_SLIDES;
