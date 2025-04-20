import { useState, useCallback } from "react";
import "../CSS/footer.css";

function Footer({ ativarModoLendario, modoLendario }) {
  const [clickCountLegendary, setClickCountLegendary] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  const handleLegendaryClick = useCallback(() => {
    if (modoLendario || isClicking) {
      console.log("Clique bloqueado: modo lendário ativo ou em progresso");
      return;
    }
    setIsClicking(true);
    setClickCountLegendary((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        // Chama ativarModoLendario fora do ciclo de renderização
        setTimeout(() => {
          ativarModoLendario();
          setClickCountLegendary(0);
          setIsClicking(false);
        }, 0);
        return 0;
      }
      setIsClicking(false);
      return newCount;
    });
  }, [modoLendario, ativarModoLendario, isClicking]);

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Super Trunfo - Pokémon",
          text: "Jogue o Super Trunfo Pokémon e batalhe com suas cartas favoritas!",
          url: window.location.href,
        });
        console.log("Conteúdo compartilhado com sucesso!");
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      alert("A função de compartilhamento não é suportada pelo seu navegador.");
    }
  };

  return (
    <footer className="footer">
      <div
        className="easter-egg-legendary"
        title="NÃO FAÇA ISSO!"
        onClick={handleLegendaryClick}
      ></div>
      <div className="footer__columns">
        <div className="footer__column footer__column--logo">
          <h3 className="footer__column-heading">
            <a href="index.html" className="footer__heading--link">
              Super Trunfo - <span>POKÉMON</span>
            </a>
          </h3>
          <p className="footer__column-description">Batalha de Duplas.</p>
        </div>
        <div className="footer__column footer__column--contacts">
          <h3 className="footer__column-heading">Contato</h3>
          <ul className="footer__list footer__list--contacts">
            <li className="footer__list-item">
              <a
                href="mailto:viniciusuchita@gmail.com"
                className="footer__link"
                aria-label="Gmail"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href="https://wa.me/5511963840830"
                className="footer__link"
                aria-label="Whatsapp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__column footer__column--social">
          <h3 className="footer__column-heading">Sobre</h3>
          <p className="footer__column-description">
            Vinícius Uchita / Full-Stack / Criativo / Fã de Pokémon.
          </p>
          <ul className="footer__list footer__list--social">
            <li className="footer__list-item">
              <a
                href="https://github.com/devviniuchita"
                className="footer__link footer__link--social"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href="https://www.linkedin.com/in/viniciusuchita/"
                className="footer__link footer__link--social"
                aria-label="Linkedin"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href="https://www.instagram.com/vincivieira"
                className="footer__link footer__link--social"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href="https://web.facebook.com/viniciusvieira.uchita"
                className="footer__link footer__link--social"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook"></i>
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href="#"
                className="footer__link footer__link--social"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </li>
            <li className="footer__list-item">
              <a
                href="#"
                className="footer__link footer__link--social"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </li>
            <li className="footer__list-item">
              <a
                id="share-button"
                className="footer__link footer__link--social"
                onClick={handleShareClick}
                aria-label="Compartilhar"
                href="javascript:void(0)"
              >
                <i className="fas fa-share-alt"></i>
              </a>
            </li>
          </ul>
          <hr className="footer__divider" />
          <p className="footer__copyright">
            &copy; <span id="anoCorrente">{new Date().getFullYear()}</span> -
            Vinícius Uchita
          </p>
        </div>
      </div>
      <div className="footer__global">
        <hr className="footer__divider" />
        <p className="footer__copyright">
          &copy;Copyright. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
