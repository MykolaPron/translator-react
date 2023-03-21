import {lib} from "../../index";
type queryOptions = {
    query?: { [T: string]: any }; // - query is either an object literal or null. If query is not supplied, all rows are returned
    limit?: number; // - limit is the maximum number of rows to be returned
    start?: number; // - start is the number of rows to be skipped from the beginning (offset)
    sort?: { [T: string]: any }[]; // - sort is an array of sort conditions, each one of which is an array in itself with two values
    distinct?: string[]; // - distinct is an array of fields whose values have to be unique in the returned rows
}
export class DBTable<T> {
    private readonly name: string;
    private readonly fields: string[];
    id: number | undefined;

    constructor(name: string, fields: string[]) {
        this.name = name
        this.fields = fields
    }

    create() {
        if (!lib.tableExists(this.name)) {
            lib.createTable(this.name, this.fields);
            lib.commit();
        }
    }

    getAll(options?: queryOptions): T[] {
        return lib.queryAll(this.name, options)
    }

    getById(id: number): T {
        return lib.queryAll(this.name, {query: {ID: id}})[0]
    }

    add<T>(data: T) {
        const recordId: number = lib.insert(this.name, data);
        lib.commit();
        return recordId
    }

    updateById<D>(id: number, data: D) {
        lib.update(this.name, {ID: id}, (row: T) => {
            return {...row, ...data};
        })
        lib.commit();
    }

    deleteById(id: number) {
        this.id = id
        this.beforeDelete()
        this.id = undefined
        lib.deleteRows(this.name, {ID: id});
        lib.commit();
    }
    beforeDelete(){

    }
}
