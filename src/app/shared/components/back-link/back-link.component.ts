import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-link',
  templateUrl: './back-link.component.html',
  styleUrls: ['./back-link.component.scss']
})
export class BackLinkComponent implements OnInit, OnDestroy {

  @Input() public text = 'Back';
  private prevRoute: string;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private routerService: RouterService,
              private router: Router) { }

  ngOnInit() {
    this.routerService.getPreviousRoute$()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(prevRoute => {
      this.prevRoute = prevRoute;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public backLink(): void {
    const arrRoute = this.prevRoute.split('?');
    let queryArr: string[];
    if (arrRoute[1]) {
      queryArr = arrRoute[1].split('&');
      const queryObj = queryArr.reduce((prev, curr) => {
        const a = curr.split('=');
        prev[a[0]] = a[1];
        return prev;
      }, {});
      this.router.navigate([arrRoute[0]], {queryParams: queryObj});
      return;
    }
    this.router.navigate([arrRoute[0]]);
  }

}
