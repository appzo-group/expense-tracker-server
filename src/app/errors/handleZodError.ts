import { ZodError } from 'zod';

import { IErrorMessage, IGenericErrorResponse } from '../../types/errors.types';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errorMessages: IErrorMessage[] = error.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1] ?? '',
    message: issue.message,
  }));

  return {
    statusCode: 422,
    message: 'Validation error',
    errorMessages,
  };
};

export default handleZodError;
