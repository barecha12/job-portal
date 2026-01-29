export default function Loader({ text = "Loading..." }) {
    return (
        <div className="text-center" style={{ padding: '20px' }}>
            <div className="animate-pulse-glow" style={{ width: '30px', height: '30px', background: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto' }}></div>
            {text && <div className="text-center" style={{ marginTop: '10px', color: 'var(--text-muted)' }}>{text}</div>}
        </div>
    )
}
