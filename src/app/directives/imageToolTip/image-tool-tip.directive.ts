import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef, Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[imageToolTip]'
})
export class ImageToolTipDirective implements OnInit {

  @Input('imageToolTip') src: string;
  @Input('imageExtension') extension: string;

  private overlayRef: OverlayRef;

  constructor(
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private overlay: Overlay) { }

  ngOnInit() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'end',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
      }]).withDefaultOffsetX(-30).withDefaultOffsetY(10);
    this.overlayRef = this.overlay.create({ positionStrategy: positionStrategy });
  }

  @HostListener('mouseenter')
  show() {
    // Create tooltip portal
    const tooltipPortal = new ComponentPortal(ImageTooltipComponent);

    // Attach tooltip portal to overlay
    const tooltipRef: ComponentRef<ImageTooltipComponent> = this.overlayRef.attach(tooltipPortal);

    // Pass content to tooltip component instance
    tooltipRef.instance.src = this.src;
    tooltipRef.instance.extension = this.extension;
  }

  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
  }

}

@Component({
  selector: 'image-tooltip',
  template: `<div><img *ngIf="extension != 'PDF'" height="150px" [src]="getImageOfBlob()">
                  <img *ngIf="extension == 'PDF'" height="50px" src="assets/pdfIcon.png"></div>`,
  styles: [`div {
              background-color: white;
              padding: 5px;
              border-radius: 5px;
              -webkit-box-shadow: -6px 1px 13px -1px rgba(0,0,0,0.4);
              box-shadow: -6px 1px 13px -1px rgba(0,0,0,0.4);
            }`
  ]
})
export class ImageTooltipComponent {

  @Input() src = '';
  @Input() extension = '';

  constructor(private sanitizer: DomSanitizer) { }

  getImageOfBlob() {
    const objectURL = `data:image/${this.extension};base64,` + this.src;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }
}
