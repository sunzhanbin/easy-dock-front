export declare global {
    interface Window {
        SSO_LOGIN_APPID: string;
        SSO_LOGIN_URL: string;
    }

    interface document extends Document {
        currentScript: HTMLOrSVGScriptElementExt;
    }

    interface HTMLOrSVGScriptElementExt extends HTMLOrSVGScriptElement {
        src?: string;
        getAttribute: Function;
    }
}
