import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../services/axios-client";
import Footer from "../../components/layout/Footer";
import JobCard from "../../components/jobs/JobCard";
import Loader from "../../components/common/Loader";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
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
                setRecentJobs(data.data.slice(0, 4));
            })
            .catch(() => { });

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

    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (locationQuery) queryParams.append('location', locationQuery);

        navigate(`/jobs?${queryParams.toString()}`);
    };

    return (
        <div className="landing-page animated fadeInDown">
            {/* Hero Section */}
            <section className="hero" style={{
                textAlign: 'center',
                padding: '80px 20px 70px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '0 0 50% 50% / 40px',
                marginBottom: '60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 className="animate-float" style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800', textShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        {t('hero.title')}
                    </h1>
                    <p className="slide-up delay-200" style={{ fontSize: '1.25rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', opacity: 0.9 }}>
                        {t('hero.subtitle')}
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="slide-up delay-300" style={{
                        maxWidth: '800px',
                        margin: '0 auto 40px',
                        background: 'white',
                        padding: '10px',
                        borderRadius: '50px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                            <span style={{ color: '#999', marginRight: '10px' }}>🔍</span>
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
                                    padding: '10px'
                                }}
                            />
                        </div>
                        <div style={{ width: '1px', background: '#eee', height: '40px', alignSelf: 'center' }}></div>
                        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                            <span style={{ color: '#999', marginRight: '10px' }}>📍</span>
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
                                    padding: '10px'
                                }}
                            />
                        </div>
                        <button type="submit" className="btn animate-pulse-glow" style={{
                            borderRadius: '50px',
                            padding: '12px 40px',
                            fontSize: '1rem',
                            background: 'var(--primary-color)',
                            marginBottom: 0,
                            boxShadow: 'none'
                        }}>
                            {t('hero.find_jobs')}
                        </button>
                    </form>


                </div>
            </section>

            {/* Trusted Companies Logo Strip */}
            <section style={{ borderBottom: '1px solid #eee', padding: '30px 0', background: 'white', marginBottom: '40px' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('home.trusted_by')}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap', alignItems: 'center', opacity: 0.7 }}>
                        {recentJobs.length > 0 ? (
                            // Use companies from recent jobs to show real active companies
                            Array.from(new Set(recentJobs.map(j => j.company?.id)))
                                .map(id => recentJobs.find(j => j.company?.id === id).company)
                                .slice(0, 5)
                                .map(company => (
                                    <div key={company.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={company.logo || 'https://via.placeholder.com/30'} alt={company.name} style={{ width: '30px', height: '30px', borderRadius: '5px', filter: 'grayscale(100%)' }} />
                                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#334155' }}>{company.name.toUpperCase()}</span>
                                    </div>
                                ))
                        ) : (
                            ['Google', 'Amazon', 'Netflix', 'Spotify', 'Airbnb'].map((name) => (
                                <div key={name} style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#94a3b8' }}>{name.toUpperCase()}</div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Recent Jobs Section (New) */}
            <section className="container animated fadeInUp" style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{t('home.recent_jobs_title')}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('home.recent_jobs_subtitle')}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {loading && <Loader text={t('home.loading_jobs')} />}
                    {!loading && recentJobs.length === 0 && (
                        <div className="text-center">{t('home.no_recent_jobs')}</div>
                    )}
                    {!loading && recentJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
                <div className="text-center" style={{ marginTop: '40px' }}>
                    <Link to="/jobs" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{t('home.browse_all_jobs')} &rarr;</Link>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="container animated fadeInUp" style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
                <div className="card" style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: 'white',
                    marginBottom: '40px'
                }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>{t('home.about_title')} <span className="gradient-text">Hojio</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 40px' }}>
                        {t('home.about_description')}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px',
                        marginTop: '40px',
                        borderTop: '1px solid #f3f4f6',
                        paddingTop: '40px'
                    }}>
                        <div className="hover-scale">
                            <div style={{ fontSize: '3rem', color: 'var(--primary-color)', fontWeight: 'bold', minHeight: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <span className="animate-pulse" style={{ opacity: 0.5 }}>...</span>
                                ) : (
                                    stats.activeJobs > 999 ? `${(stats.activeJobs / 1000).toFixed(1)}k+` : stats.activeJobs
                                )}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>{t('home.active_jobs')}</div>
                        </div>
                        <div className="hover-scale">
                            <div style={{ fontSize: '3rem', color: 'var(--secondary-color)', fontWeight: 'bold', minHeight: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <span className="animate-pulse" style={{ opacity: 0.5 }}>...</span>
                                ) : (
                                    stats.companies > 999 ? `${(stats.companies / 1000).toFixed(1)}k+` : stats.companies
                                )}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>{t('dashboard.stats_companies') || 'Companies'}</div>
                        </div>
                        <div className="hover-scale">
                            <div style={{ fontSize: '3rem', color: 'var(--success-color)', fontWeight: 'bold', minHeight: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <span className="animate-pulse" style={{ opacity: 0.5 }}>...</span>
                                ) : (
                                    stats.candidates > 999 ? `${(stats.candidates / 1000).toFixed(1)}k+` : stats.candidates
                                )}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>{t('dashboard.stats_candidates') || 'Candidates'}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="container" style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 20px' }}>
                <h2 className="text-center" style={{ marginBottom: '40px', color: 'var(--text-primary)', fontSize: '2rem' }}>{t('home.featured_categories')}</h2>
                <div className="animated zoomIn" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.category} className="card" style={{
                                textAlign: 'center',
                                padding: '30px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                marginBottom: 0
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                onClick={() => navigate(`/jobs?category=${cat.category}`)}
                            >
                                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary-color)' }}>{t(`categories.${cat.category.toLowerCase()}`) || cat.category}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '5px' }}>{t('home.jobs_count', { count: cat.count })}</div>
                            </div>
                        ))
                    ) : (
                        ['technology', 'marketing', 'finance', 'design', 'healthcare', 'education', 'engineering', 'sales'].map((cat) => (
                            <div key={cat} className="card" style={{
                                textAlign: 'center',
                                padding: '30px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                marginBottom: 0
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                onClick={() => navigate('/jobs')}
                            >
                                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary-color)' }}>{t(`categories.${cat}`)}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '5px' }}>{t('home.jobs_count', { count: 0 })}</div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
                padding: '90px 20px',
                marginBottom: '80px',
                position: 'relative',
                overflow: 'hidden'
            }} className="animated fadeInUp">
                <div style={{ position: 'absolute', top: '10%', right: '5%', width: '200px', height: '200px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '250px', height: '250px', background: 'rgba(118, 75, 162, 0.1)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="text-center" style={{ marginBottom: '50px', color: 'var(--text-primary)', fontSize: '2rem' }}>{t('home.how_it_works_title')}</h2>
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { step: '01', title: t('home.step_1_title'), desc: t('home.step_1_desc') },
                            { step: '02', title: t('home.step_2_title'), desc: t('home.step_2_desc') },
                            { step: '03', title: t('home.step_3_title'), desc: t('home.step_3_desc') },
                        ].map((item) => (
                            <div key={item.step} style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    margin: '0 auto 20px'
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="container" style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px' }}>
                <h2 className="text-center" style={{ marginBottom: '40px', color: 'var(--text-primary)', fontSize: '2rem' }}>{t('home.testimonials_title')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {[
                        { name: 'Sarah J.', role: 'Software Engineer', text: t('home.sarah_text') },
                        { name: 'Mark T.', role: 'Hiring Manager', text: t('home.mark_text') },
                    ].map((t, i) => (
                        <div key={i} className="card" style={{ padding: '30px', fontStyle: 'italic' }}>
                            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>"{t.text}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '50%' }}></div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="container" style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px' }}>
                <div style={{ background: 'var(--primary-dark)', padding: '60px', borderRadius: '20px', color: 'white', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>{t('home.cta_title')}</h2>
                    <p style={{ marginBottom: '30px', opacity: 0.9, fontSize: '1.1rem' }}>{t('home.cta_subtitle')}</p>
                    <Link to="/signup" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-dark)', fontSize: '1.1rem', padding: '15px 40px', border: 'none' }}>
                        {t('home.join_now')}
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
