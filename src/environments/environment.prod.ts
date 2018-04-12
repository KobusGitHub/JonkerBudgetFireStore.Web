import { IThemeModel } from '../models';

export const environment: { production: boolean, appTitle: string, webApiBaseAddress: string, themes: IThemeModel[], firebase: any } = {
    production: true,
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
      }
};
