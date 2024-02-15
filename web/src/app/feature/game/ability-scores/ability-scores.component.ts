import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { Ability } from '../models/interfaces/ability';
import { CharacterSheetMode } from '../models/enums/character-sheet-mode';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { AbilitiesService } from '../services/abilities.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-ability-scores',
  templateUrl: './ability-scores.component.html',
  styleUrls: ['./ability-scores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbilityScoresComponent implements OnInit {
  @Input() abilityScores: Ability[] = [];
  @Input({ required: true }) mode!: CharacterSheetMode;
  protected modes = CharacterSheetMode;
  protected abilitiesForm!: FormGroup;
  protected keepOrderLocal = keepOrder;

  constructor(
    private fb: FormBuilder,
    private abilitiesService: AbilitiesService
  ) {}

  public ngOnInit(): void {
    this.initForm();
  }

  protected initForm(): void {
    this.abilitiesForm = this.fb.group(
      this.createFormGroup(this.abilityScores)
    );
  }

  protected createFormGroup(abilities: Ability[]): AbstractControl[] {
    let formControlObj: any = {};
    abilities.forEach(ability => {
      formControlObj[ability.id] = ability.score;
    });

    return formControlObj;
  }

  protected valueChanged(ability: Ability): void {
    const updatedAbility = cloneDeep(ability);
    updatedAbility.score =
      this.abilitiesForm.get(ability.id)?.value ?? ability.score;

    this.abilitiesService.abilityChangeHandler(updatedAbility);
  }
}
