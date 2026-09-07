import { useCallback, useState } from "react";
import { validateValue } from "./rules.js";

export function useFormValidation({
  initialValues = {},
  validationRules = {},
  customValidator = null,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateSingleField = useCallback(
    (name, valueToValidate, currentValues = values) => {
      const fieldRules = validationRules[name];
      if (!fieldRules || fieldRules.length === 0) {
        return null;
      }
      return validateValue(valueToValidate, fieldRules, currentValues);
    },
    [validationRules, values]
  );

  const setValue = useCallback((name, value) => {
    setValues((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  }, []);

  const handleChange = useCallback(
    (e) => {
      const target = e.target;
      const name = target.name;
      const value = target.type === "checkbox" ? target.checked : target.value;

      setValues((prev) => {
        const next = { ...prev, [name]: value };
        // If the field was already touched, re-validate immediately
        if (touched[name]) {
          const fieldError = validateSingleField(name, value, next);
          setErrors((prevErr) => ({
            ...prevErr,
            [name]: fieldError,
          }));
        }
        return next;
      });
    },
    [touched, validateSingleField]
  );

  const handleBlur = useCallback(
    (e) => {
      const name = e.target.name;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const fieldError = validateSingleField(name, values[name], values);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    },
    [validateSingleField, values]
  );

  const validateAll = useCallback(
    (valuesToValidate = values) => {
      const nextErrors = {};
      let hasError = false;

      // Rule-based field validation
      for (const [fieldName, fieldRules] of Object.entries(validationRules)) {
        const error = validateValue(valuesToValidate[fieldName], fieldRules, valuesToValidate);
        if (error) {
          nextErrors[fieldName] = error;
          hasError = true;
        }
      }

      // Optional custom validator for cross-field or complex checks
      if (customValidator) {
        const customErrors = customValidator(valuesToValidate);
        if (customErrors && Object.keys(customErrors).length > 0) {
          Object.assign(nextErrors, customErrors);
          hasError = true;
        }
      }

      setErrors(nextErrors);
      // Mark all validated fields as touched
      const allTouched = Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      return !hasError;
    },
    [customValidator, validationRules, values]
  );

  const handleSubmit = useCallback(
    (onValidSubmit) => async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      setIsSubmitting(true);
      const isValid = validateAll(values);
      if (isValid && onValidSubmit) {
        try {
          await onValidSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    },
    [validateAll, values]
  );

  const getFieldProps = useCallback(
    (name, type = "text") => {
      const hasError = Boolean(touched[name] && errors[name]);
      return {
        name,
        id: name,
        value: type === "checkbox" ? undefined : (values[name] ?? ""),
        checked: type === "checkbox" ? Boolean(values[name]) : undefined,
        onChange: handleChange,
        onBlur: handleBlur,
        "aria-invalid": hasError ? "true" : "false",
        "aria-describedby": hasError ? `${name}-error` : undefined,
      };
    },
    [errors, handleBlur, handleChange, touched, values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    setValues,
    setValue,
    errors,
    setErrors,
    touched,
    setTouched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    getFieldProps,
    resetForm,
    isValid: Object.values(errors).every((err) => !err),
  };
}

