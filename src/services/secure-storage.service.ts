import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { JSONSchema } from '@ngx-pwa/local-storage';

@Injectable()
export class SecureStorageService {
    // https://www.npmjs.com/package/@ngx-pwa/local-storage

    constructor(protected localStorage: LocalStorage) {
    }

    setItem(name: string, value: any) {
        this.localStorage.setItem(name, value).subscribe(() => { });
    }

    removeItem(name: string) {
        this.localStorage.removeItem(name).subscribe(() => { });
    }

    clearAll() {
        this.localStorage.clear().subscribe(() => { });
    }

    getItem(name: string) {
        this.localStorage.getItem<any>(name).subscribe((res) => {
            return res; // should be 'Henri'
        });
    }

    // checkData() {
    //     const schema: JSONSchema = {
    //         properties: {
    //             firstName: { type: 'string' },
    //             lastName: { type: 'string' }
    //         },
    //         required: ['firstName', 'lastName']
    //     };
    //     this.localStorage.getItem<User>('user', { schema }).subscribe((user) => {
    //         // Called if data is valid or null
    //     }, (error) => {
    //         // Called if data is invalid
    //     });
    // }
}
