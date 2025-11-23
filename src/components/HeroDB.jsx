export default function HeroDB({ heroData }) {
  if (!heroData) return null;
  const { title, subtitle, cta_text, cta_link } = heroData;
  const imageSrc = heroData?.image_url || heroData?.image_path || heroData?.storage_path || heroData?.image || null;
  return (
    <header style={{
      backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
      backgroundSize: 'cover',
      padding: 28,
      borderRadius: 8,
      color: '#fff'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', background: 'rgba(0,0,0,0.35)', padding: 20, borderRadius: 8 }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p style={{ marginTop: 8 }}>{subtitle}</p>
        {cta_text && <a href={cta_link || '#get-quote'} style={{ display: 'inline-block', marginTop: 12, background:'#fff', color:'#111', padding:'8px 12px', borderRadius:6 }}>{cta_text}</a>}
      </div>
    </header>
  );
}
