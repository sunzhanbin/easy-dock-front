import Cookies from 'js-cookie';
import xss from 'xss';

type ISSOConfig = {
    /** 用于登陆的服务器地址，也可以通过 window.SSO_LOGIN_URL 设置 */
    server?: string;
    /** appId，也可以通过 window.SSO_LOGIN_APPID 设置*/
    appId?: string;
    /** search query key，用于从 search query 中读取用于登录请求参数的 Code */
    codeKey?: string;
    /** 设置一个 localStorage key，将登陆后的 token 存入 */
    authKey?: string;
    /** 设置一个 cookie key，将登陆后的 token 存入，不设置的情况下存入 localStorage */
    cookieKey?: string;
};

/**
 * @interface
 * @ignore
 */
interface IAuth {
    /** 获取Token */
    getToken: (needAutoLogin: boolean, host: string) => Promise<unknown>;
    /** 设置配置项 */
    setConfig: (config: ISSOConfig) => void;
    /** 获取登录信息 */
    getAuth: () => string | null;
    /** 移除登录信息 */
    removeAuth: () => void;
    /** 退出登录 */
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
                result[kv[0]] = xss(kv[1]);
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

const isValidRedirectUrl: (url?: string) => boolean = (url?: string) => !!url && url.indexOf('/logout?') < 0 && url.indexOf('/login?') < 0 && url.indexOf('redirectUri=') < 0;

/**
 * @public
 *
 * Code blocks are great for examples
 *
 * ```typescript
 * // run typedoc --help for a list of supported languages
 * const instance = new MyClass();
 *
 * @implements {IAuth}
 */
class Auth implements IAuth {
    /** */
    appId: string | undefined;
    /** */
    server: string | undefined;
    /** */
    codeAttr: string = DEFAULT_CODE_ATTR;
    /** */
    authAttr: string = DEFAULT_AUTH_ATTR;
    /** */
    cookieAttr?: string;

    /**
     * @public
     */
    constructor(config: ISSOConfig = {}) {
        if (window.Auth) {
            return window.Auth;
        }

        const appId = window.SSO_LOGIN_APPID;
        if (!appId) {
            console.warn('SSO: appId not specified in window.SSO_LOGIN_APPID.');
        }

        this.setConfig({ ...config, appId });

        if (!window.Auth) {
            window.Auth = this;
        }
    }

    private setAuth(token: string) {
        if (this.cookieAttr) {
            Cookies.set(this.cookieAttr, token);
        } else {
            window.localStorage.setItem(this.authAttr, token);
        }
    }

    /**
     * @description 获取Token
     * @param {boolean} needAutoLogin
     * @param {string} host BASE_SERVICE_ENDPOINT
     * @returns Promise<null>
     */
    public async getToken(needAutoLogin: boolean, host: string, redirect?: string) {
        if (this.getAuth()) {
            return this.getAuth();
        } else {
            let code = getParams()[this.codeAttr];
            if (code) {
                let token = await fetchToken(host, code);
                if (token) {
                    // window.localStorage.setItem(this.authAttr, token);
                    this.setAuth(token);
                    resetUrl(this.codeAttr);
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

                    if (redirect && isValidRedirectUrl(redirect)) {
                        ssoUrl = `${server}/login?redirectUri=${encodeURIComponent(redirect)}`;
                    }

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

    /**
     *
     * @param server {string} 登陆接口地址
     */
    public setLoginServer(server: string) {
        this.server = server;
    }

    /**
     *
     * @param {object} config
     *  server: 登陆接口地址, appId: appId, codeKey: 在localStorage设置code使用的Key, authKey: 在localStorage设置auth使用的Key, cookieKey: 设置之后会将token放进cookie中
     */
    public setConfig({ server, appId, codeKey, authKey, cookieKey }: ISSOConfig) {
        if (server) {
            this.setLoginServer(server);
        }

        if (appId) {
            this.appId = appId;
        }

        if (codeKey) {
            this.codeAttr = codeKey;
        }

        if (authKey) {
            this.authAttr = authKey;
        }

        if (cookieKey) {
            this.cookieAttr = cookieKey;
        }
    }

    public getAuthFromCookie() {
        if (this.cookieAttr) {
            return Cookies.get(this.cookieAttr);
        }

        return null;
    }

    public getAuth() {
        if (this.cookieAttr) {
            return Cookies.get(this.cookieAttr) || null;
        }

        return window.localStorage.getItem(this.authAttr);
    }

    public removeAuth() {
        window.localStorage.removeItem(this.authAttr);

        if (this.cookieAttr) {
            Cookies.remove(this.cookieAttr);
        }
    }

    /**
     * @param redirect
     */
    public logout(redirect?: string | undefined) {
        let auth = this.getAuth();
        if (auth) {
            this.removeAuth();

            if (!redirect) {
                redirect = window.location.href;
            }

            if (isValidRedirectUrl(redirect)) {
                window.location.href = `${this.server}/logout?auth=${auth}&redirectUri=${encodeURIComponent(redirect)}`;
            }
        }
    }
}

const IIFEEntry = () => {
    const currentScript: HTMLOrSVGScriptElementExt | null = document.currentScript as HTMLOrSVGScriptElementExt;

    let appId = currentScript?.getAttribute('appId');
    if (!appId) {
        console.warn('SSO: appId not specified in script tag attribute.');
        appId = window.SSO_LOGIN_APPID;
        if (!appId) {
            console.warn('SSO: appId not specified in window.SSO_LOGIN_APPID.');
        }
    }

    let server: string | undefined;
    // console.warn('SSO new Auth(server): server is null or undefined.');
    let src: string | undefined = window.SSO_LOGIN_URL;
    if (src) {
        server = src;
    } else {
        console.warn('SSO: server not specified in window.SSO_LOGIN_URL.');
        src = currentScript?.src && new URL(currentScript.src).origin;
        if (src && `${src}`.indexOf('localhost') < 0) {
            server = src;
        } else {
            console.warn('SSO: cannot login localhost, set login url in window.SSO_LOGIN_URL.');
        }
    }

    if (!window.Auth) {
        window.Auth = new Auth({ server, appId });
    }
};

if (document.currentScript) {
    IIFEEntry();
}

/** @module @enc/sso */
export default Auth;
