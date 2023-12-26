export type ErrorResponse = {
  success?: boolean;
  status: number;
  message: string;
  errorMessage: string;
  errorDetails: object;
  stack: string | undefined;
};
