export function Input({ id, type="text", placeholder="", refEl=undefined, label=undefined, onChangeEvent, addlClass="", required, min, children }) {
  const handleKeyDown = (e) => {
    if (min !== undefined && parseFloat(min) >= 0 && e.key === '-') {
      e.preventDefault()
    }
  }

  return (
    <div className={`field ${addlClass}`}>
      {label && <label className="label">{label}</label>}
      <div className="control">
        <input
          id={id}
          placeholder={placeholder}
          className="input"
          type={type}
          ref={refEl}
          onChange={onChangeEvent}
          onKeyDown={handleKeyDown}
          required={required}
          min={min}
        ></input>
      </div>
      {children}
    </div>
  )
}
