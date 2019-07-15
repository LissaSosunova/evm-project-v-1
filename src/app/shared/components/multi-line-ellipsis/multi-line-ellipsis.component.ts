import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-multi-line-ellipsis',
  templateUrl: './multi-line-ellipsis.component.html',
  styleUrls: ['./multi-line-ellipsis.component.scss']
})
export class MultiLineEllipsisComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() public text: string;
  @Input() public maxRows: number;

  public previewText: string;
  public maxIterNumber: number;
  public showTooltip: boolean = true;
  public coords: ClientRect;
  public ellipsisWrap: HTMLDivElement;
  public prevText: HTMLDivElement;
  public ellipsisWrapWidth: number;
  public prevTextWidth: number;
  public prevTextHeight: number;
  public tooltipHeight: number;
  public tooltipWidth: number;
  public maxHeight: number;

  @ViewChild('multilineEllipsisWrap') public multilineEllipsisWrap: ElementRef;
  @ViewChild('preview') public preview: ElementRef;

  private onWindowChangeCallback = this.getCoordsOfEllipsis.bind(this);

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.onWindowChangeCallback);
    window.addEventListener('resize', this.onWindowChangeCallback);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowChangeCallback);
    window.removeEventListener('resize', this.onWindowChangeCallback);
    this.cd.detach();
  }


  private init (): void {
    this.maxRows = this.maxRows || 3;
    this.previewText = this.text;
    if (this.text) {
      this.maxIterNumber = this.text.length;
    }
    this.maxIterNumber = this.maxIterNumber || 500;
    setTimeout(this.timeOutInit.bind(this));
  }

  private maxHeightCalc (): number {
    const computedStyle = getComputedStyle(this.prevText);
    const lineHeight = computedStyle.lineHeight;
    const line = parseFloat(lineHeight);
    return this.maxRows * line;
  }

  private timeOutInit (): void {
    this.prevText = this.preview.nativeElement as HTMLDivElement;
    this.ellipsisWrap = this.multilineEllipsisWrap.nativeElement as HTMLDivElement;
    this.prevTextWidth = this.prevText.clientWidth;
    this.ellipsisWrapWidth = this.ellipsisWrap.clientWidth;
    this.maxHeight = this.maxHeightCalc();
    this.ellipsisWrap.style.maxHeight = this.maxHeight + 'px';
    this.prevTextHeight = this.prevText.clientHeight;
    this.showTooltip = false;
    if (this.prevTextHeight > this.maxHeight) {
      this.getCoordsOfEllipsis();
      this.textForPreview(this.prevTextHeight);
      this.showTooltip = true;
    }
  }

  private getCoordsOfEllipsis () {
    this.textForPreview(this.prevTextHeight);
    if (this.ellipsisWrap) {
      this.coords = this.ellipsisWrap.getBoundingClientRect();
    }
    this.ellipsisWrapWidth = this.ellipsisWrap.clientWidth;
  }

  private setTooltipPos (tooltip: HTMLDivElement, textElWrapWidth: number): void {
    if (document.documentElement.clientWidth - this.coords.right > this.tooltipWidth) {
        tooltip.style.left = this.coords.left + textElWrapWidth + 'px';
    } else {
          tooltip.style.left = this.coords.left - this.tooltipWidth + 'px';
    }
    if (document.documentElement.clientHeight - this.tooltipHeight > this.coords.top) {
      tooltip.style.top = this.coords.top + 'px';
    } else {
      tooltip.style.top = document.documentElement.clientHeight - this.tooltipHeight + 'px';
    }
  }

  private textForPreview (prevTextHeight: number): void {
    let i = 0;
    this.previewText = this.text;
    while (prevTextHeight > this.maxHeight) {
      this.previewText = this.previewText.slice(0, this.previewText.length - 6);
      this.previewText += '...';
      this.cd.detectChanges();
      const text = this.preview.nativeElement as HTMLDivElement;
      prevTextHeight = text.clientHeight;
      i++;
      if (i > this.maxIterNumber) {
        break;
      }
    }
  }

}

