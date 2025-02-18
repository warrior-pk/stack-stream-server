class ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;

  // This is a computed property, not a direct data field
  get success(): boolean {
    return this.statusCode < 400;
  }

  /**
   * Creates an API response object.
   * @param statusCode - HTTP status code of the response.
   * @param data - The actual data returned by the API.
   * @param message - A message providing context for the response (default is "Success").
   */
  constructor(statusCode: number, message: string = "Success", data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
