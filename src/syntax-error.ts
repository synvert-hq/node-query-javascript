class SyntaxError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, SyntaxError.prototype);
  }
}

export default SyntaxError;
