import { Formik, Form } from 'formik';
import { ReactNode } from 'react';

import { ChangePriceArtworkSchema } from 'schemas/changePrice';

import { ChangePriceFormValues } from './types';

interface ChangePriceFormProps {
  onSubmit: (values: ChangePriceFormValues) => void;
  children: ReactNode;
  initialValues: ChangePriceFormValues;
}

export default function ChangePriceForm(
  props: ChangePriceFormProps
): JSX.Element {
  const { onSubmit, children, initialValues } = props;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={ChangePriceArtworkSchema}
      validateOnMount
    >
      <Form>{children}</Form>
    </Formik>
  );
}
