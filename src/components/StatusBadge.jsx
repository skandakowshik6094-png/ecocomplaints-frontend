const colors = {
  pending:       'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  resolved:      'bg-green-100 text-green-800',
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${colors[status] || 'bg-gray-100'}`}>
    {status}
  </span>
);

export default StatusBadge;