import * as Yup from 'yup';

import { parseFiat } from 'utils/formatters';

export const PrivateSaleSchema = Yup.object().shape({
  buyerAddress: Yup.string().required('A collector must be set'),
  price: Yup.number()
    .transform((o, v) => parseFiat(v))
    .min(0, 'Must be at least ${min} ETH')
    .max(100000, 'Must be less than ${max} ETH')
    .nullable()
    .required('Price is required'),
  personalMessage: Yup.string()
    .max(200, 'Can’t be more than 200 characters')
    .nullable(),
});
