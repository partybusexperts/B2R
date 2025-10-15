import Poll from './Poll';
export default function PollList({ polls = [], options = [] }) {
  if (!polls.length) return <p>No polls yet.</p>;
  return <div>{polls.map(p => <Poll key={p.id} poll={p} options={options} />)}</div>;
}
