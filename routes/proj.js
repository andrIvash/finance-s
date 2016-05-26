var list;

exports.get = function(req, res, next) {

    var data = {
        title: 'Project List',
        projects: list
    };
    list = null;
    res.render('proj', {
        data: data
    });

}
exports.post = function(req, res, next) {

    list = req.body.list;
    res.send('ok');


}
