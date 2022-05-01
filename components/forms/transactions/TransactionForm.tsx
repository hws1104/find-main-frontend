import { ReactNode } from 'react';
import { Formik, Form } from 'formik';
import { ObjectSchema } from 'yup';
import { ContractTransaction } from '@ethersproject/contracts';

export interface BidFormValues {
  amount: string;
}

interface TransactionFormProps {
  children: ReactNode | ReactNode[];
  amount?: string;
  onSubmit: (values: BidFormValues) => Promise<ContractTransaction>;
  schema: ObjectSchema;
}

export default function TransactionForm(
  props: TransactionFormProps
): JSX.Element {
  const { amount, children, schema, onSubmit } = props;

  return (
    <Formik<BidFormValues>
      enableReinitialize
      initialValues={{ amount }}
      onSubmit={onSubmit}
      validationSchema={schema}
    >
      <Form style={{ width: '100%' }}>{children}</Form>
    </Formik>
  );
}
