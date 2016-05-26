var list;

exports.get = function(req, res, next) {

    var data = {
        title: 'Developer List',
        devs: list
    };
    list = null;
    res.render('dev', {
        data: data
    });
    
}
exports.post = function(req, res, next) {

    list = req.body.list;
   
    res.send('ok');

}
