import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpErrorService {

    constructor(public http: Http,
        private _snackBarService: MatSnackBar) {
    }

    handleHttpError(error: any, resourceName?: string): string {
        let outputMessage = '';

        if (error.status === 0) {
            outputMessage = 'Connection Error / Server Unavailable';
        } else if (error.status === 404) {
            outputMessage = (resourceName ? resourceName : 'Resource') + ' cannot be found or is not linked to this account.';
        } else if (error.status === 403) {
            outputMessage = 'You are not authorised to perform this action.';
        } else if (error.status >= 500) {
            outputMessage = 'The server encountered an error or is unavailable. Please try again later.';
        } else {
            if (!error._body) {
                outputMessage = 'Server Error - Bad Request.';
            } else {
                try {
                    let errorRes = JSON.parse(error._body);

                    if (errorRes.Violations && errorRes.Violations.length > 0) {
                        outputMessage = 'Violation Error: ';
                        errorRes.Violations.forEach((violation) => {
                            outputMessage += violation.Value + '. ';
                        });
                    } else if (!errorRes.modelState) {
                        outputMessage = errorRes.message;
                    } else {
                        if (errorRes.modelState) {
                            let errors: string[] = [];
                            for (let key in errorRes.modelState) {
                                for (let i = 0; i < errorRes.modelState[key].length; i++) {
                                    errors.push(errorRes.modelState[key][i]);
                                }
                            }
                            outputMessage = 'Validation Error. Details: ' + errors.join('. ');
                        } else {
                            outputMessage = 'Server Error - Bad Request.';
                        }
                    }
                } catch (exception) {
                    outputMessage = error._body;
                }
            }
        }

        return outputMessage;
    }

}
