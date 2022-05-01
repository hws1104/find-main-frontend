export const hasError = (meta: any, forceError: boolean): boolean =>
  (meta.error && meta.touched) || (meta.error && forceError);

export const getErrorStyles = (errorVisible: boolean): any => {
  const inputShadow = `inset 0 0 0 2px #F93A3A, 0px 10px 20px rgba(0,0,0,0.1)`;
  if (errorVisible) {
    return {
      boxShadow: inputShadow,
      '&:focus': {
        boxShadow: inputShadow,
      },
    };
  }
};
