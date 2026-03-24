import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JogoNomesStorageService } from '../../services/jogo-nomes-storage.service';
import { JogoRankingStorageService } from '../../services/jogo-ranking-storage.service';

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
    private readonly jogoNomesStorageService: JogoNomesStorageService,
    private readonly jogoRankingStorageService: JogoRankingStorageService
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

  limparLista(): void {
    this.jogoNomesStorageService.limparNomes();
    this.jogoRankingStorageService.limparRanking();
    this.names = [];
    this.router.navigate(['/jogo']);
  }

  iniciarPartidas(): void {
    if (this.names.length < 2) {
      return;
    }

    this.router.navigate(['/jogo/partidas']);
  }
}
