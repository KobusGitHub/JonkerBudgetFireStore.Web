import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainComponent } from './main.component';
import { SharedModule } from '../../modules';
import 'hammerjs';

describe('MainComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MainComponent
            ],
            imports: [
                RouterTestingModule,
                SharedModule
            ],
            providers: [
            ]
        }).compileComponents();
    }));

    it('should create the main component', async(() => {
        const fixture = TestBed.createComponent(MainComponent);
        const main = fixture.debugElement.componentInstance;
        expect(main).toBeTruthy();
    }));
});
