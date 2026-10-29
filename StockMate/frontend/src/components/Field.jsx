// Label + input wrapper that shows a field-specific error message.
export default function Field({ label, error, hint, full, htmlFor, children }) {
  return (
    <div className={`field ${full ? 'full' : ''}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="error-text" role="alert">{error}</span>}
    </div>
  );
}
