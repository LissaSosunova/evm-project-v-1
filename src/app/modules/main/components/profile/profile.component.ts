import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { types } from 'src/app/types/types';
import { Store } from '@ngrx/store';
import * as userAction from '../../../../store/actions';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { MainApiService } from '../../services/main.api.service';
import { AvatarService } from '../../services/avatar.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public editedName = false;
  public editedMail = false;
  public editedPhone = false;
  public user: types.User = {} as types.User;
  public avatar: string;
  public passwords: {oldPassword: string, newPassword: string} = {} as {oldPassword: string, newPassword: string};
  public showSpinnerForName = false;
  public showSpinnerForEmail = false;
  public showSpinnerPhone = false;
  public showSpinnerPassword = false;
  @ViewChild('uploadFile', {static: true}) public uploadFile: ElementRef;

  constructor(private data: DataService,
    private mainApiService: MainApiService,
    private toastService: ToastService,
    private avatarService: AvatarService,
    private store: Store<any>
  ) { }

  ngOnInit() {
    this.init();
  }

  public init(): void {
    const user$ = this.store.select('user');
    user$.subscribe((state) => {
      if (typeof state !== undefined) {
        this.user = state;
        // Не понимаю зачем эта проверка???
      }
    });
    this.user.avatar = this.avatarService.parseAvatar(this.user.avatar);
    this.user.contacts.forEach(contact => {
      contact.avatar = this.avatarService.parseAvatar(contact.avatar);
    });
  }

  public changePassword(passwords: {oldPassword: string, newPassword: string}): void {
    this.showSpinnerPassword = true;
    this.mainApiService.postRequest('/user/change_password_auth', passwords)
    .subscribe(response => {
      this.showSpinnerPassword = false;
      if (response.message === 'Incorrect password') {
        this.toastService.openToastFail('Incorrect old password');
        return;
      }
      this.toastService.openToastSuccess('Your password was changed successfully');
    }, () => {
      this.toastService.openToastFail('Server error');
      this.showSpinnerPassword = false;
    });
  }
  public saveNewName(event): void {
    this.editedName = true;
  }
  public saveNewPhone(event): void {
    this.editedPhone = true;
  }
  public saveName(name: string): void {
    this.showSpinnerForName = true;
    this.mainApiService.putRequest('/user/profile', {name})
    .subscribe(() => {
      this.toastService.openToastSuccess('Your name was changed successfully');
      this.editedName = false;
      this.showSpinnerForName = false;
    }, () => {
      this.toastService.openToastFail('Server error');
      this.showSpinnerForName = false;
    });
  }
  public savePhone(phone: string): void {
    this.showSpinnerPhone = true;
    this.mainApiService.putRequest('/user/profile', {phone})
    .subscribe(() => {
      this.toastService.openToastSuccess('Your phone number was chanched successfully');
      this.editedPhone = false;
      this.showSpinnerPhone = false;
    }, () => {
      this.toastService.openToastFail('Server error');
      this.showSpinnerPhone = false;
    });
  }
  public saveNewMail(event): void {
    this.editedMail = true;
  }
  public saveMail(val: string): void {
    this.showSpinnerForEmail = true;
    const params = {username: this.user.username, newEmail: val};
    this.mainApiService.putRequest('/user/change_email', params)
    .subscribe(() => {
      this.toastService.openToastSuccess('Your e-mail was changed. Check your e-mail and confirm');
      this.editedMail = false;
      this.showSpinnerForEmail = false;
    }, () => {
      this.toastService.openToastFail('Server error');
      this.showSpinnerForEmail = false;
    });
  }
  public deleteAvatar(): void {
    this.mainApiService.deleteRequest(`/user/delete_avatar/${this.user.username}`)
    .subscribe(response => {
      this.store.dispatch(new userAction.UpdateAvatarURL(response));
    }, () => {
      this.toastService.openToastFail('Server error');
    });
  }
  public uploadAvatar(event): void {
    const files = this.uploadFile.nativeElement.files;
    const formData: FormData = new FormData();
    formData.append('image', files[0]);
    formData.append('userId', this.user.username);
    this.mainApiService.postRequest('/user/upload_avatar', formData, {'userId': this.user.username})
    .subscribe((res) => {
      const avatar: types.Avatar = this.avatarService.parseAvatar(res);
      this.store.dispatch(new userAction.UpdateAvatarURL(avatar));
    }, () => {
      this.toastService.openToastFail('Error in uploading avatar');
    });
  }

}
