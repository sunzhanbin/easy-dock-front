interface IAuth {
    getToken: (needAutoLogin: boolean, host: string) => Promise<unknown>;
    getAuth: () => string | null;
    removeAuth: () => void;
    logout: (redirect: string) => void;
}

const DEFAULT_AUTH_ATTR = 'auth';
const DEFAULT_CODE_ATTR = 'code';

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

const resetUrl = (codeAttr: string) => {
    let params = getParams();
    let search = '';
    params[codeAttr] = null;
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

class Auth implements IAuth {
    appId: string;
    server: string | undefined;
    coodAttr: string = DEFAULT_CODE_ATTR;
    authAttr: string = DEFAULT_AUTH_ATTR;

    constructor(server?: string, coodAttr?: string) {
        const currentScript: HTMLOrSVGScriptElementExt | null = document.currentScript as HTMLOrSVGScriptElementExt;

        let appId = currentScript?.getAttribute('appId');
        if (!appId) {
            console.warn('SSO: appId not specified in script tag attribute.');
            appId = window.SSO_LOGIN_APPID;
            if (!appId) {
                console.warn('SSO: appId not specified in window.SSO_LOGIN_APPID.');
            }
        }
        this.appId = appId;

        if (server) {
            this.server = server;
        } else {
            // console.warn('SSO new Auth(server): server is null or undefined.');
            let src: string | undefined = window.SSO_LOGIN_URL;
            if (src) {
                this.server = src;
            } else {
                console.warn('SSO: server not specified in window.SSO_LOGIN_URL.');
                src = currentScript?.src && new URL(currentScript.src).origin;
                if (src && `${src}`.indexOf('localhost') < 0) {
                    this.server = src;
                }
            }
        }

        if (coodAttr) {
            this.coodAttr = coodAttr;
        }
    }

    async getToken(needAutoLogin: boolean, host: string) {
        if (this.getAuth()) {
            return this.getAuth();
        } else {
            let code = getParams()[this.coodAttr];
            if (code) {
                let token = await fetchToken(host, code);
                if (token) {
                    window.localStorage.setItem(this.authAttr, token);
                    resetUrl(this.coodAttr);
                }
                return token;
            } else {
                if (needAutoLogin) {
                    const { server, appId } = this;

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
    }

    setLoginServer(server: string) {
        this.server = server;
    }

    setConfig({ server, appId, coodAttr, authAttr }: { server?: string; appId?: string; coodAttr?: string; authAttr?: string }) {
        if (server) {
            this.server = server;
        }

        if (appId) {
            this.appId = appId;
        }

        if (coodAttr) {
            this.coodAttr = coodAttr;
        }

        if (authAttr) {
            this.authAttr = authAttr;
        }
    }

    getAuth() {
        return window.localStorage.getItem(this.authAttr);
    }

    removeAuth() {
        window.localStorage.removeItem(this.authAttr);
    }
    
    logout(redirect: string) {
        let auth = this.getAuth();
        if (auth) {
            this.removeAuth();
            if (!redirect) {
                redirect = window.location.href;
            }
            window.location.href = `${this.server}/logout?${this.authAttr}=${auth}&redirectUri=${encodeURIComponent(redirect)}`;
        }
    }
}

export default new Auth();
