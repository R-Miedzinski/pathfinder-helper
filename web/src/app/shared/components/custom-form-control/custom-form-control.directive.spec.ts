import { CustomFormControl } from './custom-form-control.component';

class TestClass extends CustomFormControl<any> {
  public override setDisabledState(isDisabled: boolean): void {}
}

describe('CustomFormControl', () => {
  it('should create an instance', () => {
    const object = new TestClass();
    expect(object).toBeTruthy();
  });
});
