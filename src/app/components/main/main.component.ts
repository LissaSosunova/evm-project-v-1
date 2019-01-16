import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoPopupComponent } from '../user-info-popup/user-info-popup.component';
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
  @ViewChild('userPopup') private userPopup: UserInfoPopupComponent;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private transferService: TransferService) {
      this.subscription = this.transferService.getDataObs().subscribe(test => {
        console.log('test', test);
      });
    }

  ngOnInit() {
    this.user = this.route.snapshot.data.userData; // используем резолвер для получения данных пользователя
    console.log(this.user.chats);
    this.transferService.dataSet({name: 'userData', data: this.user});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userPopup.onClose();
  }

  public onPopupOpen(): void {
    this.userPopup.open();
  }

}
