import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
  forwardRef,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxTimepickerComponent } from './ngx-timepicker.component';

@Directive({
  selector: '[ngxTimepicker]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxTimepickerDirective),
      multi: true,
    },
  ],
})
export class NgxTimepickerDirective
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input('ngxTimepicker') timePicker!: NgxTimepickerComponent | null;
  isDisabled: boolean = false;
  _value;
  @Input('meridian') meridian: boolean = false;
  @Input()
  set value(value: string) {
    console.log("kbt ~ file: time-picker-trigger.directive.ts:32 ~ setvalue ~ value:", value)
    this.timePicker?.setValue(value, this.meridian);
    this._value = value;
    this.updateInputValue(value);

  }
  get value() {
    return this._value;
  }

  constructor(private elementRef: ElementRef, private trigger: MatMenuTrigger ,private renderer: Renderer2) {
    renderer.setStyle(elementRef.nativeElement, 'cursor', 'pointer');
  }

  ngAfterViewInit() {
    this.meridian
    this.trigger.menuOpened.subscribe(_ => {
      this.timePicker?.setValue(this.value, this.meridian);
    })
  }

  
  onChange = (value: any) => {};
  onTouched = () => {};
  writeValue(value: string): void {
    console.log("kbt ~ file: time-picker-trigger.directive.ts:39 ~ writeValue ~ value:", value)
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  updateInputValue(value) {
    this.elementRef.nativeElement.value = value;
  }

  onClose(value) {
    this.value = value;
    this.onChange(value);
  }

  ngOnInit() {
    if (!this.timePicker) {
      throw new Error('No TimePickerComponent provided for timePickerTrigger');
    }
    this.timePicker?.setOnClose(this.onClose.bind(this));
  }

  ngOnDestroy() {
    this.timePicker = null;
  }

  // @HostListener('click', ['$event'])
  // onClick(event: MouseEvent) {
  //   event.stopPropagation();
  //   this.timePicker?.showPicker();
  // }
}
