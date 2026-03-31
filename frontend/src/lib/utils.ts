export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));