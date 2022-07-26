import { MetaTags } from "react-meta-tags";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import photo01 from "../../../assets/images/team/01.png";
import photo02 from "../../../assets/images/team/02.png";
import photo03 from "../../../assets/images/team/03.png";
import photo04 from "../../../assets/images/team/04.png";
import photo05 from "../../../assets/images/team/05.png";
import photo06 from "../../../assets/images/team/06.png";
import photo07 from "../../../assets/images/team/07.png";
import "./AboutTeam.css";

function AboutTeam() {
  const team = [
    {
      photo: photo01,
      name: "Wildon",
      career: "Founder",
    },
    {
      photo: photo02,
      name: "The Dean",
      career: "Founder",
    },
    {
      photo: photo05,
      name: "Alessandro",
      career: "Chief technical officer (CTO)",
    },
    {
      photo: photo04,
      name: "Michael",
      career: "Head of the Front-end Development Team",
    },
    {
      photo: photo06,
      name: "Alex",
      career: "Head of the Back-end Development Team",
    },
    {
      photo: photo07,
      name: "Sergio",
      career: "Head of Design",
    },
    {
      photo: photo03,
      name: "Lui",
      career: "Head of the Smart-contract Development Team",
    },
  ];

  return (
    <section className="about">
      <MetaTags>
        <title>About</title>
        <meta property="og:site_name" content={`Higgs Field`} />
        <meta property="og:title" content={`About`} />
        <meta property="twitter:title" content={`About`} />
        <meta property="vk:title" content={`About`} />
      </MetaTags>
      <h2 className="about__title">Welcome to Higgs Field!</h2>
      <div className="about__redirect-buttons">
        <Link className="about__redirect" to="/explore-collections">
          Explore marketplace
        </Link>
        <div className="about__redirect about__redirect_type_launchpad about__redirect_type_blocked">
          Apply for launchpad
        </div>
        {/* <Link className="about__redirect about__redirect_type_launchpad" to="/launch">
          Apply for launchpad
        </Link> */}
      </div>

      <ReactPlayer
        className="about__video"
        url="https://youtu.be/L8MItx-x628"
        controls={true}
      />

      <div className="about__team">
        <p className="about__heading">Team</p>
        <ul className="about__cards-list">
          {team.map((item, i) => (
            <li className="about__card" key={i}>
              <img className="about__photo" src={item.photo} alt={item.name} />
              <p className="about__name">{item.name}</p>
              <p className="about__career">{item.career}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="about__touch-box">
        <p className="about__heading">Get in touch</p>
        <div className="about__mail-box">
          <a
            className="about__send-mail"
            href="https://druhk0gh9fz.typeform.com/to/HXoES14C"
            target="_blank"
            rel="noreferrer"
          >
            
            <svg className="about__mail-icon" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="about__mail-icon-fill" d="M4 6C3.80222 6 3.60888 6.05865 3.44443 6.16853C3.27998 6.27841 3.15181 6.43459 3.07612 6.61732C3.00043 6.80004 2.98063 7.00111 3.01922 7.19509C3.0578 7.38907 3.15304 7.56725 3.29289 7.70711C3.43275 7.84696 3.61093 7.9422 3.80491 7.98079C3.99889 8.01937 4.19996 7.99957 4.38268 7.92388C4.56541 7.84819 4.72159 7.72002 4.83147 7.55557C4.94135 7.39112 5 7.19778 5 7C5 6.73478 4.89464 6.48043 4.70711 6.29289C4.51957 6.10536 4.26522 6 4 6ZM8 8H22C22.2652 8 22.5196 7.89464 22.7071 7.70711C22.8946 7.51957 23 7.26522 23 7C23 6.73478 22.8946 6.48043 22.7071 6.29289C22.5196 6.10536 22.2652 6 22 6H8C7.73478 6 7.48043 6.10536 7.29289 6.29289C7.10536 6.48043 7 6.73478 7 7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8ZM8 11C7.80222 11 7.60888 11.0586 7.44443 11.1685C7.27998 11.2784 7.15181 11.4346 7.07612 11.6173C7.00043 11.8 6.98063 12.0011 7.01922 12.1951C7.0578 12.3891 7.15304 12.5673 7.29289 12.7071C7.43275 12.847 7.61093 12.9422 7.80491 12.9808C7.99889 13.0194 8.19996 12.9996 8.38268 12.9239C8.56541 12.8482 8.72159 12.72 8.83147 12.5556C8.94135 12.3911 9 12.1978 9 12C9 11.7348 8.89464 11.4804 8.70711 11.2929C8.51957 11.1054 8.26522 11 8 11ZM12 16C11.8022 16 11.6089 16.0586 11.4444 16.1685C11.28 16.2784 11.1518 16.4346 11.0761 16.6173C11.0004 16.8 10.9806 17.0011 11.0192 17.1951C11.0578 17.3891 11.153 17.5673 11.2929 17.7071C11.4327 17.847 11.6109 17.9422 11.8049 17.9808C11.9989 18.0194 12.2 17.9996 12.3827 17.9239C12.5654 17.8482 12.7216 17.72 12.8315 17.5556C12.9414 17.3911 13 17.1978 13 17C13 16.7348 12.8946 16.4804 12.7071 16.2929C12.5196 16.1054 12.2652 16 12 16ZM22 11H12C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13H22C22.2652 13 22.5196 12.8946 22.7071 12.7071C22.8946 12.5196 23 12.2652 23 12C23 11.7348 22.8946 11.4804 22.7071 11.2929C22.5196 11.1054 22.2652 11 22 11ZM22 16H16C15.7348 16 15.4804 16.1054 15.2929 16.2929C15.1054 16.4804 15 16.7348 15 17C15 17.2652 15.1054 17.5196 15.2929 17.7071C15.4804 17.8946 15.7348 18 16 18H22C22.2652 18 22.5196 17.8946 22.7071 17.7071C22.8946 17.5196 23 17.2652 23 17C23 16.7348 22.8946 16.4804 22.7071 16.2929C22.5196 16.1054 22.2652 16 22 16Z" fill="white" />
            </svg>

            <p className="about__mail-title">Launched projects</p>
            <p className="about__mail-text">Apply for listing on the Higgs Field Marketplace </p>
          </a>

          <a
            className="about__send-mail"
            href="https://junglelaunchpad.io"
            target="_blank"
            rel="noreferrer"
          >
            
            <svg className="about__mail-icon" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="about__mail-icon-fill" d="M15.4616 15.95L16.7437 13.9072C19.6041 9.34966 19.2362 5.48377 18.957 4.06645C18.9274 3.91275 18.8255 3.77994 18.6798 3.70121C18.5333 3.62271 18.3576 3.60739 18.1971 3.65877C16.7099 4.13516 12.8435 5.75357 9.98046 10.3152L8.69803 12.3585L8.12839 12.3948C7.02998 12.4656 6.04083 13.034 5.48992 13.9118L3.95966 16.35C3.86903 16.4944 3.87187 16.6739 3.96707 16.8162C4.06316 16.9584 4.23626 17.0399 4.41746 17.0285L6.26199 16.9199C6.77971 16.8899 7.29554 17.0003 7.74507 17.239L8.72459 17.7593L7.98301 18.9408C7.84658 19.1582 7.92743 19.4358 8.16317 19.561L8.94746 19.9775C9.1832 20.1027 9.48493 20.0283 9.62136 19.811L10.3629 18.6294L11.3419 19.1493C11.7914 19.3881 12.1545 19.7431 12.3847 20.1724L13.2039 21.695C13.2837 21.8451 13.4471 21.9422 13.6289 21.9477C13.8105 21.9523 13.981 21.8648 14.0716 21.7204L15.6019 19.2822C16.1521 18.4055 16.1921 17.333 15.7108 16.4218L15.4616 15.95ZM14.089 10.9536C13.2755 10.5215 12.996 9.56365 13.4657 8.81528C13.9357 8.06638 14.9769 7.81062 15.7905 8.24269C16.6034 8.67447 16.8833 9.63183 16.4132 10.3807C15.9435 11.1291 14.902 11.3854 14.089 10.9536Z" fill="white" />
            </svg>

            <p className="about__mail-title">Projects in the development</p>
            <p className="about__mail-text">Apply for launching on the Jungle Launchpad</p>
          </a>
        </div>
        <div className="about__mail-box">
          <a
            className="about__send-mail"
            href="mailto:higgsfield.near@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              className="about__mail-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="about__mail-icon-fill"
                d="M24 4.99993V6.05617L11.9953 12.0328L0.000228449 6.1916V5.00004C0.00112132 4.20472 0.317422 3.44196 0.879955 2.87973C1.44247 2.31722 2.205 2.00091 3.00027 2H21C21.7953 2.00089 22.5578 2.31719 23.1203 2.87973C23.6828 3.44201 23.9991 4.20477 24 5.00004V4.99993ZM11.9993 14.0332C11.6923 14.0336 11.3896 13.9633 11.1144 13.8281L0 8.41593V19.0001C0.00089287 19.7954 0.317193 20.5582 0.879727 21.1204C1.44224 21.6829 2.20477 21.9992 3.00004 22.0001H20.9997C21.7951 21.9992 22.5576 21.6829 23.12 21.1204C23.6826 20.5581 23.9989 19.7953 23.9998 19.0001V8.29136L12.8882 13.8267C12.6116 13.9629 12.3074 14.0336 11.9991 14.0334L11.9993 14.0332Z"
                fill="white"
              />
            </svg>
            <p className="about__mail-title">Contact for any purpose</p>
            <p className="about__mail-text">higgsfield.near@gmail.com</p>
          </a>


        </div>
      </div>
    </section>
  );
}

export default AboutTeam;
