const { MongoClient } = require('mongodb');
require('dotenv').config();

let client = null;

let count = process.argv[2];

if(count === undefined){
    console.error("Please provide a count parameter. For example, to retrieve the TOP 10 findings run 'npm start 10'");
    process.exit(1);
}else{
    client = new MongoClient(process.env.DB_URI);
}

async function main(){
    await client.connect();
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
    let sortedArr = new Map([...map.entries()].sort().slice(0,parseInt(count)));
    console.log(sortedArr);
    return 'done';
}

main().then(console.log).catch(console.error).finally(() => client.close());