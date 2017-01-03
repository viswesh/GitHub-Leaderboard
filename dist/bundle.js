(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var API = {
    _fetchData: function _fetchData(URL) {
        return fetch(URL, {
            method: 'get'
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            return data;
        }).catch(function (err) {
            console.error(new Error(err));
        });
    },
    _fetchDetails: function _fetchDetails(loginId) {
        return fetch('https://api.github.com/users/' + loginId, {
            method: 'get'
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            return data;
        }).catch(function (err) {
            console.error(new Error(err));
        });
    }
};

exports.default = API;

},{}],2:[function(require,module,exports){
"use strict";

var _mainContent = require("./main-content.js");

var _mainContent2 = _interopRequireDefault(_mainContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainContent = new _mainContent2.default({ containerId: "main" });
mainContent.render();

},{"./main-content.js":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BASE_URI = "https://api.github.com/search/users?q=followers:%3E10000";

exports.BASE_URI = BASE_URI;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('./api.js');

var _api2 = _interopRequireDefault(_api);

var _constants = require('./constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MainContent = function () {
    function MainContent(conf) {
        _classCallCheck(this, MainContent);

        this.containerId = conf.containerId;
    }

    _createClass(MainContent, [{
        key: 'render',
        value: function render() {
            var _this = this;

            this._getCards();
            document.onreadystatechange = function (event) {
                if (document.readyState != "loading") {
                    _this._initComponents();
                }
            };
            this._addListeners();
        }
    }, {
        key: '_getCards',
        value: function _getCards() {
            var _this2 = this;

            var userlistURL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.BASE_URI;

            var data = _api2.default._fetchData(userlistURL);
            var cardsElements = data.then(function (response) {
                return response.items.map(function (item) {
                    return '<li class="collection-item avatar" data-login=' + item.login + ' data-reposURL="' + item.repos_url + '">\n                              <img src=' + item.avatar_url + ' alt="" class="circle">\n                              <span class="title">' + item.login + '</span>\n                              <p class="grey-text">Score: ' + item.score + ' </p>                        \n                            </li>';
                });
            });
            cardsElements.then(function (data) {
                document.querySelector('#' + _this2.containerId).innerHTML = data.join("");
                if (data.length == 0) {
                    document.querySelector('#details').innerHTML = '<div class="row center avatar z-depth-5">                                               \n                                            <p> No results.</p>\n                                            <a class="waves-effect waves-light btn-large clearfilters">Clear All Filters</a>\n                                        </div>';
                } else {
                    $(".collection-item.avatar").first().click();
                }
            });
        }
    }, {
        key: '_initComponents',
        value: function _initComponents() {
            var _this3 = this;

            var languagesURL = "../assets/data/languages.json";

            var langdata = _api2.default._fetchData(languagesURL);
            langdata.then(function (response) {
                var data = {};
                response.map(function (item) {
                    data[item.name] = null;
                });

                $('input.autocomplete').autocomplete({
                    data: data
                });

                $("#details").on("click", ".clearfilters", function (event) {
                    $("#autocomplete-input").val("");
                    _this3._getCards();
                });
            });

            $("#autocomplete-input").change(function (event) {
                var lang = $(event.currentTarget).val();
                var langQuery = "";
                if (lang.length) langQuery += "+language:" + $(event.currentTarget).val();
                var userlistURL = '' + _constants.BASE_URI + langQuery;
                _this3._getCards(userlistURL);
            });
        }
    }, {
        key: '_addListeners',
        value: function _addListeners() {
            $('.rigthpane').on("click", ".avatar", function (event) {
                var loginId = $(event.currentTarget).attr('data-login'),
                    reposURL = $(event.currentTarget).attr('data-reposURL');

                //get user information
                var detailsElement = _api2.default._fetchDetails(loginId).then(function (response) {
                    return '<div class="row avatar center z-depth-5">\n                            <img src=' + response.avatar_url + ' alt="" class="circle" onclick="window.open(\'' + response.html_url + '\')">\n                            <p>' + response.name + '</p>\n                            <p>' + response.company + '</p>\n                            <p>' + response.location + '</p>\n                        </div>\n                         ';
                });
                detailsElement.then(function (data) {
                    document.querySelector('#details').innerHTML = data;
                });

                //get repos
                var reposElement = _api2.default._fetchData(reposURL).then(function (response) {
                    return response.map(function (item) {
                        return '<div class="row">\n                              <div class="card-panel hoverable">\n                              <a href="' + item.html_url + '" target="_new">' + item.name + ' <span class="right">' + new Date(item.updated_at).toISOString().slice(0, 10) + '</span></a> \n                              <p class="green-text text-darken-2">' + item.description + '</p>\n                              <p class="valign-wrapper grey-text"><i class="material-icons">stars</i><span class="valign">' + item.stargazers_count + '</span></p>\n                            </div></div>';
                    });
                });
                reposElement.then(function (data) {
                    var node = document.createElement('div');
                    node.innerHTML = data.join("");
                    document.getElementById("details").appendChild(node);
                });
            });
        }
    }]);

    return MainContent;
}();

exports.default = MainContent;

},{"./api.js":1,"./constants.js":3}]},{},[2]);
