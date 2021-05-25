import React , {useState}from 'react'
import { Container, InfoRow,InfoColumn,ImgWrapper,TextWrapper,Topline,Heading,Subtitle,Button,Img} from './InfoSection.Elements'
import {Link} from 'react-router-dom'

const InfoSection = (props) => {
    
    const img = require('../images/mal.svg').default
    const text = "A platform for musicians to create and share their performances"
    
    return (
        <>
        <Container style={{backgroundColor:"white" }}>
            <InfoRow imgStart= {""} >
                <InfoColumn>
                    <ImgWrapper start={''}>
                        <Img src={img}></Img>
                    </ImgWrapper>
                    
                </InfoColumn>
                <InfoColumn>
                <TextWrapper>
                    <Heading lightText={false}>Aeuen</Heading>
                    <Topline lightTopLine ={true}>Find Your Audience</Topline>
                    <Subtitle lightTextDesc = {false}>{text}</Subtitle>
                    <Link to={props.userLoggedIn ? '/my-events' : '/signup'}>
                        <Button big fontBig primary={true}>
                            {
                                props.userLoggedIn ? 'My Events' : 'Get Started'    
                            }
                        </Button>
                    </Link>
                </TextWrapper>
                </InfoColumn>
            </InfoRow>
            
        </Container>
        </>
        
    )
}

export default InfoSection
