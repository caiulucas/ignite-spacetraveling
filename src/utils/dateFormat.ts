import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dateFormat = (date: Date, showHours = false): string => {
  const formattedDate = showHours
    ? format(date, "d MMM yyyy, 'às' H:mm", { locale: ptBR })
    : format(date, 'd MMM yyyy', { locale: ptBR });

  return formattedDate;
};
