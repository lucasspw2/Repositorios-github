import {useState, useCallback, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Container, Form, SubmitButton, List, DeleteButton } from './styles';
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import api from '../../services/api';


export default function Main() {
 //state para salvar do input e buscar na api
 const [newRepo, setNewRepo] = useState('');
 
 //state que salva todos os repositorios
 const [repositorios, setRepositorios] = useState([]);
 
 //fazer renderizacão enquanto busca info da api
 const [loading, setLoading] = useState(false);

//state p/ dar retorno visual ao usuario quando der error
 const [alerta, setAlerta] = useState(null);




 // efeito disparado antes de render a pagina
useEffect(() =>{
   //buscando todos os itens do localstorage
   const repoStorage = localStorage.getItem('repos');

   //verificando se existe algo no storage e add ao state de repositorios
   if(repoStorage){
      //formatando string em objeto
      setRepositorios(JSON.parse(repoStorage));

   }

}, []);





// efeito disparado sempre que o repositorio sofrer alteração
useEffect( ()=>{
   localStorage.setItem('repos', JSON.stringify(repositorios));
   //salvando repositorios no localstorage/ deve ser convertido p/string
}, [repositorios]);



//função que salva o value do input
 function handleInputChange(e){
    setNewRepo(e.target.value);
    
   //p/ sair a borda vermelha ao digitar
    setAlerta(null);
 }


 //função do form p/ buscar info da api e salvar no state de todos os repositorios
 const handleSubmit = useCallback((e) => {
   e.preventDefault();
   
   async function submit(){
      //loading pra true p/ render algo enquanto buscamos na api.
      setLoading(true);
      setAlerta(null);
      
      try{
         //verificando se não foi digitado nada no input
         if(newRepo === ''){
            throw new Error('você precisa indicar um repositorio');
            //dentro do try/catch é possivel lançar um throw
         }

         const response = await api.get(`repos/${newRepo}`);
         
         //varrendo os repositorios e verificando se ja existe p/ n duplicar
         const hasRepo = repositorios.find((repo) => repo.name === newRepo);

         if(hasRepo){
            throw new Error('Repositorio Duplicado');
         }


         const data = {
            name: response.data.full_name,
         }
         
         //ao salvar novas informações utilizar o '...' [...repositorios, data] para não apagar o valor de outros repositorios
         setRepositorios([...repositorios, data]);
         
         //limpando o campo do input 
         setNewRepo('');

      }catch(error){
         setAlerta(true);
         console.log(error); 

      }finally{
         //se a verificação passar retirar o loading
         setLoading(false);
      }
      
   }
   //chamando a função criada
   submit();


// se os states passados p/ parametro alterar efeito sera disparado  
 }, [newRepo, repositorios]); 
   
 
   // função p/ excluir repositorio
   const handleDelete = useCallback((repo) => {
      //filter devolve somente os repositorios com o nome diferente(!==) do enviado por parametro(repo)
      const find = repositorios.filter((r) => r.name !== repo)

      //passando o retorno atualizado p/state
      setRepositorios(find);

   }, [repositorios]);


   return (
   <div>
       <Container>
         <h1>
            <FaGithub size={25}/>
            Meus Repositorios
         </h1>

         <Form onSubmit={handleSubmit } error={alerta}> {/* repassando o alerta como props */}
           
            <input 
            type="text" 
            placeholder="Adicionar repositorio"
            onChange={ handleInputChange } 
            value={newRepo}
            />
            
             {/* passando uma renderização condicional com loading p/ style . se ele for true 1 : falso 0.
             o type: attrs do botao é configurado no styles styled.button.attrs({type: 'submit'})*/}
            
            <SubmitButton loading={loading ? 1 : 0}>
                {/*criando mais uma condicional p/ o icone do botão */}
               {loading ? (
                  <FaSpinner color="#FFF" size={14} />
               ):(
                  <FaPlus size={14} color="#FFF"/>
               )}
               
            </SubmitButton>
         
         </Form>

         <List>
               {repositorios.map((repo) => (
                  <li key={repo.name}>
                     <span>
                        {/*passando o nome do repositorio p/ função de excluir */}
                        <DeleteButton onClick={()=> handleDelete(repo.name)} >
                           <FaTrash size={14}/>
                        </DeleteButton>
                        {repo.name}
                        </span>
                     {/*Link p/ exibir detalhe do repositorio */}
                     <Link to={`/repositorio/${encodeURIComponent(repo.name)}`} >
                        {/* encodeURIComponent p/ transformar o parametro em apenas 1 pq é enviado autor/tecnologia
                        ex:
                        facebook/react */}

                        <FaBars size={20} />
                     </Link>
                  </li>
               ))}
              
            
         </List>
        
       </Container>
   </div>
 );
}