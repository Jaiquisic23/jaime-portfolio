export const readingMinutes = (body: string) =>
  Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200));

export const articleDate = (date: string, lang = 'en') =>
  new Intl.DateTimeFormat(lang, {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date));
