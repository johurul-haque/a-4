import { ErrorResponse } from '@/interface/errors';
import { AppError } from '@utils';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

export function appError(error: AppError): ErrorResponse {
  return {
    status: error.status,
    message: error.name,
    errorMessage: error.message,
    errorDetails: error,
    stack: error.stack,
  };
}

export function serverError(error: Error): ErrorResponse {
  return {
    status: 500,
    message: error.name,
    errorMessage: error.message,
    errorDetails: error,
    stack: error.stack,
  };
}

export function zodError(error: ZodError): ErrorResponse {
  const errorMessage = error.issues
    .map(
      (error) => `${error.path.join('.')} is ${error.message.toLowerCase()}.`
    )
    .join(' ');

  return {
    status: 403,
    message: 'Validation Error',
    errorMessage,
    errorDetails: error,
    stack: error.stack,
  };
}

export function mongooseError(
  error: mongoose.Error.ValidationError
): ErrorResponse {
  const formatMessage = () => {
    const regexResult = /Path `(.+?)` is required/g;
    const validationErrors = error.message.match(regexResult);

    if (validationErrors) {
      const formattedErrors = validationErrors.map((error) =>
        error.replace(/Path `(.+?)` is required/, '$1 is required')
      );
      return formattedErrors.join('. ');
    }

    return 'Invalid Validation Error';
  };

  return {
    status: 403,
    message: 'Validation Error',
    errorMessage: formatMessage(),
    errorDetails: error,
    stack: error.stack,
  };
}

export function castError(error: mongoose.CastError): ErrorResponse {
  const formatMessage = () => {
    const regexResult =
      /value "(.*?)" \(type string\) at path "(.*?)" for model "(.*?)"/.exec(
        error.message
      );

    if (regexResult) {
      const [, value] = regexResult;
      return `${value} is not a valid ID!`;
    }

    return 'Invalid Cast Error';
  };

  return {
    status: 400,
    message: 'Invalid ID',
    errorMessage: formatMessage(),
    errorDetails: error,
    stack: error.stack,
  };
}

export function duplicateError(error: any): ErrorResponse {
  const { keyValue } = error;
  const errorMessage = Object.keys(keyValue)
    .map((path) => {
      return `${path}: ${keyValue[path]} already exists`;
    })
    .join('. ');

  return {
    status: 409,
    message: 'Duplicate Entry',
    errorMessage,
    errorDetails: error,
    stack: error.stack,
  };
}
