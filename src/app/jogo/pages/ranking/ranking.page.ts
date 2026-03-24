import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JogoNomesStorageService } from '../../services/jogo-nomes-storage.service';
import {
  JogoRankingStorageService,
  RankingJogador,
} from '../../services/jogo-ranking-storage.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: false,
})
export class RankingPage {
  ranking: RankingJogador[] = [];

  constructor(
    private readonly router: Router,
    private readonly jogoNomesStorageService: JogoNomesStorageService,
    private readonly jogoRankingStorageService: JogoRankingStorageService
  ) {}

  ionViewWillEnter(): void {
    this.ranking = this.jogoRankingStorageService
      .buscarRanking()
      .sort(
        (a, b) =>
          b.vitorias - a.vitorias ||
          a.tempoTotalSegundos - b.tempoTotalSegundos ||
          a.nome.localeCompare(b.nome)
      );
  }

  referenciaIndice(index: number): number {
    return index;
  }

  formatarTempo(totalSegundos: number): string {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const segundosFormatados = segundos.toString().padStart(2, '0');

    return `${minutos}:${segundosFormatados}`;
  }

  criarNovaRodada(): void {
    this.router.navigate(['/jogo/partidas']);
  }

  voltarLista(): void {
    this.router.navigate(['/jogo/listar-nomes']);
  }

  limparEVoltarCadastro(): void {
    this.jogoNomesStorageService.limparNomes();
    this.jogoRankingStorageService.limparRanking();
    this.router.navigate(['/jogo']);
  }
}
