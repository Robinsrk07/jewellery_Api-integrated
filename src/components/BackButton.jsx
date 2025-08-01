import { useNavigate } from "react-router-dom";

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to); // go to provided path
    } else if (window.history.length > 1) {
      navigate(-1); // go back if history exists
    } else {
      navigate("/"); // fallback to home if no history
    }
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleClick}
        className="text-xs font-bold"
        style={{
          width: '100px',
          height: '33px',
          borderRadius: '8px',
          background: 'linear-gradient(to right, #7F60E4, #6170E4)',
          color: 'white',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer',
        }}
      >
        Back
      </button>
    </div>
  );
};

export default BackButton;
