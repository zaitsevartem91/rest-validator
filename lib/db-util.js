const pg = require("pg");
const mysql = require("mysql");

const { relationsQuery, tablesQuery, tableNamesQuery, drivers, isNull, getType, numbers } = require("./constants");
const { dataStructure, mergeSchemas, saveValidDataToTheFolder } = require('./util');

DB.prototype.connect = connect;
pg.Client.prototype.getTables = getTablesPostgres;

function DB(opts) {
    if (!(this instanceof DB)) return new DB(opts);
    this.db = opts;
}
function connect(opts) {
    if(opts !== undefined) this.db = opts;

    switch (this.db.driver) {
        case "postgres":
            return postgresDriver(this.db);
        case "mysql":
            return mysqlDriver(this.db);
    }
}

function mysqlDriver(data) {
        return 'mysql';
}

function postgresDriver(data) {
    const client = new pg.Client({
        user: data.user,
        password: data.password,
        database: data.database,
        port: data.port,
        host: data.host
    });

    client.connect(err => {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            console.log('connected')
        }
    });

    return client;
}

async function getTablesPostgres(path = 'myData', relations = false) {
    const rows = await this.query(
        tableNamesQuery,
        ['public'])
        .then(result => result.rows);
    const data = [];
    const tables = [];
    const references = await this.query(relationsQuery).then(result => result.rows);
    rows.forEach(row => {
      let values = this.query(tablesQuery, [row.table_name]);
      tables.push(dataStructure(row.table_name));
      data.push(values)
    });
    const resolvedData = await Promise.all(data).finally(()=> {
      this.end();
      console.log('disconnected')
    });

    resolvedData.forEach(data => {
      data.rows.forEach(row => {
        let table = tables.find(tab => row.table_name === tab.table);
        if (table) {
          table.data[row.column_name] = { is_nullable: row.is_nullable,
            data_type: row.data_type,
            character_maximum_length: row.character_maximum_length,
            character_octet_length: row.character_octet_length,
            numeric_precision: row.numeric_precision,
          };
        }
      });
    });

    return saveValidDataToTheFolder(path, generateSchema(mergeSchemas(tables, references, relations)))
}

function generateSchema(tables) {
    const dataTables = [];

    tables.forEach(table => {
        let keys = Object.keys(table.data);
        let object = {};
        levelDown(keys, table, object);
        dataTables.push({ table: table.table, data: object})
    });
    return dataTables;
}

function levelDown(keys, table, object) {
    keys.forEach(key => {
        if(table.data[key].hasOwnProperty('data_type')) {
            let params = table.data[key];
            let required = `required:${isNull[params.is_nullable]}`;
            let type = `type:${getType[params.data_type]}`;
            let min = `min:${params.character_maximum_length}`;
            let max = `, max:${params.character_octet_length}`;
            if(numbers.includes(params.data_type)){
                min = 'min:0';
                max = ``
            }
            if(params.data_type === 'boolean'){
                min = '';
                max = '';
            }
            object[key] = `${type}, ${required}, ${min}${max}`;
        } else {
            let levelTable = table.data[key];
            object[key] = {};
            levelDown(Object.keys(levelTable.data), levelTable , object[key])
        }
    })
}

module.exports = { drivers, DB };