import API from './api.js';
import {BASE_URI} from './constants.js';

export default class MainContent {
    constructor(conf) {
        this.containerId = conf.containerId;
    }

    render() {
        this._getCards();
        document.onreadystatechange = (event) => {
            if (document.readyState != "loading") {
                this._initComponents();
            }
        };
        this._addListeners();
    }

    _getCards(userlistURL = BASE_URI) {
        let data = API._fetchData(userlistURL);
        let cardsElements = data.then((response) => {
            return response.items.map((item) => {
                return `<li class="collection-item avatar" data-login=${item.login} data-reposURL="${item.repos_url}">
                              <img src=${item.avatar_url} alt="" class="circle">
                              <span class="title">${item.login}</span>
                              <p class="grey-text">Score: ${item.score} </p>                        
                            </li>`
            });
        });
        cardsElements.then((data)=> {
            document.querySelector(`#${this.containerId}`).innerHTML = data.join("");
            if (data.length == 0) {
                document.querySelector(`#details`).innerHTML = `<div class="row center avatar z-depth-5">                                               
                                            <p> No results.</p>
                                            <a class="waves-effect waves-light btn-large clearfilters">Clear All Filters</a>
                                        </div>`;
            } else {
                $(".collection-item.avatar").first().click();
            }
        });
    }

    _initComponents() {
        const languagesURL = "../assets/data/languages.json";

        let langdata = API._fetchData(languagesURL);
        langdata.then((response)=> {
            let data = {};
            response.map((item)=> {
                data[item.name] = null;
            });

            $('input.autocomplete').autocomplete({
                data: data
            });

            $("#details").on("click", ".clearfilters", (event)=> {
                $("#autocomplete-input").val("");
                this._getCards();
            });
        });

        $("#autocomplete-input").change((event) => {
            let lang = $(event.currentTarget).val();
            let langQuery = "";
            if (lang.length) langQuery += "+language:" + $(event.currentTarget).val();
            let userlistURL = `${BASE_URI}${langQuery}`;
            this._getCards(userlistURL);
        });
    }

    _addListeners() {
        $('.rigthpane').on("click", ".avatar", (event) => {
            let loginId = $(event.currentTarget).attr('data-login'),
                reposURL = $(event.currentTarget).attr('data-reposURL');

            //get user information
            let detailsElement = API._fetchDetails(loginId).then((response) => {
                return `<div class="row avatar center z-depth-5">
                            <img src=${response.avatar_url} alt="" class="circle" onclick="window.open('${response.html_url}')">
                            <p>${response.name}</p>
                            <p>${response.company}</p>
                            <p>${response.location}</p>
                        </div>
                         `
            });
            detailsElement.then((data)=> {
                document.querySelector(`#details`).innerHTML = data;
            });

            //get repos
            let reposElement = API._fetchData(reposURL).then((response) => {
                return response.map((item) => {
                    return `<div class="row">
                              <div class="card-panel hoverable">
                              <a href="${item.html_url}" target="_new">${item.name} <span class="right">${new Date(item.updated_at).toISOString().slice(0, 10)}</span></a> 
                              <p class="green-text text-darken-2">${item.description}</p>
                              <p class="valign-wrapper grey-text"><i class="material-icons">stars</i><span class="valign">${item.stargazers_count}</span></p>
                            </div></div>`
                });
            });
            reposElement.then((data)=> {
                let node = document.createElement('div');
                node.innerHTML = data.join("");
                document.getElementById("details").appendChild(node);
            });
        });
    }
}