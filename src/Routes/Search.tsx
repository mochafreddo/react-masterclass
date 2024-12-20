import { useLocation } from 'react-router-dom';

export default function Search() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get('keyword') ?? '';

  return (
    <div className="search-container">
      <h1>Search Results</h1>
      {keyword ? <p>Showing results for: {keyword}</p> : <p>Please enter a search term</p>}
    </div>
  );
}
