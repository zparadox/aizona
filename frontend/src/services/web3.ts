import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Define the ABI inline (you should replace this with your actual ABI)
const AgentGenomeABI: AbiItem[] = [
  // Add your contract ABI here
  // Example:
  // {
  //   "inputs": [],
  //   "name": "getAttributes",
  //   "outputs": [
  //     {
  //       "internalType": "uint256",
  //       "name": "",
  //       "type": "uint256"
  //     }
  //   ],
  //   "stateMutability": "view",
  //   "type": "function"
  // },
  // ... other functions
];

class Web3Service {
  private web3: Web3 | null = null;
  private agentGenomeContract: any = null;
  private contractAddress: string = process.env.REACT_APP_AGENT_GENOME_CONTRACT_ADDRESS || '';

  async initWeb3(): Promise<void> {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3(window.ethereum);
        console.log('Web3 initialized using MetaMask');
      } catch (error) {
        console.error('User denied account access:', error);
        throw new Error('User denied account access');
      }
    } else {
      console.warn('No web3 detected. Falling back to http://localhost:8545.');
      const provider = new Web3.providers.HttpProvider('http://localhost:8545');
      this.web3 = new Web3(provider);
    }

    await this.initContract();
  }

  private async initContract(): Promise<void> {
    if (!this.web3) {
      throw new Error('Web3 is not initialized');
    }

    try {
      this.agentGenomeContract = new this.web3.eth.Contract(AgentGenomeABI, this.contractAddress);
    } catch (error) {
      console.error('Error initializing contract:', error);
      throw new Error('Failed to initialize contract');
    }
  }

  async getAccounts(): Promise<string[]> {
    if (!this.web3) {
      throw new Error('Web3 is not initialized');
    }
    return await this.web3.eth.getAccounts();
  }

  async createAgent(attributes: number[], description: string): Promise<string> {
    if (!this.web3 || !this.agentGenomeContract) {
      throw new Error('Web3 or contract is not initialized');
    }

    const accounts = await this.getAccounts();
    const [intelligence, creativity, efficiency, autonomy, specialization] = attributes;

    try {
      const result = await this.agentGenomeContract.methods.updateAttributes(
        intelligence,
        creativity,
        efficiency,
        autonomy,
        specialization
      ).send({ from: accounts[0] });

      await this.agentGenomeContract.methods.updateDescription(description).send({ from: accounts[0] });

      return result.transactionHash;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  async getAgentAttributes(agentAddress: string): Promise<number[]> {
    if (!this.web3 || !this.agentGenomeContract) {
      throw new Error('Web3 or contract is not initialized');
    }

    try {
      const attributes = await this.agentGenomeContract.methods.getAttributes().call({ from: agentAddress });
      return [
        parseInt(attributes.intelligence),
        parseInt(attributes.creativity),
        parseInt(attributes.efficiency),
        parseInt(attributes.autonomy),
        parseInt(attributes.specialization)
      ];
    } catch (error) {
      console.error('Error getting agent attributes:', error);
      throw error;
    }
  }

  async getAgentDescription(agentAddress: string): Promise<string> {
    if (!this.web3 || !this.agentGenomeContract) {
      throw new Error('Web3 or contract is not initialized');
    }

    try {
      return await this.agentGenomeContract.methods.getDescription().call({ from: agentAddress });
    } catch (error) {
      console.error('Error getting agent description:', error);
      throw error;
    }
  }

  async getAgentGenomeString(agentAddress: string): Promise<string> {
    if (!this.web3 || !this.agentGenomeContract) {
      throw new Error('Web3 or contract is not initialized');
    }

    try {
      return await this.agentGenomeContract.methods.getGenomeString().call({ from: agentAddress });
    } catch (error) {
      console.error('Error getting agent genome string:', error);
      throw error;
    }
  }
}

export const web3Service = new Web3Service();
export default web3Service;