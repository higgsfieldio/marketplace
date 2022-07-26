import { useState } from "react";
import { MetaTags } from "react-meta-tags";
import { howToCreateAccount, keyTerms } from "../../../assets/utilis";
import "./Faq.css";

function Faq({ login, currentUser }) {
  const [isCreateAccountSelected, setIsCreateAccountSelected] = useState(true);
  const [isKeyTermsSelected, setIsKeyTermsSelected] = useState(false);
  const [questionsDropOpen, setQuestionsDropOpen] = useState(false);
  const [question, setQuestion] = useState("create-account");

  //Обработчики клика по кнопкам вопросов
  function handleCreateAccountChange() {
    if (isKeyTermsSelected) {
      setIsCreateAccountSelected(true);
      setIsKeyTermsSelected(false);
      setQuestion("create-account");
    }
  }

  function handleKeyTermsChange() {
    if (isCreateAccountSelected) {
      setIsCreateAccountSelected(false);
      setIsKeyTermsSelected(true);
      setQuestion("key-terms");
    }
  }

  //Обработчик клика по пункту выпадающего списка
  function handleDropdownButtonClick() {
    setQuestionsDropOpen(!questionsDropOpen);
    question === "create-account"
      ? setQuestion("key-terms")
      : setQuestion("create-account");
    handleCreateAccountChange();
    handleKeyTermsChange();
  }

  //Обработчик клика по кнопке логина
  function handleLoginButton() {
    login()
  }

  return (
    <section className="faq">
      <MetaTags>
        <title>F.A.Q</title>
        <meta property="og:site_name" content={`Higgs Field`} />
        <meta property="og:title" content={`F.A.Q`} />
        <meta property="twitter:title" content={`F.A.Q`} />
        <meta property="vk:title" content={`F.A.Q`} />
      </MetaTags>
      <h2 className="faq__title">F.A.Q</h2>
      <div className="faq__container">
        <div
          className={`faq__questions-dropdown ${questionsDropOpen ? "faq__questions-dropdown_active" : ""
            }`}
        >
          <div
            className="faq__question-dropdown-selected"
            onClick={() => setQuestionsDropOpen(!questionsDropOpen)}
          >
            {question === "create-account" ? (
              <p className="faq__question-selected">
                How do I create Higgs Field account?
              </p>
            ) : (
              <></>
            )}
            {question === "key-terms" ? (
              <p className="faq__question-selected">
                Key terms in NFTs and Web3.0
              </p>
            ) : (
              <></>
            )}

            <svg
              className={`faq__dropdown-arrow ${questionsDropOpen ? "faq__dropdown-arrow_active" : ""
                }`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="faq__dropdown-arrow-stroke"
                d="M4 6.66797L7.29289 9.96086C7.68342 10.3514 8.31658 10.3514 8.70711 9.96086L12 6.66797"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {questionsDropOpen ? (
            <div className="faq__questions-dropdown-items">
              {question === "create-account" ? (
                <></>
              ) : (
                <button
                  className="faq__question-item"
                  type="button"
                  onClick={handleDropdownButtonClick}
                >
                  How do I create Higgs Field account?
                </button>
              )}
              {question === "key-terms" ? (
                <></>
              ) : (
                <button
                  className="faq__question-item"
                  type="button"
                  onClick={handleDropdownButtonClick}
                >
                  Key terms in NFTs and Web3.0
                </button>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>

        <ul className="faq__questions">
          <li className="faq__item">
            <button
              className={`faq__question ${isCreateAccountSelected ? "faq__question_type_selected" : ""
                }`}
              type="button"
              onClick={handleCreateAccountChange}
            >
              How do I create Higgs Field account?
            </button>
          </li>
          <li className="faq__item">
            <button
              className={`faq__question ${isKeyTermsSelected ? "faq__question_type_selected" : ""
                }`}
              type="button"
              onClick={handleKeyTermsChange}
            >
              Key terms in NFTs and Web3.0
            </button>
          </li>
        </ul>

        {isCreateAccountSelected && (
          <div className="faq__answer">
            <p className="faq__heading">How do I create Higgs Field account?</p>
            <p className="faq__text">
              This guide explaines how to open your account and start buying and
              selling NFTs on Higgs Field
            </p>
            <ul className="faq__list">
              {howToCreateAccount.map((item, i) => (
                <li className="faq__answer-item" key={i}>
                  <p className="faq__heading">{item.heading}</p>
                  <p className="faq__text">{item.text}</p>
                </li>
              ))}
              {!currentUser ?
                <button
                  className="faq__login-button"
                  type="button"
                  onClick={handleLoginButton}
                >
                  Log in
                </button>
                : <p className="faq__text faq__text_subtext">
                  Now you can customise your profile, including: username, bio.
                  Your profile photo and cover banner can be customised on your
                  account as well.
                </p>}


            </ul>
          </div>
        )}

        {isKeyTermsSelected && (
          <div className="faq__answer">
            <p className="faq__heading">
              What are the key terms to know in NFTs and Web3?
            </p>
            <p className="faq__text">
              Here's a list of key terms used in the NFT space and it's a
              helpful to review before you get started.
            </p>
            <ul className="faq__list">
              {keyTerms.map((item, i) => (
                <li className="faq__answer-item" key={i}>
                  <p className="faq__heading">{item.heading}</p>
                  <p className="faq__text">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default Faq;
