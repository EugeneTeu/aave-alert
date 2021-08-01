// util method to convert the decimal place of different assets
// ERC20 tokens uses 10^18
// USDC token uses 10^6

import { utils } from 'ethers'

const formatUSDC = (usdc: number) => utils.formatUnits(usdc, 6)

const formatERC20 = (erc20: number) => utils.formatEther(erc20)

export { formatUSDC, formatERC20 }
