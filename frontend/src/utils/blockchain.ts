import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

export const getWeb3 = (): Promise<Web3> => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        console.log('Injected web3 detected.');
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        const web3 = new Web3(provider);
        console.log('No web3 instance injected, using Local web3.');
        resolve(web3);
      }
    });
  });
};

export const signMessage = async (web3: Web3, account: string, message: string): Promise<string> => {
  try {
    return await web3.eth.personal.sign(message, account, '');
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};

export const verifySignature = (web3: Web3, message: string, signature: string): string => {
  try {
    return web3.eth.accounts.recover(message, signature);
  } catch (error) {
    console.error('Error verifying signature:', error);
    throw error;
  }
};

export const getAccounts = async (web3: Web3): Promise<string[]> => {
  try {
    return await web3.eth.getAccounts();
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};