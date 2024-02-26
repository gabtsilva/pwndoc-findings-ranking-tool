const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

const client = new MongoClient(process.env.DB_URI);

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

    let output = "";
    
    const sortedMap = new Map([...map.entries()].sort((a,b) => b[1] - a[1]));

    sortedMap.forEach((value, key) =>output += `${key} - Found ${value} time(s)\n`);

    output += `\nStatistics based on ${docs.length} audit(s) in PWNDOC's database`;

    fs.writeFileSync('./output.txt',output);
    
    return 'File generated';
}

main().then(console.log).catch(console.error).finally(() => client.close());