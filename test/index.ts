import {
  getHealthFactor,
  getUserDeposit,
  getUserReserve,
} from '../src/queriesAndResolvers'

const getUserReserveTest = async () => {
  const result = await getUserReserve(
    '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()
  )
  console.log(result)
}

// getUserReserveTest()

const userHealthFactorTest = async () => {
  const result = await getHealthFactor(
    '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()
  )
  console.log(result)
}
userHealthFactorTest()
