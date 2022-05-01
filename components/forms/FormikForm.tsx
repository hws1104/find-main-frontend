/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Formik, FormikHelpers, FormikConfig } from 'formik';

export default function FormikForm<T>(props: FormikConfig<T>) {
  const { children, initialValues, onSubmit } = props;

  async function handleSubmit(values: T, actions: FormikHelpers<T>) {
    const { setStatus } = actions;
    try {
      await onSubmit(values, actions);
      setStatus({ formSubmitted: true });
    } catch (err) {
      // handle error
    }
  }

  return (
    <Formik<T> {...props} onSubmit={handleSubmit} initialValues={initialValues}>
      {children}
    </Formik>
  );
}
