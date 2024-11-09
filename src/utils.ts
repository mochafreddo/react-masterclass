export function makeImagePath(id: string, format = 'original'): string {
  return `https://image.tmdb.org/t/p/${format}/${id}`;
}
