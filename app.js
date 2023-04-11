const http = require('http');
const url = require('url');
const querystring = require('querystring');
const child_process = require('child_process');

const ACCESS_CODE = 'AM';
const PORT = 3000;

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url);
    const path = reqUrl.pathname;
    const query = querystring.parse(reqUrl.query);
    
    if (path === '/shutdown' && query.access_code === ACCESS_CODE) {
        child_process.exec('shutdown /p', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing shutdown command: ${error.message}`);
                res.statusCode = 500;
                res.end('Error shutting down the system');
            } else {
                console.log('System shutting down...');
                res.statusCode = 200;
                res.end('Shutting down the system...');
            }
        });
    } else {
        res.statusCode = 404;
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    
});
