import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterOutlet, NavigationStart } from '@angular/router';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  public user: types.User = {} as types.User;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private data: DataService,
    private transferService: TransferService) {
      this.subscription = this.transferService.getDataObs().subscribe(test => {
        console.log('test', test);
      });
    }

  ngOnInit() {
    this.user = this.route.snapshot.data.userData; // используем резолвер для получения данных пользователя
    console.log(this.user);
    this.transferService.dataSet({name: 'userData', data: this.user});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
