export default class API{
    constructor(appId, apiKey, beginRequest, endRequest){
        this.appId = appId;
        this.apiKey = apiKey;
        this.endpoints = {
            REGISTER: 'users/register',
            LOGIN: 'users/login',
            LOGOUT: 'users/logout',
        };
        this.beginRequest = ()=>{
            if (beginRequest){
                beginRequest();
            }
        };
        this.endRequest = ()=>{
            if (endRequest){
                endRequest();
            }
        };
    }


     host(endpoint) {
        return `https://api.backendless.com/${this.appId}/${this.apiKey}/${endpoint}`;
    }

    getOptions(headers){
        const token = sessionStorage.getItem('userToken');

        const options =  {headers: headers || {} };
        if (token !== null){
            Object.assign(options.headers,{
                'user-token': token
            });
        }
        return options;
    }

    async get(endpoint){
        this.beginRequest();
        const result = await fetch(this.host(endpoint), this.getOptions());
        this.endRequest();
        return result;
    }

    async post(endpoint, body){
        const options = this.getOptions({'Content-Type': 'application/json'});
        options.method = 'POST';
        options.body = JSON.stringify(body);

        this.beginRequest()
        const result = (await fetch(this.host(endpoint), options)).json();
        this.endRequest();
        return result;
    }

    async put(endpoint, body){
        const options = this.getOptions({'Content-Type': 'application/json'});
        options.method = 'PUT';
        options.body = JSON.stringify(body);
        this.beginRequest()
        const result = (await fetch(this.host(endpoint), options)).json();
        this.endRequest();
        return result;
    }

    async delete(endpoint){
        const options = this.getOptions();
        options.method = 'DELETE';
        this.beginRequest();
        const result = (await fetch(this.host(endpoint), options)).json();
        this.endRequest();
        return result;
    }


     async  register(email, password) {
         this.beginRequest();

        const result = (await fetch(this.host(this.endpoints.REGISTER), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })).json();

         this.endRequest();

        return result;
    }

     async login(username, password) {
         this.beginRequest();

        const result = await (await fetch(this.host(this.endpoints.LOGIN), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: username,
                password
            })
        })).json();

        sessionStorage.setItem('userToken', result['user-token']);
        sessionStorage.setItem('username', result.username);
        sessionStorage.setItem('userId', result.objectId);
        sessionStorage.setItem('names', `${result.firstName} ${result.lastName}`);

         this.endRequest();

        return result;
    }

     async logout() {
         this.beginRequest();

        const token = sessionStorage.getItem('userToken');



        const result = fetch(this.host(this.endpoints.LOGOUT), {
            headers: {
                'user-token': token
            }
        });
         sessionStorage.removeItem('userToken');
         sessionStorage.removeItem('username');
         sessionStorage.removeItem('userId');
         sessionStorage.removeItem('names');
         // sessionStorage.clear();

         this.endRequest();

        return result;
    }



}

