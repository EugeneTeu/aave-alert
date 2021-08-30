export const getExplorerURl = (txnHash: string) => {
  if (process.env.env === 'dev') {
    return 'https://mumbai.polygonscan.com/tx/' + txnHash
  }
  return 'https://polygonscan.com/tx/' + txnHash
}
