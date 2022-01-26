export declare global {
    interface Window {
        SSO_LOGIN_APPID: string;
        SSO_LOGIN_URL: string;
        Auth: IAuth;
    }

    interface document extends Document {
        currentScript: HTMLOrSVGScriptElementExt;
    }

    interface HTMLOrSVGScriptElementExt extends HTMLOrSVGScriptElement {
        src?: string;
        getAttribute: Function;
    }
}

export declare module '@enc/sso' {
    /** 获取Token */
    function getToken(needAutoLogin: boolean, host: string): Promise<unknown>;
    /** 设置配置项 */
    function setConfig(config: ISSOConfig): void;
    /** 获取登录信息 */
    function getAuth(): string | null;
    /** 移除登录信息 */
    function removeAuth(): void;
    /** 退出登录 */
    function logout(redirect?: string | undefined): void;
}
