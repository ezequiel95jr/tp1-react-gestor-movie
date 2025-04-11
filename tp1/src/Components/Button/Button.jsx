import './Button.css';

const Button = ({ texto, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {texto}
    </button>
  );
}

export default Button;