import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss'],
})
export class CreateGameComponent implements OnInit {
  protected newGameForm: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.newGameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: null,
    });
  }

  protected submitGame(): void {
    const url = `${environment.apiUrl}/api/games`;

    if (this.newGameForm.valid) {
      this.http.post(url, this.newGameForm.value).subscribe({
        next: data => {
          this.navigateTo('../new-game');
        },
      });
    }
  }

  protected navigateTo(path: string): void {
    this.router.navigate([path], { relativeTo: this.route });
  }
}
