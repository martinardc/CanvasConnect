import "./LandingPage.css"



function LandingPage() {

    return (

        <div className="lp-container">
            <div className='left-side'>
                <h1>
                    <div className="welcome-text">Welcome To  <br /></div>
                    <div className="logo-title"><img id="logo-img" src="/assets/logo32.png" alt="logo" /><a className="page-title">CanvasConnect</a> </div>
                </h1>
                <h4>A place for artists and art lovers from all around the globe.</h4>
                <p>CanvasConnect allows people to showcase their art as well as discover art that resonates with them.<b> Join us today!</b></p>
            </div>
            <div className="right-side">
                <div className="canvas-wrapper">
                    <img src="/assets/canvas-bg.png" alt="canvas" className="canvas-img" />
                    <div className="canvas-buttons">
                        <a href="/register" className="register-btn-lp">REGISTER</a>
                        <a href="/login" className="login-btn-lp">LOGIN</a>
                        <a href="/homepage" className="cont-guest">Continue as a guest</a>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default LandingPage;