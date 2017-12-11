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
module.exports = (caseRan, userSlackEndPoint = 'https://hooks.slack.com/services/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') => {
    return fetch.post(userSlackEndPoint)
        .send({
            icon_url: 'http://localhost:4000/img/favicon.png',
            username: "Blayk",
            text: createText(caseRan)
        })
        .type('json')
        .set('Content-Type', 'application/json');
}