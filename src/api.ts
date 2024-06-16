export async function fetchCoins() {
  const response = await fetch('https://api.coinpaprika.com/v1/coins');
  return response.json();
}
