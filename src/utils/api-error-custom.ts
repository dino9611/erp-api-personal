import { BaseError, TypeCodeStatus, find, IError } from "@point-hub/express-error-handler";

export class ApiErrorCustom extends BaseError {
  constructor(codeStatus: TypeCodeStatus, message?: string, errors?: object) {
    const status = find(codeStatus);

    if (!status) {
      throw new Error(`Error codeStatus "${codeStatus}" not found`);
    }

    const error: IError = status;
    if (message) {
      error.message = message;
    }
    if (errors) {
      error.errors = errors;
    }

    super(error);
  }

  get isOperational() {
    return true;
  }
}
