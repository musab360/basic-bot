// let raw = $input.first().json.Number || '';

function checkingNumbers(number) {
    let raw = number;
    let phone = raw.toString().trim();
    
    phone = phone.replace(/[\s\-().]/g, '');
    if (phone.startsWith('+92') || phone.startsWith('+1')) {
        return { json: { phone: phone } };
    }

    if (
        phone.startsWith('0092') ||
        phone.startsWith('92') ||
        phone.startsWith('03') ||
        (phone.length === 10 && phone.startsWith('3'))
    ) {
        phone = phone.replace(/^0092/, '');
        phone = phone.replace(/^92/, '');
        phone = phone.replace(/^0/, '');
        phone = '+92' + phone;
        return { json: { phone: phone } };
    }

    if (
        phone.startsWith('001') ||
        (phone.startsWith('1') && phone.length === 11) ||
        phone.length === 10
    ) {
        phone = phone.replace(/^001/, '');
        phone = phone.replace(/^1/, '');
        phone = '+1' + phone;
        return { json: { phone: phone } };
    } else { return { json: { phone: raw, warning: 'Unrecognized format' } }; }
}

console.log(checkingNumbers("03146260032"))