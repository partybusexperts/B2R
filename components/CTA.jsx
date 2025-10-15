export default function CTA({ phone = '+1-800-555-1212' }) {
  return (
    <div style={{ padding: 16, background: '#f7f7f7', borderRadius: 8 }}>
      <h3>Ready to book?</h3>
      <a href={`tel:${phone}`} style={{ display: 'inline-block', marginTop: 8 }}>{phone}</a>
    </div>
  );
}
