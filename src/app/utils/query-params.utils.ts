export function isNotValidPage(page: string, maxPages: number) {
  if (isNaN(+page)) return true;
  
  const isLessMinimum = +page < 1;
  const isMoreMaximum = +page > maxPages;

  return isLessMinimum || isMoreMaximum;
}