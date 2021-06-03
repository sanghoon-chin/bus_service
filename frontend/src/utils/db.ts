const dbName = 'busInfo';
let version = 1;

const db = indexedDB.open(dbName, version);

db.addEventListener('upgradeneeded', (e:IDBVersionChangeEvent) => {
    const db = (e.target as IDBOpenDBRequest).result;
    
    const store = db.createObjectStore('users', {
        keyPath: 'username',
        autoIncrement: false
    });
    store.createIndex('birth', 'birth', {unique: false});
    store.createIndex('name', 'name', {unique: false});
})

export default db;