export default function Amenities({ items = [] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3>Amenities</h3>
      <ul>{items.map(a => <li key={a.id}>{a.label || a.key || JSON.stringify(a)}</li>)}</ul>
    </div>
  );
}
