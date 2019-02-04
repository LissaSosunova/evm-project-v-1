import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

export class AbstractEditor {

    protected _isValid: BehaviorSubject<boolean>;

    constructor() {
        this._isValid = new BehaviorSubject(false);
    }

    public get isValid$(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this._isValid.subscribe(valid => observer.next(valid));
        });
    }

}
