import React from 'react'
import { Container, InfoRow,InfoColumn,ImgWrapper,TextWrapper,Topline,Heading,Subtitle,Button,Img} from './InfoSection.Elements'
import {Link} from 'react-router-dom'

const InfoSection = () => {
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
                <TextWrapper>
                    <Heading lightText={false}>Aeuen</Heading>
                    <Topline lightTopLine ={true}>Find Your Audience</Topline>
                    <Subtitle lightTextDesc = {false}>{text}</Subtitle>
                    <Link to='/signup'>
                        <Button big fontBig primary={true}>
                            Get Started
                        </Button>
                    </Link>
                </TextWrapper>
            </InfoRow>
            
        </Container>
        </>
        
    )
}

export default InfoSection
