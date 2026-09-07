export const CANONICAL_DOMAINS = [
  "identity",
  "contact",
  "address",
  "revenue",
  "agriculture",
  "health",
  "education",
  "employment",
  "application",
];

export const rules = {
  required: (message = "This field is required.") => (value) => {
    if (value === undefined || value === null || String(value).trim() === "") {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (!value) return null;
    if (String(value).trim().length < min) {
      return message || `Must be at least ${min} characters.`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (!value) return null;
    if (String(value).trim().length > max) {
      return message || `Must not exceed ${max} characters.`;
    }
    return null;
  },

  validUrl: (message = "Must be a valid HTTPS or HTTP endpoint URL.") => (value) => {
    if (!value) return null;
    try {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return message;
      }
      return null;
    } catch {
      return message;
    }
  },

  validSlug: (message = "Slug format must be {entity}.{action} (e.g., application.submitted)") => (value) => {
    if (!value) return null;
    const slugRegex = /^[a-z0-9]+(\.[a-z0-9_]+)+$/;
    if (!slugRegex.test(value.trim())) {
      return message;
    }
    return null;
  },

  validCanonicalField: (message = "Field must match canonical vocabulary (e.g. identity.*, contact.*, revenue.*)") => (value) => {
    if (!value) return null;
    const trimmed = String(value).trim();
    const parts = trimmed.split(".");
    if (parts.length < 2 || !CANONICAL_DOMAINS.includes(parts[0])) {
      return message;
    }
    return null;
  },

  notMatching: (otherFieldKey, otherFieldLabel, message) => (value, formValues) => {
    if (!value || !formValues) return null;
    if (value === formValues[otherFieldKey]) {
      return message || `Cannot be the same as ${otherFieldLabel || otherFieldKey}.`;
    }
    return null;
  },
};

export function validateValue(value, fieldRules = [], allValues = {}) {
  for (const rule of fieldRules) {
    const error = rule(value, allValues);
    if (error) return error;
  }
  return null;
}

