import { Directive, HostListener, EventEmitter, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollable]'
})
export class ScrollableDirective {

  @Output() scrollPosition = new EventEmitter();

  constructor(public el: ElementRef) { }

  @HostListener('scroll', ['$event'])
  @debounce()
  onScroll(event) {
    try {

      const top = event.target.scrollTop
      const height = this.el.nativeElement.scrollHeight
      const offset = this.el.nativeElement.offsetHeight


      if (top > height - offset - 20) {
        this.scrollPosition.emit('bottom')
      }

      if (top === 0) {
        this.scrollPosition.emit('top')
      }

    } catch (err) {}
  }

}

/**
 * Emit first value then ignore for specified duration
 * @see https://stackoverflow.com/questions/44634992/debounce-hostlistener-event/44635703
 */
export function debounce(delay: number = 300): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    const original = descriptor.value;
    const key = `__timeout__${propertyKey}`;

    descriptor.value = function (...args) {
      clearTimeout(this[key]);
      this[key] = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}
