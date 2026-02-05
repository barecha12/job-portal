import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/layout/Footer';
import { FaCheckCircle, FaUsers, FaRocket, FaHeart } from 'react-icons/fa';

export default function AboutUs() {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);

        // Scroll reveal animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => revealElements.forEach(el => observer.unobserve(el));
    }, []);

    return (
        <div style={{ background: 'var(--background-color)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                color: 'white',
                padding: '120px 20px 80px',
                textAlign: 'center'
            }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800' }}>
                        {t('about_page.title')}
                    </h1>
                    <p style={{ fontSize: '1.3rem', opacity: 0.95, marginBottom: '15px' }}>
                        {t('about_page.subtitle')}
                    </p>
                    <p style={{ fontSize: '1.1rem', opacity: 0.85 }}>
                        {t('about_page.header_desc')}
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="container reveal reveal-up" style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px' }}>
                <div className="card" style={{ padding: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>
                        {t('about_page.our_story')}
                    </h2>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        {t('about_page.our_story_desc')}
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="container reveal reveal-left" style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
                    <div className="card" style={{ padding: '50px', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', border: '2px solid var(--primary-color)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--primary-color)' }}>
                            {t('about_page.our_mission')}
                        </h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                            {t('about_page.our_mission_desc')}
                        </p>
                    </div>
                    <div className="card" style={{ padding: '50px', background: 'linear-gradient(135deg, #8b5cf615 0%, #ec489915 100%)', border: '2px solid var(--secondary-color)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔭</div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--secondary-color)' }}>
                            {t('about_page.our_vision')}
                        </h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                            {t('about_page.our_vision_desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="container reveal reveal-right" style={{ maxWidth: '1200px', margin: '80px auto 100px', padding: '0 20px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '60px', textAlign: 'center' }}>
                    {t('about_page.why_choose_us')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {[
                        { icon: <FaCheckCircle />, title: t('about_page.reason_1_title'), desc: t('about_page.reason_1_desc'), color: '#10b981' },
                        { icon: <FaRocket />, title: t('about_page.reason_2_title'), desc: t('about_page.reason_2_desc'), color: '#6366f1' },
                        { icon: <FaHeart />, title: t('about_page.reason_3_title'), desc: t('about_page.reason_3_desc'), color: '#f59e0b' }
                    ].map((item, idx) => (
                        <div key={idx} className="card" style={{ padding: '40px', textAlign: 'center' }}>
                            <div style={{
                                fontSize: '3rem',
                                color: item.color,
                                marginBottom: '20px',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {item.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
