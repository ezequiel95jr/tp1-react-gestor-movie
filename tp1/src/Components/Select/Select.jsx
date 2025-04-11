import './Select.css';

const Select = ({ options, value, onChange,label,name}) => {
  return (
    <div>
        <label htmlFor="{name}">{label}</label>
    <select id={name} value={value} onChange={onChange} className='select'>
        <options vlaue=""> Seleccione una opocion </options>
        {options.map((opt)=>(
            <option key={opt.vlaue} value={opt.value}>
                {opt.label}</option>
        ))}
    </select>
    </div>
  );
}  

export default Select; 