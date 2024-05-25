const express = require('express');
const { Client } = require('@opensearch-project/opensearch');

const client = new Client({
    ssl: {
        rejectUnauthorized: false,
    },
    node: 'HOST',
    auth: {
        username: 'username',
        password: 'password',
    },
});

const searchEntities = async () => {
    let allEntries = [];
    let from = 0;
    let totalHits = 0;
    let pageSize = 10
    // const response = await client.search({
    //     index: 'users',
    //     body: query,
    // });
    // return response.body.hits.hits;
    while (true) {
        try {
            const response = await client.search({
                index: 'users',
                body: {
                    query: {
                        match_all: {}
                    },
                    from: from,
                    size: pageSize
                }
            });

            const hits = response.body.hits.hits;
            totalHits = response.body.hits.total.value;

            if (hits.length === 0) {
                break;
            }

            allEntries = allEntries.concat(hits);

            from += pageSize;
            console.log(`Fetched ${allEntries.length} / ${totalHits} entries`);

            // Break if we have fetched all entries
            if (from >= totalHits) {
                break;
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
            break;
        }
    }

    return allEntries;
};

const app = express();

app.use(express.json());

app.post('/search', async (req, res) => {
    const { query } = req.body;
    const q1 = {
        query
    }
    const result = await searchEntities(q1);
    res.send({
        status: "success",
        data: result
    });
})
app.listen(3000, () => {
    console.log('app is running on port 3000')
})