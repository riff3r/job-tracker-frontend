interface FormFieldErrorProps {
  /** Optional id so the input can reference it via aria-describedby. */
  id?: string;
  children?: React.ReactNode;
}

/**
 * Standardized inline form-field error message. Renders nothing when empty.
 * Pair with `<input aria-invalid="true" aria-describedby={id} />` when an error is shown.
 */
export function FormFieldError({ id, children }: FormFieldErrorProps) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-xs text-red-500 mt-1">
      {children}
    </p>
  );
}
