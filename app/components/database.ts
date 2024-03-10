import postgres from 'postgres';

const sslSetting = 'development' === process.env.NODE_ENV ? false : 'allow';

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
    ssl: sslSetting,
});

export default sql