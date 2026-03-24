import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JogoNomesStorageService } from '../../services/jogo-nomes-storage.service';
import {
  JogoRankingStorageService,
  ResultadoPartida,
} from '../../services/jogo-ranking-storage.service';

interface Confronto {
  id: number;
  jogador1: string;
  jogador2: string | null;
  vencedor: string | null;
  tempoVitoriaSegundos: number | null;
}

@Component({
  selector: 'app-partidas',
  templateUrl: './partidas.page.html',
  styleUrls: ['./partidas.page.scss'],
  standalone: false,
})
export class PartidasPage {
  rodadaAtual = 1;
  jogadores: string[] = [];
  confrontos: Confronto[] = [];

  constructor(
    private readonly router: Router,
    private readonly jogoNomesStorageService: JogoNomesStorageService,
    private readonly jogoRankingStorageService: JogoRankingStorageService
  ) {}

  ionViewWillEnter(): void {
    this.jogadores = this.jogoNomesStorageService
      .buscarNomes()
      .map((nome) => nome.trim())
      .filter((nome) => nome.length > 0);

    this.jogoRankingStorageService.sincronizarJogadores(this.jogadores);
    this.rodadaAtual = 1;
    this.confrontos = this.gerarConfrontos(this.jogadores);
  }

  referenciaIndice(index: number): number {
    return index;
  }

  definirVencedor(confrontoId: number, vencedor: string): void {
    this.confrontos = this.confrontos.map((confronto) =>
      confronto.id === confrontoId ? { ...confronto, vencedor } : confronto
    );
  }

  definirTempoVitoria(confrontoId: number, value: number | string | null): void {
    const parsed = Number(value);
    const tempoVitoriaSegundos =
      Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;

    this.confrontos = this.confrontos.map((confronto) =>
      confronto.id === confrontoId ? { ...confronto, tempoVitoriaSegundos } : confronto
    );
  }

  todosResultadosDefinidos(): boolean {
    if (this.confrontos.length === 0) {
      return false;
    }

    return this.confrontos.every((confronto) => {
      if (confronto.vencedor === null) {
        return false;
      }

      if (confronto.jogador2 === null) {
        return true;
      }

      return confronto.tempoVitoriaSegundos !== null;
    });
  }

  criarNovaRodada(): void {
    if (!this.todosResultadosDefinidos()) {
      return;
    }

    this.rodadaAtual += 1;
    this.confrontos = this.gerarConfrontos(this.jogadores);
  }

  finalizarRodada(): void {
    if (!this.todosResultadosDefinidos()) {
      return;
    }

    const resultados: ResultadoPartida[] = this.confrontos
      .filter((confronto): confronto is Confronto & { vencedor: string } => confronto.vencedor !== null)
      .map((confronto) => ({
        vencedor: confronto.vencedor,
        tempoVitoriaSegundos: confronto.tempoVitoriaSegundos ?? 0,
        tevePartida: confronto.jogador2 !== null,
      }));

    this.jogoRankingStorageService.registrarResultadosRodada(resultados);
    this.router.navigate(['/jogo/ranking']);
  }

  voltarLista(): void {
    this.router.navigate(['/jogo/listar-nomes']);
  }

  private gerarConfrontos(jogadoresBase: string[]): Confronto[] {
    const jogadoresEmbaralhados = this.embaralhar([...jogadoresBase]);
    const confrontos: Confronto[] = [];
    let identificador = 1;

    for (let index = 0; index < jogadoresEmbaralhados.length; index += 2) {
      const jogador1 = jogadoresEmbaralhados[index];
      const jogador2 = jogadoresEmbaralhados[index + 1] ?? null;

      confrontos.push({
        id: identificador++,
        jogador1,
        jogador2,
        vencedor: jogador2 === null ? jogador1 : null,
        tempoVitoriaSegundos: jogador2 === null ? 0 : null,
      });
    }

    return confrontos;
  }

  private embaralhar(jogadores: string[]): string[] {
    for (let index = jogadores.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [jogadores[index], jogadores[randomIndex]] = [
        jogadores[randomIndex],
        jogadores[index],
      ];
    }

    return jogadores;
  }
}
