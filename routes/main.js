exports.get = function(req, res) {
    //console.log(localStorage);
    res.render('index', {
        title: 'Financial accounting sheet'
    });
};
