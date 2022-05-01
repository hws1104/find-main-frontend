import { Formik, Form } from 'formik';
import { ReactNode } from 'react';

import { PrivateSaleSchema } from 'schemas/privateSale';

import { PrivateSaleFormValues } from './types';

interface PrivateSaleFormProps {
  onSubmit: (values: PrivateSaleFormValues) => void;
  children: ReactNode;
  initialValues: PrivateSaleFormValues;
}

export default function PrivateSaleForm(
  props: PrivateSaleFormProps
): JSX.Element {
  const { onSubmit, children, initialValues } = props;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={PrivateSaleSchema}
    >
      <Form>{children}</Form>
    </Formik>
  );
}
