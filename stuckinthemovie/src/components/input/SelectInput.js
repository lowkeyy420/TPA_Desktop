import Select from "react-select";

function SelectInput(props) {
  return (
    <div style={{ color: "#38015c" }}>
      <label htmlFor="roles" style={{ color: "white", fontWeight: "bold" }}>
        {props.label}
      </label>
      <Select
        inputId="roles"
        className="basic-single"
        classNamePrefix="select"
        defaultValue={props.roleOptions[3]}
        isRtl={false}
        isSearchable={true}
        options={props.roleOptions}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            neutral0: "#f1e1fc",
            neutral80: "#38015c",
            primary25: "#B2D4FF",
            primary: "#ae82cc",
          },
        })}
        onChange={(e) => props.setchoice(e.value)}
      />
    </div>
  );
}

export default SelectInput;
