import { TestBed, async } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../modules';
import 'hammerjs';

describe('LoginComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            imports: [
                SharedModule,
                RouterTestingModule
            ],
            providers: [
            ]
        }).compileComponents();
    }));

    it('should create the login component', async(() => {
        const fixture = TestBed.createComponent(LoginComponent);
        const login = fixture.debugElement.componentInstance;
        expect(login).toBeTruthy();
    }));
});
