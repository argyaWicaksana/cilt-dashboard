export type RandomCheck = {
    id: number;
    sub_section: string;
    location: string;
    cycle: string;
    activity: string;
    standard: string;
    date_check: string;
    result: 'ok' | 'ng';
    photo: string;
    pic: string;
    note: string;
    verificator: null | string;
    status_verification: null | string;
}