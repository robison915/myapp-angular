import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroNomesPage } from './pages/cadastro-nomes/cadastro-nomes.page';
import { ListarNomesPage } from './pages/listar-nomes/listar-nomes.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CadastroNomesPage,
  },
  {
    path: 'listar-nomes',
    component: ListarNomesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JogoRoutingModule {}
