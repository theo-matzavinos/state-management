import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { TodoDonenessDto, TodoListItemDto } from '@api/dto';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import {
  BrnRadioComponent,
  BrnRadioGroupComponent,
} from '@spartan-ng/ui-radiogroup-brain';
import {
  HlmRadioDirective,
  HlmRadioGroupDirective,
  HlmRadioIndicatorComponent,
} from '@spartan-ng/ui-radiogroup-helm';

@Component({
  selector: 'todos-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    HlmInputDirective,
    HlmLabelDirective,
    HlmCheckboxComponent,
    BrnRadioGroupComponent,
    BrnRadioComponent,
    HlmRadioGroupDirective,
    HlmRadioDirective,
    HlmRadioIndicatorComponent,
  ],
  template: `
    <form class="flex flex-col gap-2" [id]="formId" [formGroup]="form">
      <label hlmLabel>
        Title
        <input type="text" [formControl]="form.controls.title" hlmInput />
      </label>

      <label hlmLabel>
        Description
        <textarea
          type="text"
          [formControl]="form.controls.description"
          hlmInput
          rows="5"
        ></textarea>
      </label>

      <fieldset>
        <legend hlmLabel>Doneness</legend>
        <brn-radio-group hlm [formControl]="form.controls.doneness">
          @for (value of donenessValues(); track value.value) {
            <brn-radio hlm [value]="value.value">
              <hlm-radio-indicator indicator />
              {{ value.text }}
            </brn-radio>
          }
        </brn-radio-group>
      </fieldset>
    </form>
  `,
})
export class TodoForm {
  readonly formId = 'todo-form';
  todo = input<TodoListItemDto | undefined>();
  donenessValues = input.required<TodoDonenessDto[]>();

  readonly form = injectForm(this.todo);
}

function injectForm(todo: TodoForm['todo']) {
  const formBuilder = inject(NonNullableFormBuilder);
  const form = formBuilder.group({
    id: formBuilder.control(0),
    title: formBuilder.control('', { validators: Validators.required }),
    description: formBuilder.control('', { validators: Validators.required }),
    doneness: formBuilder.control(0),
  });

  effect(() => {
    const value = todo();

    untracked(() => form.reset(value));
  });

  return form;
}
