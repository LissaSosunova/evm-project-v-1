import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { types } from 'src/app/types/types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  public user$: Observable<types.User>;

  constructor(private store: Store<types.User>) { }

  ngOnInit() {
    this.user$ = this.store.pipe(select('user'));
  }

}
