// let datea =new Date().getTime().toLocaleString()//.toISOString().slice(0, 19).replace('T', ' ')
// console.log("DATE"+datea);
// var d = new Date;

// var date = [
//     d.getFullYear(),
//     ('00' + d.getMonth() + 1).slice(-2),
//     ('00' + d.getDate() + 1).slice(-2)
// ].join('-');

// var time = [
//     ('00' + d.getHours()).slice(-2),
//     ('00' + d.getMinutes()).slice(-2),
//     ('00' + d.getSeconds()).slice(-2)
// ].join(':');

// var dateTime = date + ' ' + time;
// console.log(dateTime) // 2021-01-41 13:06:01

var sqlDatetime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');
console.log(sqlDatetime);