import Cookies from 'js-cookie';
import xss from 'xss';

/**
 * @interface
 * @ignore
 */
interface IAuth {
    /** */
    getToken: (needAutoLogin: boolean, host: string) => Promise<unknown>;
    /** */
    getAuth: () => string | null;
    /** */
    removeAuth: () => void;
    /** */
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
    appId: string;
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
    constructor(server?: string, codeAttr?: string) {
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

        if (codeAttr) {
            this.codeAttr = codeAttr;
        }

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
    public setConfig({ server, appId, codeKey, authKey, cookieKey }: { server?: string; appId?: string; codeKey?: string; authKey?: string; cookieKey?: string }) {
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
     * fetch("http://10.19.248.238:28017/logout?auth=a4627209f60a42cd9727aaac9a233d21&redirectUri=http%3A%2F%2Flocalhost%3A3000%2F", {
     *   "headers": {
     *       "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*\/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
     *       "accept-language": "en-US,en;q=0.9",
     *       "cache-control": "no-cache",
     *       "pragma": "no-cache",
     *       "upgrade-insecure-requests": "1"
     *   },
     *   "referrer": "http://localhost:3000/",
     *   "referrerPolicy": "strict-origin-when-cross-origin",
     *   "body": null,
     *   "method": "GET",
     *   "mode": "cors",
     *   "credentials": "include"
     *   });
     *
     * fetch("http://10.19.248.238:28017/logout?auth=a4627209f60a42cd9727aaac9a233d21&redirectUri=http%3A%2F%2Flocalhost%3A3000%2F", {
     *  "headers": {
     *      "accept": "*\/*",
     *      "accept-language": "en-US,en;q=0.9",
     *      "cache-control": "no-cache",
     *      "pragma": "no-cache"
     *  },
     *  "referrer": "http://localhost:3000/",
     *  "referrerPolicy": "strict-origin-when-cross-origin",
     *  "body": null,
     *  "method": "GET",
     *  "mode": "cors",
     *  "credentials": "omit"
     *  });
     *
     *
     * @param redirect
     *
     */
    public logout(redirect?: string | undefined) {
        let auth = this.getAuth();
        if (auth) {
            this.removeAuth();

            // if (redirect) {
            //     window.location.href = `${this.server}/logout?auth=${auth}&redirectUri=${encodeURIComponent(redirect)}`;
            // } else {
            //     console.info(`[SSO] logout fetch credentials: 'include'`);
            //     redirect = window.location.href;

            //     // fetch 不会发送 cookies。除非你使用了credentials 的初始化选项。（自 2017 年 8 月 25 日以后，默认的 credentials 政策变更为 same-origin。Firefox 也在 61.0b13 版本中进行了修改）
            //     fetch(`${this.server}/logout?auth=${auth}&redirectUri`, {
            //         credentials: 'include',
            //     })
            //         .then(
            //             () => {},
            //             () => {},
            //         )
            //         .catch();
            // }

            if (!redirect) {
                redirect = window.location.href;
            }

            if (isValidRedirectUrl(redirect)) {
                window.location.href = `${this.server}/logout?auth=${auth}&redirectUri=${encodeURIComponent(redirect)}`;
            }
        }
    }
}

/** @module @enc/sso */
export default new Auth();
