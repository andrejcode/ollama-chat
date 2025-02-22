/**
 * Wraps an asynchronous function to be used in contexts that expect a synchronous callback.
 * It calls the async function and discards its returned promise to prevent unhandled promise rejections.
 */
export function wrapAsync<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
): (...args: T) => void {
  return (...args: T): void => {
    void fn(...args);
  };
}
