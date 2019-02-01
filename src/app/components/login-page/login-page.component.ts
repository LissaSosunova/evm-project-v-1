import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  public params: types.Login;
  public token: string;
  public dataResp: types.LoginResp;
  public errorMessage: string;
  public username: string;
  public password: string;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) { }


  ngOnInit() {
  }

  public setAuthConf(username: string, password: string): void {
      this.params = {
        username,
        password
      };
    this.data.setAuth(this.params).subscribe(
      data => {
        console.log(data);
        this.dataResp = data as types.LoginResp;
        if (this.dataResp.success === true) {
          this.token = this.dataResp.access_token;
          sessionStorage.setItem('_token', this.token);
          this.router.navigate(['/main/home']);
        } else {
          this.errorMessage = data.message;
        }
      }
    );
  }

}
