const fetch = require('superagent');

// app link for jira
module.exports = ({ jiraURL, encodedCred, issue }) => {
console.log('in jira integration', jiraURL, encodedCred)
console.log('in jira integration ISSUE', issue)
    return fetch.post(`${jiraURL.replace(/\/$/, '')}/rest/api/2/issue`)
        .send(issue)
        .type('json')
        .set('Authorization', 'Basic ' + encodedCred)
        // .set('Referrer', jiraURL)
        .set('X-Atlassian-Token', 'nocheck')
        .set('Content-Type', 'application/json');
}