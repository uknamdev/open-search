const { Client } = require('@opensearch-project/opensearch');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'mock.json');

// Instantiate a client with basic auth as setup in the README.md file
const client = new Client({
    ssl: {
        rejectUnauthorized: false,
    },
    node: process.env.node,
    auth: {
        username: 'process.env.node.username,
        password: 'process.env.password',
    },
});

const printResponse = (title, response) => {
    console.log(`\n${title}:`);
    console.log(response.body);
};

const refreshIndex = async (indexName) => {
    try {
        const response = await client.indices.refresh({
            index: indexName,
        });

        printResponse(`Refresh response for index ${indexName}`, response);
    } catch (error) {
        handleErrorResponse(error);
    }
};

const handleErrorResponse = (error) => {
    if (error.meta && error.meta.body) {
        console.error('Error:', error.meta.body.error);
    } else {
        console.error('Error:', error.message);
    }
};

const createMoviesIndex = async () => {
    try {
        const response = await client.indices.create({
            index: 'users',
            body: {
                mappings: {
                    properties: {
                        "id": {
                            "type": "integer"
                        },
                        "first_name": {
                            "type": "text"
                        },
                        "last_name": {
                            "type": "text"
                        },
                        "email": {
                            "type": "text"
                        },
                        "gender": {
                            "type": "keyword"
                        },
                        "ip_address": {
                            "type": "ip"
                        }
                    }
                }
            },
        });

        printResponse('Create `movies` Index', response);
    } catch (error) {
        handleErrorResponse(error);
    }
};



const indexMovies = async () => {
    for (let i = 0; i < 10; i++) {
        await client.index({
            index: 'movies',
            id: i,
            body: {
                title: `The Dark Knight ${i}`,
                director: 'Christopher Nolan',
                year: 2008 + i,
            },
        });
    }

    await client.index({
        index: 'movies',
        body: {
            title: 'The Godfather',
            director: 'Francis Ford Coppola',
            year: 1972,
        },
    });

    await client.index({
        index: 'movies',
        body: {
            title: 'The Shawshank Redemption',
            director: 'Frank Darabont',
            year: 1994,
        },
    });
};

const searchMovies = async (query) => {
    const response = await client.search({
        index: 'users',
        body: query,
    });

    console.log('\nSearch Results:');
    response.body.hits.hits.forEach((element) => {
        console.log(element._source);
    });
};

module.exports = {
    searchUsers
}

const start = async (params) => {
    console.log(params);
    try {
        // const data = fs.readFileSync(filePath, 'utf-8');
        // const jsonData = JSON.parse(data);
        // await Promise.all(jsonData.map(async (item) => {
        //     await client.index({
        //         index: 'users',
        //         id: item.id,
        //         body: {
        //             id: item.id,
        //             first_name: item.first_name,
        //             last_name: item.last_name,
        //             email: item.email,
        //             gender: item.gender,
        //             ip_address: item.ip_address,
        //         },
        //     });
        // }));
        
        // Check the cluster health
        //const clusterHealthResponse = await client.cluster.health({});
        // console.log(clusterHealthResponse);
        // printResponse('Get Cluster Health', clusterHealthResponse);
        //const indexExistsResponse = await client.indices.exists({ index: 'movies' });
        //console.log(indexExistsResponse);
        // if (indexExistsResponse.statusCode === 200) {
        //     const deleteIndexResponse = await client.indices.delete({ index: 'movies' });
        //     printResponse('Delete existing `movies` Index', deleteIndexResponse);
        // }
        //await createMoviesIndex();
        // await indexMovies();

        // Refresh the 'movies' index
        //await refreshIndex('movies');
        //console.log('\nRefreshed `movies` Index');

        // List all movies using search
        //await searchMovies({});

        // Search for 'dark knight'
        // const movies = await searchMovies({
        //     query: {
        //         bool: {
        //             must: {
        //                 match: {
        //                     title: 'Dark Knight',
        //                 }
        //             }
        //         }
        //     },
        //     from: 0, 
        //     size: 5 
        // });
        // Delete the movies index
        //const deleteIndexResponse = await client.indices.delete({ index: 'movies' });
        //printResponse('Delete `movies` Index', deleteIndexResponse);
        return [];
    } catch (error) {
        console.log(error);
        handleErrorResponse(error);
    }
};

// const handler = async (event) => {
//     console.log(event);
//     await start({
//         name: "vishal"
//     });
// }

//handler();
