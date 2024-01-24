const throttle = <T extends any[]>(fn: (...args: T) => void, delay: number) => {
  let execFn = false
  return (...args: T) => {
    if (!execFn) {
      fn(...args)
      execFn = true
      // Change run after delay to be able to execute the function a second time
      setTimeout(() => (execFn = false), delay)
    }
  }
}

export default throttle
