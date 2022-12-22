import { useState } from "react";

function NumberInput(props) {
  const [numberValue, setNumberValue] = useState("");

  function onChange(e) {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setNumberValue(e.target.value);
    }
  }

  return (
    <div className={props.cname}>
      <label htmlFor="numberInput">{props.label}</label>

      <input
        value={numberValue}
        onChange={onChange}
        id="numberInput"
        ref={props.inputRef}
      />
    </div>
  );
}

export default NumberInput;
