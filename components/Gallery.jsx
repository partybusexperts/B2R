export default function Gallery({ images = [] }) {
  if (!images || images.length === 0) return <div>No images available.</div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {images.map(img => (
        <img key={img.id} src={img.storage_path || img.public_url || ''} alt={img.alt_text || ''} style={{ width: '100%', borderRadius: 6 }} />
      ))}
    </div>
  );
}
