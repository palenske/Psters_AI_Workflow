# 1 - "Na edição de cursos, não está sendo possível gerar um vídeo com o HeyGen. Ele personaliza e dá início, mas após quase um minuto, ele dá erro."

## arquivos relacionados:
- `apps/sm-iter-painel/components/ui/Curso/Curso.tsx`
- `apps/sm-iter-painel/components/ui/Curso/CursoMenu.tsx`
- `apps/sm-iter-painel/components/ui/Curso/Tela/Tela.tsx`
- `apps/sm-iter-painel/components/ui/Curso/Tela/GerarVideo/GerarVideoModal.tsx`
- `apps/sm-iter-painel/components/ui/Curso/Tela/GerarVideo/components/HeyGenStatusStates.tsx`

# 2 - "O filtro da aba de performace no menu cursos não está respondendo." - CORRIGIDO!

## arquivos relacionados:
- `apps/sm-iter-painel/app/painel/cursos/page.tsx`
- `apps/sm-iter-painel/components/ui/PainelLayout/Content/CoursesContent/CoursesContent.tsx`
- `apps/sm-iter-painel/components/ui/PainelLayout/Content/CoursesContent/components/CoursesPerformance.tsx`

# 3 - "Após criar um curso e ser encaminhado para os módulos para edição, não é possível acessar o curso. Para isso, foi necessário retornar para a listagem, atualizar a página para o novo curso aparecer e ser editado."

## arquivos relacionados:
- `apps/sm-iter-painel/app/painel/cursos/page.tsx`
- `apps/sm-iter-painel/components/ui/PainelLayout/Content/CoursesContent/CoursesContent.tsx`
- `apps/sm-iter-painel/components/ui/NovoCurso/NovoCurso.tsx`
- `apps/sm-iter-painel/app/painel/cursos/[id]/page.tsx`
- `apps/sm-iter-painel/app/painel/components/Curso.tsx`

# 4 - "A navegação do curso por parte do aluno está  com o fluxo afetado. No vídeo mostra um curso que eu acabei de criar, ele não foi publicado, mas está disponível para o aluno. Nos demais cursos, temos marca de anexo de imagem no conteúdo, quiz incompleto, seta de avanço travada, mesmo com o quiz respondido, o botão para retornar de onde parei, volta para a página do dashboad e uma mensagem de erro de permissão é apresentada."
[ANEXO - DESCRIÇÃO DO VÍDEO]: O vídeo começa no dashboard `/painel/dashboard`, na visão de ALUNO (logado como administrador). O usuário clica no primeiro curso da lista "Recentes" e é redirecionado para `/painel/aprenda/359`, acessando a tabs com "Módulos" e "Questionários". Ao clicar na tab "Questionários", o usuário vê 2 cards de questionário desabilitado, os textos dos dois itens é: "Diferencial de mercado" e "Conclusão". O usuário volta na tabs "Módulos" e então clica no primeiro módulo, "Intodução", e é redirecionado para a página `/curso-aluno/359/3946`. Nesta tela há um header, um sidebar a esquerda e o conteúdo ao centro-direita. No conteúdo, há uma mensagem "Nenhuma mídia anexada a esta tela" (precisamos validar se deveria ter carregado algo nesse momento). O usuário avança no conteúdo através da seta com o texto "Avançar". Avança até o botão ser bloquado e então aparecer um botão de Quiz (questionário). Então o usuário clica e é redirecionado para uma nova tela: `/quiz/3947/?telaId=15772`. O usuário vê uma tela com um questionário e uma lista com possíveis respostas. Ele segue respondendo e avançando no conteúdo através de um botão "Confirmar Resposta ->". Para cada avanço, o usuário vê um modal com o feedback da resposta. Ao final, o usuário vê a tela de conclusão e alguns CTA. Ao clicar "Voltar ao módulo que parei", o usuário vai para a rota `cursos/359?chave=Produto&quiz=true` (essa rota está errada, ALUNOS devem voltar para `curso-aluno/359?chave=Produto&quiz=true`, e os parametros devem ser considerados pela página.) e então é repreendido pelo toast "Você não possui permissão para visualizar esta tela", que por sua vez, é redirecionado para a tela inicial `painel/dashboard`

## arquivos relacionados:
- `apps/sm-iter-painel/app/painel/aprenda/[id]/page.tsx`
- `apps/sm-iter-painel/components/ui/PainelLayout/Content/LearnContent/CursoOverview/AprendaCurso.tsx`
- `apps/sm-iter-painel/app/curso-aluno/[idCurso]/[idModulo]/page.tsx`
- `apps/sm-iter-painel/components/ui/AlunoCurso/AlunoCurso.tsx`
- `apps/sm-iter-painel/app/quiz/[id]/page.tsx`
- `apps/sm-iter-painel/components/ui/Questionario/Questionario.tsx`
- `apps/sm-iter-painel/app/cursos/[id]/page.tsx`


# 5 - "No menu certificado, o número de certificados apresentados no usuário do João é de 32 e no header é 15. (Não sei qual está correto). E nenhum certificado está baixando." 

## arquivos relacionados:
- `apps/sm-iter-painel/app/painel/certificados/page.tsx`
- `apps/sm-iter-painel/components/ui/MenuCertificados/MenuCertificados.tsx`

# 6 - "Os dados de desempenho não estão batendo com os de certifcado."

## arquivos relacionados:
- `apps/sm-iter-painel/app/painel/dashboard/page.tsx`
- `apps/sm-iter-painel/components/ui/PainelLayout/Content/DashboardContent/DashboardContent.tsx`
- `apps/sm-iter-painel/app/user/certificado/[...certificado]/components/Certificado.tsx`
- `apps/sm-iter-painel/components/ui/MenuCertificados/MenuCertificados.tsx`
- `apps/sm-iter-painel/app/painel/certificados/page.tsx`
- `apps/sm-iter-painel/app/user/certificado/[...certificado]/page.tsx`