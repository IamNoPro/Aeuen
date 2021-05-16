import styled from 'styled-components'
import {Link} from 'react-router-dom'

export const Container =styled.div `
z-index:1;
margin-top:1rem;
width:80%;
height:100%;
max-width:1300px;
margin-right:auto;
margin-left:auto;
padding-right:50px;
padding-left: 50px;
`
export const InfoRow = styled.div `
display:flex;
margin:0 -15px -15px -15px;
flex-wrap:wrap;
align-items:center;
flex-direction: ${({imgStart}) => (imgStart ? 'row-reverse': 'row') };
`;
export const InfoColumn = styled.div `
margin-bottom: 15px;
padding-right:15px;
padding-left:15px;
flex:1;
max-width:50%;
flex-basis:50%;


@media screen and (max-width: 768px) {

    max-width:100%;
    flex-basis:100%;
    display:flex;
    justify-content:center;


}
`;
export const ImgWrapper=styled.div `
max-width:555px;
display:flex;
height:750px;
justify-content: ${({start})=>(start? 'flex-start': 'flex-end')};

`;
export const TextWrapper =styled.div `
    max-width:540px;
    padding-top:0;
    padding-bottom: 60px;

    @media screen and(max-width: 768px){
        padding-bottom:65px;
    }
`;

export const Topline =styled.div `
color: ${({lightTopLine}) =>(lightTopLine ? 'black' : '#4B59F7')};
font-size:18px;
line-height:16px;
letter-spacing:1.4px;
margin-bottom:16px;
`;

export const Heading =styled.h1 `
margin-bottom:24px;
font-size:48px;
line-height:1.1;
color:${({lightText})=> (lightText ? '#f7f8fa': '#1c2237')};
`;

export const Subtitle =styled.p ` 
max-width:440px;
margin-bottom:24px;
font-size:18px;
line-height:24px;
color:${({lightTextDesc})=> (lightTextDesc ? '#a9b3c1': '#1c2237')};
`

export const Button =styled.button `
border-radius: 4px;
background: ${({primary}) => (primary? '#1F00B0' : '#0467FB')};
white-space: nowrap;
padding: ${({big}) => (big? '12px 64px' : '10px 20px')};
color:#fff;
font-size:${({fontBig}) =>(fontBig ? '20px ': '16px')};
outline:none;
border:none;
cursor: pointer;

&:hover {
    transition: all 0.3s ease-out;
    background:lightblue;
    
    
}
`
export const Img = styled.img `
    padding-right:0;
    border:0;
    max-width:100%;
    vertical-align:middle;
    display:inline-block;
    max-height:1000px;
    
`;