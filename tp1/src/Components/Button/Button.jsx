import './Button.css';

const Button = ({ texto, onClick, type= "button" }) => {
  return (
    <button className="button" onClick={onClick} type={type}>
      {texto}
    </button>
  );
}

export default Button;