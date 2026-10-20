import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARG_CARD, ArgButton, ArgIcon } from '@brunomonfardini/ui';
import { SALON_CONFIG } from '../../core/config/salon.config';
import { ComoChegar } from './como-chegar/como-chegar';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ARG_CARD, ArgButton, ArgIcon, ComoChegar],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly salon = inject(SALON_CONFIG);
}
