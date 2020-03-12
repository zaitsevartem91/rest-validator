const relationsQuery = 'select relations.table_name as table_name,\n' +
    '       relations.referencing_tables as reference,\n' +
    '       relations.constraint_name as name,\n' +
    '       relations.field as field\n' +
    'from(\n' +
    '        select pk_tco.table_name as table_name,\n' +
    '               fk_tco.table_name as referencing_tables,\n' +
    '               fk_tco.constraint_name as constraint_name,\n' +
    '               fk_t.column_name as field\n' +
    '        from information_schema.referential_constraints rco\n' +
    '                 join information_schema.table_constraints fk_tco\n' +
    '                      on rco.constraint_name = fk_tco.constraint_name\n' +
    '                          and rco.constraint_schema = fk_tco.table_schema\n' +
    '                 join information_schema.table_constraints pk_tco\n' +
    '                      on rco.unique_constraint_name = pk_tco.constraint_name\n' +
    '                          and rco.unique_constraint_schema = pk_tco.table_schema\n' +
    '                 join information_schema.key_column_usage fk_t\n' +
    '                     on fk_tco.constraint_name = fk_t.constraint_name\n' +
    '    ) relations;';

const tablesQuery = 'select table_name, column_name,' +
    ' is_nullable, data_type,' +
    ' character_maximum_length,' +
    ' character_octet_length,' +
    ' numeric_precision from information_schema.columns where table_name=$1';

const tableNamesQuery = 'select * from information_schema.tables where table_schema = $1';

const drivers = {
    mysql: {
        host: '127.0.0.1',
        port: '3306'
    },
    postgres: {
        host: '127.0.0.1',
        port: '5432'
    }
};

const isNull = {
    YES: 'false',
    NO: 'true'
};

module.exports = { relationsQuery, tablesQuery, tableNamesQuery, drivers, isNull };