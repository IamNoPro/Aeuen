import {Nav, NavbarContainer,NavLogo,NavLinks,NavItem,NavMenu,Logo} from './Header.elements';
const Header = () => {
    const othereventsimg = require('../images/myimg1.svg').default
    return (
        <>
        <Nav>
            <NavbarContainer style={{borderBottom:"2px solid black"}}>
                
                <NavLogo to="/">
                    Aeuen
                    
                </NavLogo>
                <NavMenu>
                <NavLinks to='/otherevents'>
                    <Logo src={othereventsimg}></Logo>
                    Other Events
                </NavLinks> 
                <NavLinks to='/myevents'>
                <Logo src={othereventsimg}></Logo>
                    My Events
                </NavLinks> 
                </NavMenu>
             
            </NavbarContainer>
            
        </Nav>
        </>

    )
}

export default Header
