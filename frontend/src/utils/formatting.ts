export const truncateAddress = (address: string, chars = 4): string => {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
  };
  
  export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  export const formatEther = (wei: string): string => {
    const ether = parseFloat(wei) / 1e18;
    return ether.toFixed(4);
  };
  
  export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };