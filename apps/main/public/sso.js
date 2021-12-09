(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Auth = factory());
})(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const AUTH_ATTR = 'auth';
    const CODE_ATTR = 'code';
    const getParams = () => {
        let result = {};
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
    const fetchToken = (host, code) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield fetch(`${host}/api/oss-framework/sso/getToken?code=${code}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((result) => result.json())
            .catch((error) => console.error(error));
        if (data.resultCode === 0) {
            return data.resultMessage;
        }
        else {
            console.error(data.resultMessage);
            return null;
        }
    });
    class Auth {
        constructor(server) {
            const currentScript = document.currentScript;
            let appId = currentScript === null || currentScript === void 0 ? void 0 : currentScript.getAttribute('appId');
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
            }
            else {
                console.warn('SSO new Auth(server): server is null or undefined.');
                let src = (currentScript === null || currentScript === void 0 ? void 0 : currentScript.src) && new URL(currentScript.src).origin;
                if (!src) {
                    src = window.SSO_LOGIN_URL;
                    if (!src) {
                        console.warn('SSO: server not specified in window.SSO_LOGIN_URL.');
                    }
                }
                this.server = src;
            }
        }
        getToken(needAutoLogin, host) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.getAuth()) {
                    return this.getAuth();
                }
                else {
                    let code = getParams()[CODE_ATTR];
                    if (code) {
                        let token = yield fetchToken(host, code);
                        if (token) {
                            window.localStorage.setItem(AUTH_ATTR, token);
                            resetUrl();
                        }
                        return token;
                    }
                    else {
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
                        }
                        else {
                            console.error('用户未登录，无法获取 Token');
                            return null;
                        }
                    }
                }
            });
        }
        setLoginServer(server) {
            this.server = server;
        }
        getAuth() {
            return window.localStorage.getItem(AUTH_ATTR);
        }
        removeAuth() {
            window.localStorage.removeItem(AUTH_ATTR);
        }
        logout(redirect) {
            let auth = this.getAuth();
            if (auth) {
                this.removeAuth();
                if (!redirect) {
                    redirect = window.location.href;
                }
                window.location.href = `${this.server}/logout?${AUTH_ATTR}=${auth}&redirectUri=${encodeURIComponent(redirect)}`;
            }
        }
    }
    var index = new Auth();

    return index;

}));