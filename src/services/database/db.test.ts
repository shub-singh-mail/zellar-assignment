describe('db module', () => {
  const mockExecuteAsync = jest.fn();
  const mockExecuteBatchAsync = jest.fn();
  const mockClose = jest.fn();

  jest.mock('react-native-nitro-sqlite', () => ({
    open: jest.fn(() => ({
      executeAsync: mockExecuteAsync,
      executeBatchAsync: mockExecuteBatchAsync,
      close: mockClose,
    })),
  }));

  const dbModule = require('./db'); // Import after mock

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createTable calls executeAsync with proper query', async () => {
    mockExecuteAsync.mockResolvedValue('success');
    const result = await dbModule.createTable();
    expect(mockExecuteAsync).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE IF NOT EXISTS CUSTOMERS'),
    );
    expect(result).toBe('success');
  });

  it('createTable throws error when executeAsync fails', async () => {
    mockExecuteAsync.mockRejectedValue(new Error('fail'));
    await expect(dbModule.createTable()).rejects.toThrow('fail');
  });

  it('getCustomers returns array of users', async () => {
    const mockRows = {
      rows: {
        _array: [{ id: '1', name: 'John', email: 'a@test.com', role: 'ADMIN' }],
      },
    };
    mockExecuteAsync.mockResolvedValue(mockRows);

    const result = await dbModule.getCustomers();

    expect(mockExecuteAsync).toHaveBeenCalledWith(
      'SELECT id,email,name,role FROM CUSTOMERS',
    );
    expect(result).toEqual(mockRows.rows._array);
  });

  it('getCustomers returns empty array if rows._array is undefined', async () => {
    mockExecuteAsync.mockResolvedValue({ rows: {} });
    const result = await dbModule.getCustomers();
    expect(result).toEqual([]);
  });

  it('getCustomers throws custom error message when executeAsync fails', async () => {
    mockExecuteAsync.mockRejectedValue(new Error('fail'));
    await expect(dbModule.getCustomers()).rejects.toThrow(
      'Failed to get customers !!!',
    );
  });

  it('saveCustomers deletes old records and inserts new users', async () => {
    const users = [
      { id: '1', name: 'John', email: 'a@test.com', role: 'ADMIN' },
      { id: '2', name: 'Jane', email: 'b@test.com', role: 'MANAGER' },
    ];
    mockExecuteBatchAsync.mockResolvedValue('batch-success');

    const result = await dbModule.saveCustomers(users);

    expect(mockExecuteBatchAsync).toHaveBeenCalledWith([
      { query: 'DELETE FROM CUSTOMERS' },
      {
        query:
          'INSERT INTO CUSTOMERS(id, email, name, role) VALUES (?, ?, ?, ?)',
        params: ['1', 'a@test.com', 'John', 'ADMIN'],
      },
      {
        query:
          'INSERT INTO CUSTOMERS(id, email, name, role) VALUES (?, ?, ?, ?)',
        params: ['2', 'b@test.com', 'Jane', 'MANAGER'],
      },
    ]);
    expect(result).toBe('batch-success');
  });

  it('saveCustomers works with empty array (only delete command)', async () => {
    mockExecuteBatchAsync.mockResolvedValue('batch-success');
    const result = await dbModule.saveCustomers([]);
    expect(mockExecuteBatchAsync).toHaveBeenCalledWith([
      { query: 'DELETE FROM CUSTOMERS' },
    ]);
    expect(result).toBe('batch-success');
  });

  it('saveCustomers throws error if executeBatchAsync fails', async () => {
    mockExecuteBatchAsync.mockRejectedValue(new Error('fail'));
    await expect(
      dbModule.saveCustomers([
        { id: '1', name: 'John', email: 'a@test.com', role: 'ADMIN' },
      ]),
    ).rejects.toThrow('fail');
  });

  it('saveCustomer inserts a single user', async () => {
    const user = { id: '1', name: 'John', email: 'a@test.com', role: 'ADMIN' };
    mockExecuteAsync.mockResolvedValue('insert-success');

    const result = await dbModule.saveCustomer(user);

    expect(mockExecuteAsync).toHaveBeenCalledWith(
      'INSERT INTO CUSTOMERS(id, email, name, role) VALUES (?, ?, ?, ?)',
      ['1', 'a@test.com', 'John', 'ADMIN'],
    );
    expect(result).toBe('insert-success');
  });

  it('saveCustomer throws error if executeAsync fails', async () => {
    const user = { id: '1', name: 'John', email: 'a@test.com', role: 'ADMIN' };
    mockExecuteAsync.mockRejectedValue(new Error('fail'));

    await expect(dbModule.saveCustomer(user)).rejects.toThrow('fail');
  });

  it('closeDB calls db.close()', () => {
    dbModule.closeDB();
    expect(mockClose).toHaveBeenCalled();
  });
});
