interface IFormField {
  value: string;
  label: string;
  name: string;
  handleChange: (value: string) => void;
  type?: string;
  selectOptions?: { label: string; value: string }[];
  noOfRows?: number;
  maxChar?: number;
  isRequired?: boolean;
}
const FormField = ({
  value,
  label,
  name,
  handleChange,
  type = "text",
  selectOptions,
  noOfRows,
  maxChar = 100,
  isRequired = true,
}: IFormField) => {
  return (
    <>
      {type === "textarea" ? (
        <span className="input">
          <textarea
            name={name}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            value={value}
            rows={noOfRows || 10}
            required={isRequired}
          />
          <label htmlFor={name}>{label}</label>
          {maxChar && (
            <span className="absolute right-1 bottom-0 text-sm">{`${value.length}/${maxChar}`}</span>
          )}
        </span>
      ) : type === "select" ? (
        <span className="input">
          <select
            value={value}
            name={name}
            id=""
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            required={isRequired}
          >
            <option value="">--Select--</option>
            {selectOptions?.map((option, index) => (
              <option
                value={option.value}
                key={option.value + String(index * 41)}
              >
                {option.label}
              </option>
            ))}
          </select>
          <label htmlFor={name}>{label}</label>
        </span>
      ) : (
        <span className="input">
          <input
            value={value}
            name={name}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            type={type}
            required={isRequired}
          />
          <label htmlFor={name}>{label}</label>
        </span>
      )}
    </>
  );
};

export default FormField;
