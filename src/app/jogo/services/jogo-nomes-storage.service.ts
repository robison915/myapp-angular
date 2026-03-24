import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JogoNomesStorageService {
  private readonly storageKey = 'jogo_nomes';

  buscarNomes(): string[] {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item): item is string => typeof item === 'string');
    } catch {
      return [];
    }
  }

  salvarNomes(names: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(names));
  }

  limparNomes(): void {
    localStorage.removeItem(this.storageKey);
  }
}
