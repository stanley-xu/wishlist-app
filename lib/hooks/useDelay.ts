export function useDelayedCallback<T>(
  callback: (args?: any) => Promise<T>,
  ms: number
) {
  return (args?: any) =>
    new Promise<T>(async (resolve) =>
      setTimeout(async () => {
        resolve(await callback(args));
      }, ms)
    );
}
