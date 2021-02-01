require('dotenv').config();

const getConnection = require('../lib/db').getConnection;
const withPrefix = require('../lib/utils').withPrefix;
const dbConn = getConnection();

const DROP_IF_EXISTS = !!process.env.DROP;
const DB_PREFIX = process.env.DB_PREFIX || '';


const makeTable = async function (tableName, queryBuilder) {
    const table = withPrefix(tableName);
    const tableExists = await dbConn.schema.hasTable(table);

    if (tableExists) {
        console.log(`${tableName} exists. Nothing to do with it.`);
    }else{
        await dbConn.schema.createTable(table, queryBuilder);
    }
}

const dropIfExists = async function (tableName) {
    const table = withPrefix(tableName);
    console.log(`Droping if exists...${table}`)
    await dbConn.schema.dropTableIfExists(table);
}

const migrate = async function () {
    if (DROP_IF_EXISTS) {
        await dropIfExists('internal_orders');
        await dropIfExists('items');
        await dropIfExists('users');
    }

    await makeTable('users', (table) => {
        table.string('id').primary();
        table.unique('id');
        table.index('id');

        table.string('name');
        table.unique('name');
        table.string('status');
    });

    await makeTable('items', (table) => {
        table.increments('id').primary();
        table.unique('id');
        table.string('name');
        table.unique('name');
        table.integer('price');
        table.integer('type');
        table.index('id');
    });

    await makeTable('internal_orders', (table) => {
        const usersTable = withPrefix('users');
        const itemsTable = withPrefix('items');
        table.increments('id').primary();
        table.string('userId'). references('id').inTable(usersTable);
        table.integer('itemId').references('id').inTable(itemsTable);

        table.integer('amount');
        table.integer('totalPrice');
        table.integer('itemPrice');
        table.dateTime('postDate');
    });

    console.log('Migrated successfully.');
};

migrate().then(() => process.exit(0));