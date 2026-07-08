const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateContactMessage = (data) => {
  const errors = {};
  const name = data.name || '';
  const email = data.email || '';
  const message = data.message || '';

  if (!name.trim()) {
    errors.name = 'Name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!message.trim()) {
    errors.message = 'Message is required.';
  } else if (message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  } else if (message.trim().length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
