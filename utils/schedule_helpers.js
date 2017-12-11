module.exports = {
    cancelJobIfExist,
    convertToMinutes,
    pluralize
}

function cancelJobIfExist({ agenda, suiteId, order }) {
    return new Promise((resolve, reject) => {
        agenda.cancel({
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

function convertToMinutes({ schMinutes, schHours, schDays }) {
    return (
        Number(schMinutes) +
        Number(schHours) * 60 +
        Number(schDays) * 60 * 24
    )
}

function pluralize(num, singularForm, pluralForm) {
    pluralForm = pluralForm || singularForm + 's';
    return Number(num) > 1 ? `${num} ${pluralForm}` : `${num} ${singularForm}`;
}