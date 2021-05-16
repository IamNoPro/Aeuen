import styled from 'styled-components'
import {Link} from 'react-router-dom'
export const Nav = styled.nav`
background: white;
height: 80px;
display:flex;
justify-content:center;
align-items:center;
font-size:1.2rem;
position:sticky;
top:0;
z-index:999;
`

export const  NavbarContainer = styled.div`
display: flex;
justify-content:space-between;
height:80px;
z-index:1;
width:80%;
max-width:1300px;
margin-right:auto;
margin-left:auto;
padding-right:50px;
padding-left: 50px;



`;

export const NavLogo =styled(Link)` 
color:black;
justify-self:flex-start;
cursor: pointer;
text-decoration: none;
font-size: 2rem;
display: flex;
align-items:center;
`
export const NavLinks =styled(Link)`
color:black;
display:flex;
align-items:center;
text-decoration:none;
padding: 0.5rem 1rem;
height: 100%;
@media screen and (max-width:960px){
    text-align:center;
    padding: 2rem;
    width:100%;
    display:table;

    &:hover {
        color:#4b59f7;
        transition:all 0.3s ease;
    }
}
  
`
export const NavItem = styled.li `
height:80px;
border-bottom: 2px solid transparent;

&:hover {
    border-bottom: 2px solid #4b59f7;
}

@media screen and (max-width: 960px){
    width: 100%;
    &:hover {
        border:none;
    }
}
`;
export const NavMenu = styled.ul`
display:flex;
align-items:center;
list-style:none;
text-align:center;

`
export const Logo = styled.img `
width:30px;
height:30px;
margin-right:0.3rem;

`