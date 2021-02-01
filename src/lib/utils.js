const DB_PREFIX = process.env.DB_PREFIX || '';

module.exports.withPrefix = (tableName) => `${DB_PREFIX}${tableName}`;