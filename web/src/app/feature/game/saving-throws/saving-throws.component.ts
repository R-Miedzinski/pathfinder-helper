import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import stringSort from 'src/app/shared/helpers/string-sort';
import { cloneDeep } from 'lodash';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { SkillsService } from '../services/skills.service';
import { SavingThrow } from '../../../shared/models/interfaces/saving-throw';
import { CharacterSheetMode } from '../../../shared/models/enums/character-sheet-mode';
import { Proficiency } from '../../../shared/models/enums/proficiency';

@Component({
  selector: 'app-saving-throws',
  templateUrl: './saving-throws.component.html',
  styleUrls: ['./saving-throws.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingThrowsComponent implements OnInit {
  @Input() savingThrows: SavingThrow[] = [];
  @Input({ required: true }) mode!: CharacterSheetMode;
  protected modes = CharacterSheetMode;
  protected savingThrowsForm!: FormGroup;
  protected proficiencies = Proficiency;
  protected keepOrderLocal = keepOrder;

  constructor(private fb: FormBuilder, private skillsService: SkillsService) {}

  public ngOnInit(): void {
    this.savingThrows = cloneDeep(this.savingThrows).sort((a, b) =>
      stringSort(a.name, b.name)
    );

    this.initForm();
  }

  protected initForm(): void {
    this.savingThrowsForm = this.fb.group(
      this.createFormGroup(this.savingThrows)
    );
  }

  protected createFormGroup(savingThrows: SavingThrow[]): AbstractControl[] {
    let formControlObj: any = {};
    savingThrows.forEach(savingThrow => {
      formControlObj[savingThrow.name] = savingThrow.proficiency;
    });

    return formControlObj;
  }

  protected valueChanged(savingThrow: SavingThrow): void {
    const updatedSavingThrow = cloneDeep(savingThrow);
    updatedSavingThrow.proficiency =
      this.savingThrowsForm.get(savingThrow.name)?.value ??
      savingThrow.proficiency;

    this.skillsService.savingThrowChangeHandler(updatedSavingThrow);
  }
}
