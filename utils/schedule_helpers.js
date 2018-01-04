module.exports = {
    cancelJobIfExist,
    convertToMinutes,
    pluralize
}

function cancelJobIfExist({ scheduler, suiteId, order }) {
    return new Promise((resolve, reject) => {
        scheduler.cancel({
            'name': 'runCase',
            'data.suiteId': suiteId,
            'data.order': order
        },
            (err, numberRemoved) => {
                if (err) reject(err);
                resolve(numberRemoved);
            }
        );
    })
};

function convertToMinutes({ schMins, schHrs, schDays }) {
    return (
        Number(schMins) +
        Number(schHrs) * 60 +
        Number(schDays) * 60 * 24
    )
}

function pluralize(num, singularForm, pluralForm) {
    pluralForm = pluralForm || singularForm + 's';
    return Number(num) > 1 ? `${num} ${pluralForm}` : `${num} ${singularForm}`;
}