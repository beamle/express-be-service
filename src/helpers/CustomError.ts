export class CustomError extends Error {
  status: number;
  field: string;

  constructor({ message, field, status }: { message: string, status: number, field: string }) {
    super(message);
    this.status = status;
    this.field = field;
  }
}
