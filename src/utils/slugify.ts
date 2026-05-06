export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // decompose into base characters and diacritics
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-') // replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // trim hyphens from start
    .replace(/-+$/, ''); // trim hyphens from end
}
