var mainModule = (function () {
    var Developer = function (name, rate) {
        this.name = name || null;
        this.rate = rate || 0;
        this.date = new Date().toString();
    };
    Developer.prototype.show = function () {
        return {
            name: this.name,
            rate: this.rate,
            date: this.date
        }
    }
    var Project = function (name, rate) {
        this.name = name || null;
        this.rate = rate || 0;
        this.date = new Date().toString();
        this.devs = [];
    };

    var mainStorage = localStorage;

// define initial object
    var devList = {
        listName: 'devList',
        list: []
    };
    var projList = {
        listName: 'projList',
        list: []
    }

// listeners
    function _setUpListners() {
        formDev.addEventListener('submit', _submitForm);  // submit developer form
        formDev.addEventListener('focus', function () {
            this.classList.remove('error');
        }, true);
        formProj.addEventListener('submit', _submitForm); //submit project form
        formProj.addEventListener('focus', function () {
            this.classList.remove('error');
        }, true);
        delDevList.addEventListener('click', function () {  // remove all developer data handler
            _removeAllData(devList, 'devList');
        });
        delProjList.addEventListener('click', function () { // remove all project data handler
            _removeAllData(projList, 'projList');
        });
        mform.addEventListener('submit', _modalFormHandler); //submit modal form
        mform.addEventListener('focus', function () {
            this.classList.remove('error');
            var errorElem = document.querySelector('.modal__error');
            errorElem.innerHTML = '';
        }, true); // focus  on modal form handler
        cModal.addEventListener('click', function(e){  // close modal
            e.preventDefault();
            modal.style.display = 'none';
        }) // close modal form
        dlink.addEventListener('click', _toDevPage) // to dev page handler
        plink.addEventListener('click', _toProjPage) // to project page handler
    }

//checking data in LocalStorage
    function _checkData(obj) {
        if (JSON.parse(mainStorage.getItem(obj.listName)))
            return true
    }
//add Data to LocalStorage
    function _addData(obj, data) {
        if (_checkData(obj))
            obj = JSON.parse(mainStorage.getItem(obj.listName));
        obj.list.push(data);
        mainStorage.setItem(obj.listName, JSON.stringify(obj));
        return obj;
    }
//remove Item from LocalStorage
    function removeItem(obj, name, parent) {
        if (_checkData(obj)) {
            obj = JSON.parse(mainStorage.getItem(obj.listName));
            obj.list.forEach(function (elem, index) {
                if (elem.name === name) {
                    obj.list.splice([index], 1);
                }
            });
            mainStorage.setItem(obj.listName, JSON.stringify(obj));
            console.log('item remove')
            parent.remove();
        }
    }
//remove All Data from LocalStorage
    function _removeAllData(obj, name) {
        if (_checkData(obj)) {
            mainStorage.removeItem(obj.listName);
            obj = {
                listName: name,
                list: []
            };
            console.log('data remove')
            var list = document.querySelector('.main__list.' + name);
            list.innerHTML = '';
        } else {
            throw new Error('obj is not found')
        }
    }
//add Developer to Project
    function _addDev(projName, devName) {
        var flag = false;
        var projObj = JSON.parse(mainStorage.getItem('projList'));
        var devObj = JSON.parse(mainStorage.getItem('devList'));
        projObj.list.forEach(function (p) {
            if (p.name === projName) {
                var proj = p.devs;
                devObj.list.forEach(function (d, index) {
                    if (d.name === devName) {
                        proj.push(devObj.list[index]);
                        mainStorage.setItem('projList', JSON.stringify(projObj));
                        flag = true
                    }
                });
            }
        });
        if(flag) {
            return projObj;
        } else {
            return false;
        }
    }
//remove Developer from Project
    function _removeDev(projName, devName) {
        var projObj = JSON.parse(mainStorage.getItem('projList'));
        projObj.list.forEach(function (p) {
            if (p.name === projName) {
                var proj = p.devs;
                proj.forEach(function (d, index) {
                    if (d.name === devName) {
                        proj.splice([index], 1);
                        mainStorage.setItem('projList', JSON.stringify(projObj));
                    }
                });
            }
        });
        return projObj;
    }
// modal form handler
    function _modalFormHandler(e){
        e.preventDefault();
        var form = e.target,
            projName = form.dataset.projName,
            devName = form.name.value,
            errorElem = document.querySelector('.modal__error');
        errorElem.innerHTML = '';
        var item = _addDev(projName, devName);
        if(item) {
            modal.style.display = 'none';
            _dataShow(item, '.projList');
        } else {
            errorElem.innerHTML = 'user not found';
            form.classList.add('error');
            form.reset;
        }
    }
// submit form handler
    function _submitForm(e) {
        e.preventDefault();
        var form = e.target,
            obj = form.dataset.form; // read data attr - name of list (dev or proj)
            //devItem = null;
        if (_validate(form)) { //validation form
            switch (obj) {
                case 'DevList': {
                    var item = _addData(devList, new Developer(form.name.value, form.rate.value)); //update devList
                    _dataShow(item, '.devList'); // show devList in specified block
                    break;
                }
                case 'ProjList': {
                    var item = _addData(projList, new Project(form.name.value, form.rate.value)); //update devList
                    _dataShow(item, '.projList'); // show devList in specified block
                    break;
                }
            }
            var formData = {
                'name': form.name.value,
                'rate': form.rate.value
            }
            form.reset();
        } else {
            form.classList.add('error');
            form.reset();
        }
    }
// validation form
    function _validate(form) {
        var checkN = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;
        return (form.elements.name.value != "" && checkN.test(form.elements.rate.value)) ? true : false;
    }
// show lists (dev or proj in specified block)
    function _dataShow(obj, parent) {
        var parent = document.querySelector(parent);
        parent.innerHTML = '';
        obj.list.forEach(function(elem) {
            var item = document.createElement('li');
            var btn = document.createElement('button');
            btn.innerText = 'del';
            btn.className = "itemBtn";
            btn.dataset.itemName = elem.name;
            btn.dataset.obj = obj.listName;
            btn.addEventListener('click', _itemBtnClick, false);
            item.className = 'main__item';
            item.innerHTML = "<div class='dev__name'>Name: " + elem.name
                + "</div>" + "<div class='dev__rate'>Rate (p/h $): " + elem.rate
                + "</div>" + "<div class='dev__date>'>Date: " + elem.date
                + "</div>";
            parent.appendChild(item);
            item.appendChild(btn);
            if (obj.listName === 'projList') {
                var devBtn = document.createElement('button');
                var devsList = document.createElement('ul');
                devsList.className = 'projList__devs.devs'
                devBtn.innerText = 'add Dev';
                devBtn.className = 'addDevBtn';
                devBtn.dataset.itemName = elem.name;
                devBtn.dataset.obj = obj.listName;
                devBtn.addEventListener('click', _addDevBtnClick, false);
                item.appendChild(devBtn);
                item.appendChild(devsList);
                if (elem.devs.length) {
                    elem.devs.forEach(function(dev) {
                        var inner = document.createElement('li');
                        var btn = document.createElement('button');
                        btn.innerText = 'del';
                        btn.className = "itemBtn";
                        btn.dataset.itemName = dev.name;
                        btn.dataset.projName = elem.name;
                        btn.addEventListener('click', _dellDevBtnClick, false);
                        inner.className = 'devs__item';
                        inner.innerHTML = "<div class='dev__name'>Name: " + dev.name
                            + "</div>" + "<div class='dev__rate'>Rate (p/h $): " + dev.rate
                            + "</div>" + "<div class='dev__date>'>Date: " + dev.date
                            + "</div>";
                        devsList.appendChild(inner);
                        inner.appendChild(btn);
                    });
                }
            }
        });
    }
// click on item handler (developer or project)
    function _itemBtnClick(e) {
        var elem = e.target,
            parent = elem.parentNode;
        var obj = elem.dataset.obj, // read data attr - name of list (dev or proj)
            name = elem.dataset.itemName;
        switch (obj) {
            case 'devList': {
                removeItem(devList, name, parent);
                break;
            }
            case 'projList': {
                removeItem(projList, name, parent);
                break;
            }
        }
    }
// add developer to project handler
    function _addDevBtnClick(e) {
        var elem = e.target,
            parent = elem.parentNode,
            modal = document.getElementById('modal'),
            obj = elem.dataset.obj,
            projName = elem.dataset.itemName;
        mform.dataset.projName = projName;
        modal.style.display = 'block';
    }
// dell developer from project handler
    function _dellDevBtnClick(e) {
        var elem = e.target,
            parent = elem.parentNode,
        // list = parent.querySelector('.projList__devs'),
        // modal = document.getElementById('modal'),
        // obj = elem.dataset.obj,
            devName = elem.dataset.itemName,
            projName = elem.dataset.projName;
        var item = _removeDev(projName, devName);
        _dataShow(item, '.projList');
    }

// link to  developer page handler
    function _toDevPage(e) {
        e.preventDefault();
        if (JSON.parse(mainStorage.getItem('devList'))) {
            //var item = JSON.parse(mainStorage.getItem('devList'));
            _sendTo('/dev', mainStorage.getItem('devList'));
        }
    }
// link to  project page handler
    function _toProjPage(e) {
        e.preventDefault();
        if (JSON.parse(mainStorage.getItem('projList'))) {
            //var item = JSON.parse(mainStorage.getItem('devList'));
            _sendTo('/proj', mainStorage.getItem('projList'));
        }
    }
// send data to Node and transfer
    function _sendTo(url, data) {
        var promise = _dataLoad(url, data);
        promise.then(function(result) {
            console.log(result);
            window.location.href = url;
        }, function(err) {
            console.log(err);
        });
    }
// load data
    function _dataLoad(url, data) {
       return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.onload = function () {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(Error('Data didn\'t load successfully; error code:' + request.statusText));
                }
            };
            request.send(data);
            request.onerror = function () {
                reject(Error('There was a network error.'));
            };
       });
    }

    return {
        init: function () {
            _setUpListners();
        },
        render: function(obj, parent) {
            _dataShow(obj, parent)
        }
    }

}());

console.log('hello test work');

var mainBlock = document.getElementById('finance');
var developerBlock = document.getElementById('developers');
var projectBlock = document.getElementById('projects');

// initial view
if (mainBlock) {
    mainModule.init();

    if (JSON.parse(localStorage.getItem('devList'))) {
        var item = JSON.parse(localStorage.getItem('devList'));
        mainModule.render(item, '.devList');
    }
    if (JSON.parse(localStorage.getItem('projList'))) {
        var item = JSON.parse(localStorage.getItem('projList'));
        mainModule.render(item, '.projList');
    }
}
//save json to file (developers list)
if (developerBlock) {
    if (JSON.parse(localStorage.getItem('devList'))) {
        var item = localStorage.getItem('devList');
        var blob = new Blob([item], {type: "application/json"});
        var url  = URL.createObjectURL(blob);
        downD.download = "developer.json";
        downD.href = url;
    }
}

//save json to file (project list)
if (projectBlock) {
    if (JSON.parse(localStorage.getItem('projList'))) {
        var item = localStorage.getItem('projList');
        var blob = new Blob([item], {type: "application/json"});
        var url  = URL.createObjectURL(blob);
        downP.download = "project.json";
        downP.href = url;
    }
}


