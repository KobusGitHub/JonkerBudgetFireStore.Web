import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private _snackBarService: MatSnackBar, private _router: Router,
        protected secureLocalStorage: LocalStorage,
        private _activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.secureLocalStorage.getItem('shareToken').subscribe((res) => {
            if (res === null || res === undefined || res === '') {
                this._router.navigate(['/login']);
            }
        }, (err) => {
            this._router.navigate(['/login']);
        });
    }

    openPage(page) {
        switch (page) {
            case 'expense':
                this._router.navigate(['/expense']);
                break;
            case 'forecast':
                this._router.navigate(['/forecast']);
                break;
            case 'expense-report':
                this._router.navigate(['/expense-report']);
                break;
            case 'category-group-report':
                this._router.navigate(['/category-group-report']);
                break;

            default:
                break;
        }
    }
}
