import { useState } from 'react';
export default function Poll({ poll, options = [] }) {
  const [voted, setVoted] = useState(false);
  const pollOptions = options.filter(o => o.poll_id === poll.id);

  async function vote(optionId) {
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_id: poll.id, option_id: optionId, voter_key: 'dev' })
      });
      if (res.ok) setVoted(true);
      else {
        const j = await res.json().catch(()=>({}));
        alert('Vote failed: ' + (j?.error || res.statusText));
      }
    } catch (e) {
      alert('Vote failed: ' + e.message);
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
      <strong>{poll.question}</strong>
      {!voted ? (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {pollOptions.map(o => <li key={o.id}><button onClick={() => vote(o.id)}>{o.label}</button></li>)}
        </ul>
      ) : <p>Thanks — vote recorded.</p>}
    </div>
  );
}
