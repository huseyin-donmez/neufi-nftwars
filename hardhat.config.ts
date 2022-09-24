import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle";
const ALCHEMY_API_KEY = "pbEIdeJXjPVvvF298x0gSlFKrQv4pge9";
const GOERLI_PRIVATE_KEY = "212dfd0b05cf550ff97dd833f255af4897e06142f5f732366a0e94212af990ea";
const config: HardhatUserConfig = {
  solidity: "0.8.2",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};

export default config;
