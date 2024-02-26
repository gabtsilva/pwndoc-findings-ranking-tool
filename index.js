const { MongoClient } = require('mongodb');
require('dotenv').config();
const client = new MongoClient(url);

async function main(){
    await client.connect(process.env.DB_URI);
    const db = client.db('pwndoc');
    const collection = db.collection("audits");

    const docs = await collection.find({}).toArray();
    let map = new Map();
    docs.forEach(element => {
        let findings = element.findings;
        findings.forEach(item => {
            if(map.get(item.title) === undefined){
                map.set(item.title,1);
            }else{
                map.set(item.title, map.get(item.title) + 1);
            }
        })
    });
    let sortedArr = new Map([...map.entries()].sort().slice(0,10));
    console.log(sortedArr);
    return 'done';
}

main().then(console.log).catch(console.error).finally(() => client.close());