export default function ContentBlocks({ blocks = [] }) {
  if (!blocks.length) return null;
  return (
    <div>
      {blocks.map(b => <section key={b.block_key}><h4>{b.title}</h4><div dangerouslySetInnerHTML={{ __html: b.body }} /></section>)}
    </div>
  );
}
