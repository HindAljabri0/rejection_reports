import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragdrop]'
})
export class DragdropDirective {

  @Output() onFileDropped = new EventEmitter<any>();

  // @HostBinding('style.background-color') public background = '#f5fcff'
  // @HostBinding('style.opacity') public opacity = '1'
  @HostBinding('style.background-color') public background = '';
  @HostBinding('style.opacity') public opacity = '';

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#9ecbec';
    // this.opacity = '0.8'
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#f5fcff'
    // this.opacity = '1'
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#f5fcff'
    // this.opacity = '1'
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

}
