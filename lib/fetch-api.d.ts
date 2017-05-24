declare function Patch(url: string, token: string, data: object): Promise<any>;
declare function Post(url: string, token: string, data: object): Promise<any>;
declare function Delete(url: string, token: string): Promise<any>;
declare function Get(url: string, token: string): Promise<any>;
export { Delete, Get, Patch, Post };
