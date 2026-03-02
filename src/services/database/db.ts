import { open } from 'react-native-nitro-sqlite';
import { User } from '../../types/user';

export const db = open({ name: 'myDb.sqlite' });

export const closeDB = () => db.close();

export const createTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS CUSTOMERS (
        id TEXT NOT NULL,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL
    );`;

  const result = await db.executeAsync(query);
  return result;
};

export const getCustomers = async (): Promise<User[]> => {
  try {
    const results = await db.executeAsync(
      `SELECT id,email,name,role FROM CUSTOMERS`,
    );
    return (results.rows?._array || []) as User[];
  } catch (error) {
    console.error(error);
    throw Error('Failed to get customers !!!');
  }
};

export const saveCustomers = async (items: User[]) => {
  const deleteCommand = { query: `DELETE FROM CUSTOMERS` };
  const commands = items.map(({ id, email, name, role }) => ({
    query: `INSERT INTO CUSTOMERS(id, email, name, role) VALUES (?, ?, ?, ?)`,
    params: [id, email, name, role],
  }));

  const res = await db.executeBatchAsync([deleteCommand, ...commands]);
  return res;
};

export const saveCustomer = async ({ id, email, name, role }: User) => {
  const res = await db.executeAsync(
    'INSERT INTO CUSTOMERS(id, email, name, role) VALUES (?, ?, ?, ?)',
    [id, email, name, role],
  );
  return res;
};
