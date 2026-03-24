import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JogoNomesStorageService } from '../../services/jogo-nomes-storage.service';

@Component({
  selector: 'app-listar-nomes',
  templateUrl: './listar-nomes.page.html',
  styleUrls: ['./listar-nomes.page.scss'],
  standalone: false,
})
export class ListarNomesPage {
  names: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly jogoNomesStorageService: JogoNomesStorageService
  ) {}

  ionViewWillEnter(): void {
    this.names = this.jogoNomesStorageService.buscarNomes();
  }

  referenciaIndice(index: number): number {
    return index;
  }

  voltarCadastro(): void {
    this.router.navigate(['/jogo']);
  }
}
