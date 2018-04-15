import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    constructor(private _snackBarService: MatSnackBar, private _router: Router,
        private _activatedRoute: ActivatedRoute) {}

    ngOnInit() {

    }
}
