import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JogoNomesStorageService } from '../../services/jogo-nomes-storage.service';

@Component({
  selector: 'app-cadastro-nomes',
  templateUrl: './cadastro-nomes.page.html',
  styleUrls: ['./cadastro-nomes.page.scss'],
  standalone: false,
})
export class CadastroNomesPage {
  names: string[] = [''];

  constructor(
    private readonly router: Router,
    private readonly jogoNomesStorageService: JogoNomesStorageService
  ) {}

  adicionarNome(): void {
    this.names.push('');
  }

  referenciaIndice(index: number): number {
    return index;
  }

  podeSalvar(): boolean {
    return this.names.some((name) => name.trim().length > 0);
  }

  salvarNomes(): void {
    const validNames = this.names
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (validNames.length === 0) {
      return;
    }

    this.jogoNomesStorageService.salvarNomes(validNames);
    this.router.navigate(['/jogo/listar-nomes']);
  }
}
