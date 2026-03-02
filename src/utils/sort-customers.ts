import { User } from '../types/user';

const sortCustomers = (customers: User[]) => {
  const sortedList = [...(customers || [])]
    .sort((a, b) =>
      a.name
        .charAt(0)
        .localeCompare(b.name.charAt(0), 'en', { sensitivity: 'base' }),
    )
    .reduce((r, e) => {
      let firstLetter = e.name.charAt(0);
      if (!r[firstLetter]) r[firstLetter] = { title: firstLetter, data: [e] };
      else r[firstLetter].data.push(e);
      return r;
    }, {} as Record<string, { title: string; data: User[] }>);

  return sortedList;
};

export default sortCustomers;
