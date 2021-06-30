import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { HttpEvent } from '@angular/common/http';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DownloadOverlayComponent, DownloadStatus } from 'src/app/components/reusables/download-overlay/download-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  lastAttachedOverlay: ComponentPortal<DownloadOverlayComponent>;

  constructor(private overlay: Overlay,
    private _injector: Injector) { }

  showDownloadOverlay(request: Observable<HttpEvent<unknown>>) {
    const status = new Subject<DownloadStatus>();
    const overlayRef = this.overlay.create({
      height: 140,
      positionStrategy: this.lastAttachedOverlay == null || !this.lastAttachedOverlay.isAttached ? this.overlay.position().global().right('20px').bottom('20px') :
        this.overlay.position().connectedTo(
          this.lastAttachedOverlay.viewContainerRef.element,
          { originX: 'end', originY: 'bottom' },
          { overlayX: 'end', overlayY: 'top' }).withOffsetY(160),
    });
    const injectorTokens = new WeakMap();
    injectorTokens.set(REQUEST_OBSERVER, request);
    injectorTokens.set(DOWNLOAD_STATUS_OBSERVER, status);
    injectorTokens.set(OVERLAY_REFERENCE, overlayRef);
    const downloadOverlayComponent = new ComponentPortal(DownloadOverlayComponent, null, new PortalInjector(this._injector, injectorTokens));
    overlayRef.attach(downloadOverlayComponent);
    this.lastAttachedOverlay = downloadOverlayComponent;
    return status.asObservable();
  }

}

export const REQUEST_OBSERVER = new InjectionToken<{}>('REQUEST_OBSERVER');
export const DOWNLOAD_STATUS_OBSERVER = new InjectionToken<{}>('DOWNLOAD_STATUS_OBSERVER');
export const OVERLAY_REFERENCE = new InjectionToken<{}>('OVERLAY_REFERENCE');