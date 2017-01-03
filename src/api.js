let API = {
    _fetchData: (URL)=> {
        return fetch(URL, {
            method: 'get'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        }).catch((err) => {
            console.error(new Error(err));
        });
    },
    _fetchDetails: (loginId)=> {
        return fetch(`https://api.github.com/users/${loginId}`, {
            method: 'get'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            return data;
        }).catch((err) => {
            console.error(new Error(err));
        });
    }
};

export default API;