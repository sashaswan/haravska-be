const forever = require('forever-monitor');

const child = new (forever.Monitor)('server.js', {
    silent: false,
    killTree: true,
    args: []
});

child.start();
