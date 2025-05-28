export interface Response {
    name: 'OK' | 'ERR',
    error: boolean,
    code: string,
    status: number,
    from: string,
    info: any,
    data: any   
}