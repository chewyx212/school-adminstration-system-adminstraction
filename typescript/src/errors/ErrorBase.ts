class ErrorBase extends Error {
  private errorCode: string | number;
  private httpStatusCode: number;
  private details?: unknown;

  constructor(message: string, errorCode: string | number, httpStatusCode: number, details?: unknown) {
    super(message);

    this.errorCode = errorCode;
    this.httpStatusCode = httpStatusCode;
    this.details = details;
  }

  public getMessage(): string {
    return this.message;
  }

  public getErrorCode(): string | number {
    return this.errorCode;
  }

  public getHttpStatusCode(): number {
    return this.httpStatusCode;
  }

  public getDetails(): unknown {
    return this.details;
  }
}

export default ErrorBase;
