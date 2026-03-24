import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JogoRoutingModule } from './jogo-routing.module';
import { CadastroNomesPage } from './pages/cadastro-nomes/cadastro-nomes.page';
import { ListarNomesPage } from './pages/listar-nomes/listar-nomes.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, JogoRoutingModule],
  declarations: [CadastroNomesPage, ListarNomesPage],
})
export class JogoPageModule {}
