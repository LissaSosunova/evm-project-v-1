import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public currParentUrl: string;
  public currChildUrl: string;

  constructor(public router: Router, private activateRouter: ActivatedRoute) { }

  ngOnInit() {
    this.router.events
    .pipe(filter(event => event instanceof NavigationStart))
    .subscribe(url => {
      const currUrl = url as NavigationStart;
      const urlSegments = currUrl.url.split('/');
      this.currParentUrl = urlSegments[1];
      if (this.currParentUrl === '/' || !this.currParentUrl) {
        this.currParentUrl = 'login';
      }
      if (urlSegments.length > 2) {
        this.currChildUrl = urlSegments[2];
        const childSegments = this.currChildUrl.split('?');
        this.currChildUrl = childSegments[0];
      } else {
        this.currChildUrl = '';
      }
    });
  }
  public exit(): void {
    sessionStorage.clear();
  }

}
