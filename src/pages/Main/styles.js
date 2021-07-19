import styled, {keyframes, css} from 'styled-components';

// keyframes p animação css 

export const Container = styled.div`
    max-width: 700px;
    background-color: #FFF;
    border-radius: 4px;
    box-shadow: 0 0 50px rgba(0,0,0, 0.6);
    padding: 30px;
    margin: 80px auto;

    h1{
        font-size: 20px;
        display: flex;
        align-items: center;
        flex-direction: row;

        svg{
            margin-right: 10px;
        }
    }
 `;

 export const Form = styled.form`
    margin-top: 30px;
    display: flex;
    flex-direction: row;


    input{
        flex:1;
        //recebendo a props.error(state Alerta) e fazendo renderização condicional
        border: 1px solid ${props => (props.error ? '#FF0000' : '#eee')};
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 17px;
    }
 `;



//criando animação do botão
const animate = keyframes`
//da onde a animação começa
    from{
        transform: rotate(0deg);
    }
//até
    to{
        transform: rotate(360deg); // uma volta completa 
    }

`;

export const SubmitButton = styled.button.attrs(props => ({
    type: 'submit',
    /* 
    props porque estamos passando o loading.
    propriedade desabled desativa o botão se ele estiver carregando o loading.
     */
     disabled: props.loading,
}))`
    background: #0D2636;
    border: 0;
    border-radius: 4px;
    margin-left: 10px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;

  /* para acessar uma propriedade(disabled) usa o &[nome da propriedade] */
    &[disabled]{
        cursor: not-allowed;
        opacity: 0.5;
    }
    //p/ acessar as props
    ${props => props.loading && 
        // && condicional apenas com 1 saida
        css`
        //acessando o icone
        svg{
            animation: ${animate}  2s linear infinite; 
             //inserindo animação criada
            }
        `

    }
`;

export const List = styled.ul`
    list-style: none;
    margin-top: 20px;


    li{
        padding: 15px 0 ;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        //ignora o primeiro e aplica do segundo em diante
        & + li{
            border-top: 1px solid #eee;
        }

        a{
            color: #0D2636;
            text-decoration: none;

        }
    }

`;

export const DeleteButton = styled.button.attrs({
    type: 'button',
})`

    margin-left: 6px;
    background: transparent;
    color: #0D2636;
    border: 0;
    padding: 8px 7px;
    outline: 0;
    border-radius: 4px;

`;








