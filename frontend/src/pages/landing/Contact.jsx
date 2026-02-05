import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/layout/Footer';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                        {t('contact_page.title')}
                    </h1>
                    <p style={{ fontSize: '1.3rem', opacity: 0.95 }}>
                        {t('contact_page.subtitle')}
                    </p>
                </div>
            </section>

            <div className="container" style={{ maxWidth: '1200px', margin: '80px auto 100px', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>

                    {/* Contact Form */}
                    <div className="card reveal reveal-left" style={{ padding: '50px' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>
                            {t('contact_page.send_message')}
                        </h2>

                        {submitted && (
                            <div style={{
                                background: '#10b98120',
                                border: '1px solid #10b981',
                                color: '#10b981',
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>
                                {t('contact_page.success_msg')}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {t('contact_page.name_label')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {t('contact_page.email_input_label')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {t('contact_page.subject_label')}
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {t('contact_page.message_label')}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    style={{ width: '100%', resize: 'vertical' }}
                                />
                            </div>

                            <button type="submit" className="btn" style={{ width: '100%', padding: '15px' }}>
                                {t('contact_page.send_btn')}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="reveal reveal-right">
                        <div className="card" style={{ padding: '50px', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>
                                {t('contact_page.contact_info')}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'var(--primary-color)15',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary-color)',
                                        fontSize: '1.3rem'
                                    }}>
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '5px' }}>{t('contact_page.address_label')}</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>{t('contact_page.address')}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'var(--primary-color)15',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary-color)',
                                        fontSize: '1.3rem'
                                    }}>
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '5px' }}>{t('contact_page.email_info_label')}</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>{t('contact_page.email')}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'var(--primary-color)15',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary-color)',
                                        fontSize: '1.3rem'
                                    }}>
                                        <FaPhone />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '5px' }}>{t('contact_page.phone_label')}</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>{t('contact_page.phone')}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'var(--primary-color)15',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary-color)',
                                        fontSize: '1.3rem'
                                    }}>
                                        <FaClock />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '10px' }}>{t('contact_page.office_hours')}</h4>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>{t('contact_page.mon_fri')}</p>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>{t('contact_page.sat')}</p>
                                        <p style={{ color: 'var(--text-secondary)' }}>{t('contact_page.sun')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
