export class GenericResponse<T> {
  description: string;
  data: T | undefined;

  constructor(description: string, data: T | undefined) {
    this.description = description;
    this.data = data;
  }
}
