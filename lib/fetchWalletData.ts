import axios from 'axios';

export interface WalletData {
  address: string;
  balance: string;
  transactionCount: number;
  tokens: any[];
  nfts: any[];
  lastTransactionDate?: string;
  network: string;
}

export async function fetchWalletData(address: string, isDemo: boolean = false): Promise<WalletData> {
  if (isDemo || !address) {
    return getDemoData(address || '0xDemo...123');
  }

  try {
    // Basic Etherscan / Moralis integration (placeholder logic - requires real API keys)
    // For now returning something mixed or demo if key is missing
    const etherscanKey = process.env.ETHERSCAN_API_KEY;
    const moralisKey = process.env.MORALIS_API_KEY;

    if (!etherscanKey && !moralisKey) {
      console.warn('Missing API keys, falling back to demo data');
      return getDemoData(address);
    }

    // Example with Etherscan for balance
    let balance = '0';
    if (etherscanKey) {
      const resp = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanKey}`);
      if (resp.data.status === '1') {
        balance = (BigInt(resp.data.result) / BigInt(10 ** 18)).toString();
      }
    }

    return {
      address,
      balance,
      transactionCount: 42, // Dummy for now
      tokens: [],
      nfts: [],
      network: 'Ethereum',
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return getDemoData(address);
  }
}

function getDemoData(address: string): WalletData {
  return {
    address,
    balance: '1.24',
    transactionCount: 156,
    tokens: [
      { name: 'PEPE', symbol: 'PEPE', balance: '1000000', value: '$12.4' },
      { name: 'WETH', symbol: 'WETH', balance: '0.05', value: '$120' }
    ],
    nfts: [
        {name: 'Cored Ape #123', collection: 'Bored Ape Yacht Club'},
        {name: 'CryptoPunk #99', collection: 'CryptoPunks'}
    ],
    lastTransactionDate: '2 hours ago',
    network: 'Ethereum Mainnet'
  };
}
