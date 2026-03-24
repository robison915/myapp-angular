import { Injectable } from '@angular/core';

export interface RankingJogador {
  nome: string;
  vitorias: number;
  tempoTotalSegundos: number;
}

export interface ResultadoPartida {
  vencedor: string;
  tempoVitoriaSegundos: number;
  tevePartida: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class JogoRankingStorageService {
  private readonly storageKey = 'jogo_ranking';

  buscarRanking(): RankingJogador[] {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item): item is RankingJogador => {
          return (
            typeof item === 'object' &&
            item !== null &&
            typeof (item as RankingJogador).nome === 'string' &&
            typeof (item as RankingJogador).vitorias === 'number' &&
            typeof (item as RankingJogador).tempoTotalSegundos === 'number'
          );
        })
        .map((item) => ({
          nome: item.nome.trim(),
          vitorias: Number.isFinite(item.vitorias) ? item.vitorias : 0,
          tempoTotalSegundos: Number.isFinite(item.tempoTotalSegundos)
            ? item.tempoTotalSegundos
            : 0,
        }))
        .filter((item) => item.nome.length > 0);
    } catch {
      return [];
    }
  }

  resetarComJogadores(jogadores: string[]): void {
    const nomes = this.normalizarNomes(jogadores);
    const ranking = nomes.map((nome) => ({
      nome,
      vitorias: 0,
      tempoTotalSegundos: 0,
    }));

    this.salvarRanking(ranking);
  }

  sincronizarJogadores(jogadores: string[]): void {
    const nomes = this.normalizarNomes(jogadores);
    const rankingAtual = this.buscarRanking();
    const rankingPorNome = new Map(
      rankingAtual.map((jogador) => [jogador.nome, jogador] as const)
    );

    const rankingSincronizado = nomes.map((nome) => {
      const atual = rankingPorNome.get(nome);

      if (!atual) {
        return {
          nome,
          vitorias: 0,
          tempoTotalSegundos: 0,
        };
      }

      return {
        nome,
        vitorias: atual.vitorias,
        tempoTotalSegundos: atual.tempoTotalSegundos,
      };
    });

    this.salvarRanking(rankingSincronizado);
  }

  registrarResultadosRodada(resultados: ResultadoPartida[]): void {
    const ranking = this.buscarRanking();
    const rankingPorNome = new Map(ranking.map((jogador) => [jogador.nome, { ...jogador }]));

    for (const resultado of resultados) {
      if (!resultado.tevePartida) {
        continue;
      }

      const nomeVencedor = resultado.vencedor.trim();

      if (nomeVencedor.length === 0) {
        continue;
      }

      const tempoValido = Number.isFinite(resultado.tempoVitoriaSegundos)
        ? Math.max(0, resultado.tempoVitoriaSegundos)
        : 0;

      const atual = rankingPorNome.get(nomeVencedor) ?? {
        nome: nomeVencedor,
        vitorias: 0,
        tempoTotalSegundos: 0,
      };

      atual.vitorias += 1;
      atual.tempoTotalSegundos += tempoValido;
      rankingPorNome.set(nomeVencedor, atual);
    }

    this.salvarRanking(Array.from(rankingPorNome.values()));
  }

  limparRanking(): void {
    localStorage.removeItem(this.storageKey);
  }

  private salvarRanking(ranking: RankingJogador[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ranking));
  }

  private normalizarNomes(jogadores: string[]): string[] {
    const nomesNormalizados = jogadores
      .map((nome) => nome.trim())
      .filter((nome) => nome.length > 0);

    return Array.from(new Set(nomesNormalizados));
  }
}
