const fetch = require('superagent');

const createText = (caseRan) => {
    if (caseRan && caseRan.steps && caseRan.steps.length) {
        return caseRan.steps.some(step => !step.pass) ?
            `@channel Your recent run of ${caseRan.title} failed` :
            `@channel Your recent run of ${caseRan.title} passed`
    }
    return 'noop!'
}

// app link for jira
module.exports = (caseRan, userSlackEndPoint) => {
    // checks userSlackEndPoint
    // TODO: checks for valid urls
    if (!userSlackEndPoint) return;
    
    return fetch.post(userSlackEndPoint)
        .send({
            icon_url: 'http://localhost:4000/img/favicon.png',
            username: "Blayk",
            text: createText(caseRan)
        })
        .type('json')
        .set('Content-Type', 'application/json');
}