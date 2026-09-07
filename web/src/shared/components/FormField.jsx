export function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
  className = "",
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor && hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={`form-field-group ${error ? "has-error" : ""} ${className}`.trim()}>
      {label && (
        <label htmlFor={htmlFor} className="form-field-label">
          <span>{label}</span>
          {required && <span className="form-field-required" aria-hidden="true">*</span>}
          {required && <span className="sr-only">(required)</span>}
        </label>
      )}
      {hint && (
        <span id={hintId} className="form-field-hint">
          {hint}
        </span>
      )}
      <div className="form-field-control">{children}</div>
      {error && (
        <span id={errorId} className="form-field-error" role="alert">
          <span className="error-dot" aria-hidden="true">!</span>
          {error}
        </span>
      )}
    </div>
  );
}

export function ErrorBanner({ message, title = "Please correct the following:" }) {
  if (!message) return null;
  return (
    <div className="form-error-banner" role="alert">
      <span className="error-banner-icon" aria-hidden="true">!</span>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}

