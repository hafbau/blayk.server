const media = require('./index');
const fs = require('fs');
const test = require('tape-promise/tape');

// TODO mock / stub out xhr request to server
test('Media#upload should upload filestream', function(t) {
    file = fs.createReadStream('./test.jpg');
    return media.upload(file)
        .then(response => {
            t.ok(response, 'Response is truthy')
            t.ok(response.success, 'Response sucess is true')
            t.ok(Array.isArray(response.files), 'Response.files is array')
            t.ok(response.files.length, 'Response.files is not empty')
            t.ok(typeof response.files[0] === 'string', 'type of file_id is a string')
            t.ok(response.files[0].length, 'file_id is not an empty string')
        })
});
