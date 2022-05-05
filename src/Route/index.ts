import router from './route';
let htmlStr = '';
router.forEach(element => {
    if (element.show === false) {
        return;
    }
    htmlStr += `<a style="display:block;
    width:100px;
    height:40px;
    color:'#333;
    text-decoration: none;
    margin-bottom:10px;
    font-size:14px;" href='#${element.path}'>${element.name}<a/>`;

});
document.body.innerHTML = htmlStr;