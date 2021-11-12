interface IAuth {
    getToken: (needAutoLogin: boolean, host: string) => Promise<unknown>;
    getAuth: () => string | null;
    removeAuth: () => void;
    logout: (redirect: string) => void;
}

const AUTH_ATTR = 'auth';
const CODE_ATTR = 'code';

const currentScript: HTMLOrSVGScriptElementExt | null = document.currentScript as HTMLOrSVGScriptElementExt;

let appId = currentScript?.getAttribute('appId');
if (!appId) {
    console.warn('SSO: appId not specified in script tag attribute.');
}
appId = window.SSO_LOGIN_APPID;
if (!appId) {
    console.warn('SSO: appId not specified in window.SSO_LOGIN_APPID.');
}

let server = currentScript?.src && new URL(currentScript.src).origin;
if (!server) {
    console.warn('SSO: server not specified in currentScript.src.origin.');
}
server = window.SSO_LOGIN_URL;
if (!server) {
    console.warn('SSO: server not specified in window.SSO_LOGIN_URL.');
}

const getParams = () => {
    let result: Record<string, string | null> = {};
    let searchStr = location.search;
    if (searchStr.length > 1) {
        let params = searchStr.substring(1).split('&');
        if (params.length > 0) {
            for (let item of params) {
                let kv = item.split('=');
                result[kv[0]] = kv[1];
            }
        }
    }
    return result;
};

const resetUrl = () => {
    let params = getParams();
    let search = '';
    params[CODE_ATTR] = null;
    Object.keys(params).forEach((attr) => {
        if (params[attr]) {
            search += `${attr}=${params[attr]}&`;
        }
    });
    let newUrl = window.location.href.split('?')[0];
    if (search.length > 0) {
        newUrl += '?' + search.substring(0, search.length - 1);
    }
    window.history.pushState({}, '0', newUrl);
};

const fetchToken: (host: string, code: string) => Promise<string> = async (host, code) => {
    let data = await fetch(`${host}/api/oss-framework/sso/getToken?code=${code}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((result) => result.json())
        .catch((error) => console.error(error));
    if (data.resultCode === 0) {
        return data.resultMessage;
    } else {
        console.error(data.resultMessage);
        return null;
    }
};

const Auth: IAuth = {
    getToken: async (needAutoLogin, host) => {
        if (Auth.getAuth()) {
            return Auth.getAuth();
        } else {
            let code = getParams()[CODE_ATTR];
            if (code) {
                let token = await fetchToken(host, code);
                if (token) {
                    window.localStorage.setItem(AUTH_ATTR, token);
                    resetUrl();
                }
                return token;
            } else {
                if (needAutoLogin) {
                    if (!server) {
                        console.error('请在 window.SSO_LOGIN_URL 中配置登陆服务器地址');
                        return;
                    }

                    let ssoUrl = `${server}/login?redirectUri=${encodeURIComponent(location.href)}`;
                    if (appId) {
                        ssoUrl += `&appId=${appId}`;
                    }
                    window.location.href = ssoUrl;
                } else {
                    console.error('用户未登录，无法获取 Token');
                    return null;
                }
            }
        }
    },
    getAuth: () => {
        return window.localStorage.getItem(AUTH_ATTR);
    },
    removeAuth: () => {
        window.localStorage.removeItem(AUTH_ATTR);
    },
    logout: (redirect) => {
        let auth = Auth.getAuth();
        if (auth) {
            Auth.removeAuth();
            if (!redirect) {
                redirect = window.location.href;
            }
            window.location.href = `${server}/logout?${AUTH_ATTR}=${auth}&redirectUri=${encodeURIComponent(redirect)}`;
        }
    },
};

export default Auth;
