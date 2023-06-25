export type ID = string; // ID 类型

/* 请求体 */
export interface IPayload extends object {
    
}

/* 响应体 */
export interface IResponse {
    code: number;
    msg: string;
    data: object | string | number | boolean | null;
}
