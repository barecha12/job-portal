import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../services/axios-client";
import Footer from "../../components/layout/Footer";
import JobCard from "../../components/jobs/JobCard";
import Loader from "../../components/common/Loader";
import { FaBook, FaHeadset, FaQuestionCircle, FaRocket } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [recentJobs, setRecentJobs] = useState([]);
    const [stats, setStats] = useState({ activeJobs: 0, companies: 0, candidates: 0 });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Fetch jobs
        axiosClient.get('/jobs')
            .then(({ data }) => {
                setRecentJobs(data.data.slice(0, 6));
            })
            .catch((err) => {
                console.error("Jobs fetch failed:", err);
            });

        // Fetch stats with cache-busting
        axiosClient.get('/stats?t=' + new Date().getTime())
            .then(({ data }) => {
                if (data && data.stats) {
                    setStats(data.stats);
                }
                if (data && data.categories) {
                    setCategories(data.categories);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Stats fetch failed:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Scroll reveal animation - separate effect to avoid conflicts
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

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            const revealElements = document.querySelectorAll('.reveal');
            revealElements.forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [recentJobs, categories]); // Re-run when data loads

    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (locationQuery) queryParams.append('location', locationQuery);

        navigate(`/jobs?${queryParams.toString()}`);
    };

    return (
        <div className="landing-page animated fadeInDown" style={{ background: 'var(--background-color)' }}>
            {/* Hero Section */}
            <section className="hero" style={{
                textAlign: 'center',
                padding: '100px 20px 80px',
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                color: 'white',
                borderRadius: '0 0 50% 50% / 40px',
                marginBottom: '80px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 className="animate-float" style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800', textShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        {t('hero.title')}
                    </h1>
                    <p className="slide-up delay-200" style={{ fontSize: '1.3rem', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px', opacity: 0.95 }}>
                        {t('hero.subtitle')}
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="slide-up delay-300" style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        background: 'var(--card-bg)',
                        padding: '12px',
                        borderRadius: '60px',
                        boxShadow: 'var(--shadow-xl)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', paddingLeft: '24px' }}>
                            <span style={{ color: 'var(--text-muted)', marginRight: '12px', fontSize: '1.2rem' }}>🔍</span>
                            <input
                                type="text"
                                placeholder={t('hero.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    marginBottom: 0,
                                    background: 'transparent',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                        <div style={{ width: '2px', background: 'var(--border-color)', height: '45px', alignSelf: 'center' }}></div>
                        <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', paddingLeft: '24px' }}>
                            <span style={{ color: 'var(--text-muted)', marginRight: '12px', fontSize: '1.2rem' }}>📍</span>
                            <input
                                type="text"
                                placeholder={t('hero.location_placeholder')}
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    marginBottom: 0,
                                    background: 'transparent',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                        <button type="submit" className="btn animate-pulse-glow" style={{
                            borderRadius: '50px',
                            padding: '14px 45px',
                            fontSize: '1.05rem',
                            background: 'var(--primary-color)',
                            marginBottom: 0,
                            boxShadow: 'none',
                            color: 'white',
                            fontWeight: '600'
                        }}>
                            {t('hero.find_jobs')}
                        </button>
                    </form>
                </div>
            </section>

            {/* Stats Section */}
            <section className="reveal reveal-up" style={{ padding: '60px 20px', marginBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
                        <div className="card" style={{ padding: '40px 30px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--primary-color)' }}>💼</div>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: 'var(--primary-color)' }}>
                                {stats.activeJobs?.toLocaleString() || 0}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t('home.active_jobs')}</p>
                        </div>
                        <div className="card" style={{ padding: '40px 30px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--secondary-color)' }}>🏢</div>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: 'var(--secondary-color)' }}>
                                {stats.companies?.toLocaleString() || 0}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t('home.companies')}</p>
                        </div>
                        <div className="card" style={{ padding: '40px 30px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--accent-color)' }}>👥</div>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: 'var(--accent-color)' }}>
                                {stats.candidates?.toLocaleString() || 0}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t('home.candidates')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Jobs - Gallery Swipe Effect */}
            <section className="reveal reveal-left" style={{ padding: '60px 20px', marginBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '50px', textAlign: 'center' }}>
                        {t('home.recent_jobs')}
                    </h2>
                    {loading ? (
                        <Loader />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                            {recentJobs.map((job, index) => (
                                <div key={job.id} className="reveal reveal-left" style={{ animationDelay: `${index * 100}ms` }}>
                                    <JobCard job={job} />
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Link to="/jobs" className="btn" style={{ padding: '15px 50px', fontSize: '1.1rem' }}>
                            {t('home.view_all_jobs')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories - Gallery Swipe from Right */}
            <section className="reveal reveal-right" style={{ padding: '60px 20px', marginBottom: '60px', background: 'var(--surface-color)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>
                        {t('home.browse_categories')}
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '50px', fontSize: '1.1rem' }}>
                        {t('home.find_your_field')}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
                        {categories.map((cat, index) => (
                            <Link
                                key={cat.category}
                                to={`/jobs?category=${cat.category}`}
                                className="card reveal reveal-right"
                                style={{
                                    padding: '35px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.3s ease',
                                    animationDelay: `${index * 80}ms`
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                                    {['💻', '📱', '🎨', '💰', '🏥', '📚', '⚙️', '📊'][index % 8]}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', fontWeight: '700' }}>
                                    {t(`categories.${cat.category.toLowerCase()}`)}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    {cat.count} {t('home.positions')}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support & Resources Section */}
            <section className="reveal reveal-up" style={{ padding: '80px 20px', marginBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>
                        {t('home.support_title')}
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '60px', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 60px' }}>
                        {t('home.support_subtitle')}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '35px' }}>
                        <div className="card" style={{ padding: '45px', textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 25px',
                                fontSize: '2rem',
                                color: 'white'
                            }}>
                                <FaBook />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '700' }}>
                                {t('home.user_guides')}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '25px' }}>
                                {t('home.user_guides_desc')}
                            </p>
                            <Link to="/about" className="btn" style={{ padding: '12px 30px' }}>
                                {t('home.learn_more')}
                            </Link>
                        </div>

                        <div className="card" style={{ padding: '45px', textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 25px',
                                fontSize: '2rem',
                                color: 'white'
                            }}>
                                <FaQuestionCircle />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '700' }}>
                                {t('home.help_center')}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '25px' }}>
                                {t('home.help_center_desc')}
                            </p>
                            <Link to="/contact" className="btn" style={{ padding: '12px 30px' }}>
                                {t('home.get_help')}
                            </Link>
                        </div>

                        <div className="card" style={{ padding: '45px', textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 25px',
                                fontSize: '2rem',
                                color: 'white'
                            }}>
                                <FaHeadset />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '700' }}>
                                {t('home.direct_support')}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '25px' }}>
                                {t('home.direct_support_desc')}
                            </p>
                            <Link to="/contact" className="btn" style={{ padding: '12px 30px' }}>
                                {t('home.contact_us')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="reveal reveal-up" style={{
                padding: '80px 20px',
                marginBottom: '60px',
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                borderRadius: '30px',
                maxWidth: '1200px',
                margin: '0 auto 60px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <FaRocket style={{ fontSize: '4rem', marginBottom: '25px' }} />
                    <h2 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '20px' }}>
                        {t('home.cta_title')}
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.95 }}>
                        {t('home.cta_subtitle')}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/signup" className="btn" style={{
                            background: 'white',
                            color: 'var(--primary-color)',
                            padding: '16px 45px',
                            fontSize: '1.1rem',
                            fontWeight: '700'
                        }}>
                            {t('home.get_started')}
                        </Link>
                        <Link to="/jobs" className="btn" style={{
                            background: 'transparent',
                            border: '2px solid white',
                            color: 'white',
                            padding: '16px 45px',
                            fontSize: '1.1rem',
                            fontWeight: '700'
                        }}>
                            {t('home.browse_jobs')}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
