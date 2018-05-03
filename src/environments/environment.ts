import { IThemeModel } from '../models';

export const environment: { production: boolean, appTitle: string, webApiBaseAddress: string, themes: IThemeModel[],
    firebase: any, firebaseDemo: any } = {
    production: false,
    appTitle: 'Home Budget',
    webApiBaseAddress: 'http://localhost:5000/api/',
    themes: [
        {
            name: 'Light',
            className: 'light-theme'
        },
        {
            name: 'Dark',
            className: 'dark-theme'
        },
        {
            name: 'Other',
            className: 'other-theme'
        }
    ],
    firebase: {
        apiKey: 'AIzaSyBVL_ygLQVF_vP9rkPpPyldGVq4Lxcld1g',
        authDomain: 'jonkerbudget.firebaseapp.com',
        databaseURL: 'https://jonkerbudget.firebaseio.com',
        projectId: 'jonkerbudget',
        storageBucket: 'jonkerbudget.appspot.com',
        messagingSenderId: '12474196481'
    },
    firebaseDemo: {
        apiKey: 'AIzaSyAdxyqq999NKJUri85zm9YWPFCVgc2pkyM',
        authDomain: 'homebudget-be8d4.firebaseapp.com',
        databaseURL: 'https://homebudget-be8d4.firebaseio.com',
        projectId: 'homebudget-be8d4',
        storageBucket: 'homebudget-be8d4.appspot.com',
        messagingSenderId: '16900260974'
    }
};
