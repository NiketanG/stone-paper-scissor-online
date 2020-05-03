import React, {Component} from 'react';
import './index.css'
import {Link} from 'react-router-dom';
class Info extends Component{
    render(){
        return(
            <div>
                <Link to="/">Go Home</Link>
                <div className="parent">
                    <div className="Info">
                        <Link to="/" className="title">
                        <h1>
                            Stone-Paper-Scissor
                            <sup>Online</sup>
                        </h1>
                        </Link>
                        <div className="content">
                            <p>
                                <b>How was this built ?</b><br/>
                                Using <b>Python</b> along with <b>Flask</b> MicroFramework for the Server Side Handling. And <b>React</b> ofcourse. 
                                <br/><br/>
                                <b>Why ?</b><br/>
                                Because why not ?
                                <br/><br/>
                                <b>Wanna contribute ?</b><br/>
                                <a href="https://github.com/NiketanG/stone-paper-scissor-online">Github Repo</a>
                                <br/><br/>
                                <a href="mailto:nikegulekar@gmail.com">Contact Me</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="footer">
                            <p>Designed and Developed by <a href="http://bit.ly/nikketan">Niketan Gulekar</a> 	&copy;2020</p>
                </div>
            </div>
        )
    }
}

export default Info;