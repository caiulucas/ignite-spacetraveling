import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dateFormat = (date: Date): string => {
  return format(date, 'd MMM yyyy', { locale: ptBR });
};
