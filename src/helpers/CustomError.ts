export class CustomError extends Error {
  status: number;
  field: string;
  name: string;

  constructor({ message, field, status }: { message: string, status: number, field: string }) {
    super(message);
    this.name = "CustomError";
    this.status = status;
    this.field = field;
  }
}
