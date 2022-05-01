import * as Yup from 'yup';

import { isEmptyOrNil } from 'utils/helpers';
import { createModelMimeType, isModel } from 'utils/assets';

type ErrorType = 'FILE_TOO_LARGE' | 'TYPE_NOT_SUPPORTED';

export type ErrorMessage =
  | 'This file is too large.'
  | 'This file type is not supported.'
  | 'This video codec is not supported.';

export const UPLOAD_ERRORS: Record<ErrorType, ErrorMessage> = {
  FILE_TOO_LARGE: 'This file is too large.',
  TYPE_NOT_SUPPORTED: 'This file type is not supported.',
};

const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/quicktime',
  'text/plain',
  'model/gltf-binary',
  'model/gltf+json',
];

// 50mb in bytes
const FILE_SIZE = 52428800;

export const UploadSchema = Yup.object().shape({
  file: Yup.mixed()
    .required()
    .test('fileSize', UPLOAD_ERRORS.FILE_TOO_LARGE, (value: File) => {
      const emptyValue = isEmptyOrNil(value);
      if (emptyValue) {
        return true;
      }
      return value.size <= FILE_SIZE;
    })
    .test('fileType', UPLOAD_ERRORS.TYPE_NOT_SUPPORTED, (value: File) => {
      const emptyValue = isEmptyOrNil(value);
      if (emptyValue) {
        return true;
      }
      const fallbackFormat = createModelMimeType(value.name);
      const isTypeEmpty = isEmptyOrNil(value.type);
      return SUPPORTED_FORMATS.includes(
        isTypeEmpty ? fallbackFormat : value.type
      );
    }),
  modelPoster: Yup.mixed().when('file', {
    is: (file) => {
      return isModel(file?.name);
    },
    then: Yup.mixed().required(),
  }),
});
