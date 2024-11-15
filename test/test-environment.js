const expect  = require('chai').expect;
const fs = require('fs');
const path = require("path");

describe('testing src/environments/environment.ts', () =>{

    it('Make sure pointing to GCP API, and not localhost',  (done) => {
        fs.readFile(path.resolve(__dirname, '../src/environments/environment.js'), 'utf8', function(err, fileContents) {
            if (err) throw err;

            const firebaseFnBasePartial = '// backendApi: "https://us-central';
            expect(fileContents.indexOf(firebaseFnBasePartial)).to.equal(-1);

            const firebaseFnBasePartial2 = '//backendApi: "https://us-central';
            expect(fileContents.indexOf(firebaseFnBasePartial2)).to.equal(-1);

            done();
        });
    });
});

