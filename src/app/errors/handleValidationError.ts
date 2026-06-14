import { Error as MongooseError } from 'mongoose';

import { IErrorMessage, IGenericErrorResponse } from '../../types/errors.types';

const handleValidationError = (
  error: MongooseError.ValidationError,
): IGenericErrorResponse => {
  const errorMessages: IErrorMessage[] = Object.values(error.errors).map(
    (el: MongooseError.ValidatorError | MongooseError.CastError) => ({
      path: el.path,
      message: el.message,
    }),
  );

  return {
    statusCode: 400,
    message: 'Validation error',
    errorMessages,
  };
};

export default handleValidationError;
