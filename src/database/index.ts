import { Connection, createConnection, getConnectionOptions } from 'typeorm';

interface IOptions {
  host: string;
  database?: string;
}

export default async (): Promise<Connection> => {
  return getConnectionOptions().then(options => {
    const newOptions = options as IOptions;
    newOptions.host = process.env.NODE_ENV === 'test' ? 'localhost' : 'db';
    newOptions.database =
      process.env.NODE_ENV === 'test' ? 'fin_app_test' : newOptions.database;
    return createConnection({
      ...options,
    });
  });
};
