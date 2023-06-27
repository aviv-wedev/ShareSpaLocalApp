class GeneralUtilities {
  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, ms);
    });
  }
}

export default new GeneralUtilities();
