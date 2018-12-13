import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { types} from '../types/types';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public params: types.registration;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) { }
  ngOnInit() {
  }
  public setRegConf (username, email, password) {
    this.params = {
      username,
      email,
      password
    };
    this.data.setReg(this.params).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['../login']);
      }

  )
  }

}
