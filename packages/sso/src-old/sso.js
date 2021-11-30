(function () {
    let AUTH_ATTR = "auth";
    let CODE_ATTR = "code";
    let appId = document.currentScript.getAttribute("appId");
    let server = new URL(document.currentScript.src).origin;

    let getParams = () => {
        let result = {};
        let searchStr = location.search;
        if (searchStr.length > 1){
            let params = searchStr.substring(1).split("&");
            if (params.length > 0){
                for(let item of params){
                    let kv = item.split("=");
                    result[kv[0]] = kv[1];
                }
            }
        }
        return result;
    }

    let resetUrl = () => {
        let params = getParams();
        let search = "";
        params[CODE_ATTR] = null;
        Object.keys(params).forEach(attr =>{
            if (params[attr]){
                search += `${attr}=${params[attr]}&`;
            }
        })
        let newUrl = window.location.href.split("?")[0];
        if (search.length > 0){
            newUrl += "?" + search.substring(0, search.length - 1);
        }
        window.history.pushState({},0, newUrl);
    }

    let fetchToken = async (host, code) => {
        let data = await fetch(`${host}/api/oss-framework/sso/getToken?code=${code}`, {
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(result => result.json())
          .catch(error => console.error(error));
        if (data.resultCode === 0){
            return data.resultMessage;
        } else {
            console.error(data.resultMessage);
            return null;
        }
    }

    window.Auth = {
         getToken: async (needAutoLogin, host) =>{
            if (window.Auth.getAuth()){
                return window.Auth.getAuth();
            } else {
                let code = getParams()[CODE_ATTR];
                if (code){
                   let token = await fetchToken(host, code);
                   if (token) {
                       window.localStorage.setItem(AUTH_ATTR, token);
                       resetUrl();
                   }
                   return token;
                } else {
                    if (needAutoLogin) {
                        let ssoUrl = `${server}/login?redirectUri=${encodeURIComponent(location.href)}`;
                        if (appId){
                            ssoUrl += `&appId=${appId}`;
                        }
                        window.location.href = ssoUrl;
                    } else {
                        console.error("用户未登录，无法获取 Token");
                        return null;
                    }
                }
            }
        },
        getAuth: () =>{
             return window.localStorage.getItem(AUTH_ATTR);
        },
        removeAuth: () =>{
            window.localStorage.removeItem(AUTH_ATTR);
        },
        logout: (redirect) => {
            let auth = window.Auth.getAuth();
            if(auth) {
                window.Auth.removeAuth();
                if (!redirect) {
                    redirect = window.location.href;
                }
                window.location.href = `${server}/logout?${AUTH_ATTR}=${auth}&redirectUri=${encodeURIComponent(redirect)}`
            }
        }
    }

})();