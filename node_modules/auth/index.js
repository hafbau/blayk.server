/**
 * Auth Class
 */
const uuid = require('cuid');
const request = require('request-promise-native');

 class Media {
     constructor({ appId = uuid(), apiUrl = 'http://localhost:3010' }) {
        this.appId = appId;
        this.apiUrl = apiUrl;
     }

     init({ appId = this.appId, apiUrl = this.apiUrl }) {
         // backfills constructor
         this.appId = appId;
         this.apiUrl = apiUrl;
     }

    upload(fileStream, fieldName = 'file') {
        if (
            typeof fileStream.read !== 'function' ||
            typeof fileStream.on !== 'function'
        ) throw new Error(`${fileStream} must be a Readable Stream`)
        
        return request({
            method: 'POST',
            uri: `${this.apiUrl}/files`,
            formData: { [fieldName]: fileStream },
            json: true
        })
        .then(fileDetail => {
            return fileDetail;
        })
        .catch(err => {
            throw err
        })
    }
 }

 // exports a singleton instance
 module.exports = new Media({});