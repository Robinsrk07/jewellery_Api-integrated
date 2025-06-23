const DisabledButton = ({ label }) => (
  <button
    disabled
    title="You do not have permission to perform this action"
    className="btn text-white font-bold text-xs rounded-lg opacity-50 cursor-not-allowed"
    style={{
      width: 'fit-content',
      minWidth: '80px',
      height: '35px',
      padding: '5px',
      background: 'linear-gradient(to right, #cbd5e1, #94a3b8)',
    }}
  >
    {label}
  </button>
);

export default DisabledButton;
