import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import "./styles.css";
import Logo from "../../assets/logo.svg";

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={Logo} alt="Ecoleta" />
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrar ponto de coleta de forma eficiente.
          </p>

          <a href="/create-point">
            <span>
                <FiLogIn/>
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </a>
        </main>
      </div>
    </div>
  );
};

export default Home;
