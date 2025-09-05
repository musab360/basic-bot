// let raw = $input.first().json.Number || '';

function checkingNumbers(number) {
    let raw = number;
    let phone = raw.toString().trim();

    phone = phone.replace(/[\s\-().]/g, '');

    console.log(phone)
    if (phone.startsWith('+1') && phone.length === 12) {
        console.log("1")
        return { json: { phone: phone } };
    }
    
    if (phone.startsWith('001') && phone.length === 13) {
        console.log("2")
        phone = phone.replace(/^001/, '');
        phone = '+1' + phone;
        return { json: { phone: phone } };
    }
    
    if (phone.startsWith('1') && phone.length === 11) {
        console.log("3")
        phone = '+1'+ phone.slice(1);
        return { json: { phone: phone } };
    }
    
    if (/^\d{10}$/.test(phone)) {
        console.log("4")
        phone = '+1' + phone;
        return { json: { phone: phone } };
    }

    return { json: { phone: raw, warning: 'Unrecognized US number format (must start with 1 or be 10 digits)' } };
}

const number = "001-324-456-7890"
// console.log(number.length)
console.log(checkingNumbers(number))
