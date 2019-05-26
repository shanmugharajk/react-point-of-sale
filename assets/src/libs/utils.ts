export const isValueExists = (object: any, keysToIgnore = []) => {
  const keys = Object.keys(object);
  const errors: any = {};

  const fn = (val: any) => {
    if (keysToIgnore.length === 0) return false;

    for (let i = 0; i < keysToIgnore.length; i++) {
      const element = keysToIgnore[i];
      if (element === val) return true;
    }
    return false;
  };

  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];
    const value = object[key];
    if ((!fn(key) && !value && value !== 0) || (!fn(key) && value === "")) {
      errors[key] = "Required field";
    }
  }

  return errors;
};

export const isValidEmail = (mail: string) => {
  // eslint-disable-next-line no-useless-escape
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
};
