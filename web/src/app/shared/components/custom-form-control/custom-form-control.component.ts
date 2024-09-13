import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  template: '',
})
export abstract class CustomFormControl<T> implements ControlValueAccessor {
  @Input() value!: T;
  @Output() valueChange: EventEmitter<T> = new EventEmitter();

  protected onTouched = () => {};
  protected onChange = (data: T) => {};

  public writeValue(value: T): void {
    this.value = value;
    this.updateValue();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public abstract setDisabledState(isDisabled: boolean): void;

  protected updateValue(): void {
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }
}
