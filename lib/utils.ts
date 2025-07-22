async function withPendingStates<T>(
  setter: (value: boolean) => void, 
  cb: () => Promise<T>
): Promise<T> {
  try {
    setter(true)
    return await cb()
  } catch (e) {
    throw e
  } finally {
    setter(false)
  }
}

export { withPendingStates }
