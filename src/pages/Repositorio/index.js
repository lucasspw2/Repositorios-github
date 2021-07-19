import React, {useState ,useEffect} from 'react';
import api from '../../services/api';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from './styles';
import { FaArrowLeft } from 'react-icons/fa';

export default function Repositorio({match}) {
  
  //state p/ salvar do retorno da api.
  const [repositorio, setRepositorio] = useState({}); // recebe {} por conter apenas 1 repositorio
  const [issues, setIssues] = useState([]); // recebe array por ser mais de uma issues

  const [loading, setLoading] = useState(true); // state p/ fazer render condicional 

  const [page, setPage] = useState(1); //state p/ controlar paginação da issues / começa na pagina (1)

  const [filtros, setFiltros] = useState([
    {state: 'all', label: 'Todas', active: true }, //index 0
    {state: 'open', label: 'Abertas', active: false },
    {state: 'closed', label: 'Fechadas', active: false },
  ]); // para filtrar a situação da issue. 

  const [filtroIndex, setFiltroIndex] = useState(0); // valor (0) inicial pq array começa com posição 0
  //state p/ manipular o botão selecionado com retorno visual
  

  // efeito p/ buscar repositorio / issues
  useEffect(() => {

    async function load(){
     //decode do parametro p/ ser utilizado
      const nomeRepo = decodeURIComponent(match.params.repositorio);
    
      //Promise fará as 2 requisições ao mesmo tempo e devolve dentro de um array
      //desconstruindo o valor das 2 promise.  p/ utilizar inserir .data

      const[repositorioData, issuesData] = await Promise.all([
      api.get(`/repos/${nomeRepo}`),
      api.get(`/repos/${nomeRepo}/issues`, {
        //axios permite passar o parametro separado em vez de issues=
        params:{
          //pega o state filtros com active true = all(todos)
          state: filtros.find( f => f.active).state, 
          per_page: 5
          //per_page = quantos por pagina
          
        }
      })
    ]);

    setRepositorio(repositorioData.data);
    setIssues(issuesData.data);
    setLoading(false);
    
    }
    
    //executando a função criada
    load();

  }, [match.params.repositorio, filtros]);
  

  // efeito p/ paginação
  useEffect(() => {
   
    async function loadIssue(){
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params:{
          //filtra a pesquisa pelo index do botão selecionado pegando state do objeto
          state: filtros[filtroIndex].state ,
          page,
          //passando state(page) p/ o campo page: do axios(omitido)
          per_page: 5,
        }
      })

      setIssues(response.data);
    }


    loadIssue();

    // toda vez que state e o parametro(url) alterar efeito sera disparado
  }, [match.params.repositorio, page, filtroIndex, filtros])


  //função de paginação
  function handlePage(action){
    // se o parametro enviado for 'back' = page -1(voltando pagina) senao page +1
    setPage(action === 'back' ? page -1 : page + 1);

  }


  //recebe o index do array e atualiza o state
  function handleFiltro(index){
    setFiltroIndex(index);
    
  }


// renderizar uma mensagem enquanto busca info api
  if(loading){
    return(
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    )
  }
 


  return (
       <Container>
         {/* o BackButton recebe a propriedade (to) pq ele foi declarado com o Link do react-router-dom no styles*/}
         <BackButton to="/" >
            <FaArrowLeft color="#000" size={30} />
         </BackButton>
       
        {/* map não é necessario pq existe somente um repositorio.*/}
         <Owner>
          <img src={repositorio.owner.avatar_url}
            alt={repositorio.owner.login}
            />
            <h1>{repositorio.name}</h1>
            <p>{repositorio.description}</p>
         </Owner>



          {/* grupo de botões p/ filtrar a pesquisa por situação 
              passando state p/ alterar styled do botão clicado */}
         <FilterList active={filtroIndex}>
           
           {filtros.map((filtro, index) => (
             //passando o index(posição) p/ função onClick
             <button type="button" 
               key={filtro.label} 
               onClick={ () => handleFiltro(index)}> 
               {filtro.label} 
             </button>
           ))}
         
         </FilterList>


            {/* listando issues */}
         <IssuesList>
           {issues.map((issue) => (
            <li key={String(issue.id)}>
               <img src={issue.user.avatar_url} alt={issue.user.login} />
              
              <div>
                <strong>
                  {/* utilizando (a) pq é p/ um link externo da aplicação */}
                  <a href={issue.html_url}> {issue.title} </a>
                  
                  {/* fazendo map nas labels pq podem existir varias */}
                  {issue.labels.map((label) =>(
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
           ))}
           
         </IssuesList>


          {/* grupo de botoes paginação */}
         <PageActions>
            <button 
            type="button" 
            onClick={ () => handlePage('back')}
            // passando disabled p/ alterar o botão(Voltar) quando a pagina for 1
            disabled={page < 2}>
              Voltar
            </button>

            <button type="button" onClick={() => handlePage('next')}>
              Proximo
            </button>
         </PageActions>

       </Container>
    
 );
}












