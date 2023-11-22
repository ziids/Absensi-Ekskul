import React from "react";

const Index = () => {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="flex flex-wrap items-center justify-between px-2 py-3 bg-[#3A56E7] fixed w-full z-50">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              href="#pablo"
            >
              WEB ABSENSI
            </a>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="icon ion-md-menu"></i>
            </button>
          </div>
          <div
            className={`lg:flex flex-grow items-center ${(navbarOpen ? "flex" : "hidden" ) }`}
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto md:w-auto w-full">
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75 w-full"
                  href="#home"
                >
                  <span className="ml-2">HOME</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75 w-full"
                  href="#about"
                >
                  <span className="ml-2">ABOUT</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75 w-full"
                  href="#contact"
                >
                  <span className="ml-2">CONTACT</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="bg-[url('./assets/jumbotron.png')] bg-no-repeat bg-cover h-screen w-full flex justify-center md:items-start items-center flex-col text-white" id="home">
        <div className="text-4xl font-bold py-2 px-0 md:px-16">
          <h3>WEB ABSENSI</h3>
        </div>
        <div className="text-2xl py-4 px-16 text-center">
          <p>" Modernisasi dalam bidang pendidikan "</p>
        </div>
        <div className="py-4 text-xl px-16">
          <a className="bg-[#3A56E7] py-2 px-4 rounded-lg mr-1" href="/signin">SIGN IN</a>
          <a className="bg-[#3A56E7] py-2 px-4 rounded-lg ml-1" href="/signup">SIGN UP</a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-screen justify-center items-center" id="about">
        <div className="flex flex-1 justify-end md:justify-center items-center">
          <img className="w-[400px] md:w-[500px]" src="/assets/about.svg" alt="about" />
        </div>
        
        <div className="flex flex-1 justify-start md:justify-center flex-col px-10">
          <div className="my-5">
            <h3 className="text-2xl font-bold text-[#3A56E7]">ABOUT</h3>
            <div className="w-[60px] h-[4px] bg-[#3A56E7] rounded-lg"></div>
          </div>
          <div>
            <p className="text-justify text-lg text-[#9498AD]">Web Absensi bertujuan untuk membantu staf pengelola kegiatan ekstrakurikuler dalam mengelola data kehadiran peserta, menghasilkan laporan, dan memonitor perkembangan peserta di berbagai kegiatan ekstrakurikuler.</p>
          </div>
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#EFEFEF" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,192C672,192,768,224,864,218.7C960,213,1056,171,1152,144C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      <div className="bg-[#EFEFEF] h-screen flex justify-center flex-col" id="contact">
        <div className="flex justify-center items-center flex-col py-16">
          <h3 className="text-2xl font-bold text-[#3A56E7]">CONTACT</h3>
          <div className="w-[60px] h-[4px] bg-[#3A56E7] rounded-lg"></div>
        </div>

        <div className="flex justify-start md:justify-evenly flex-col md:flex-row px-4">
          <div className="flex py-4">
            <div className="bg-[#D9D9D9] p-6 rounded-full">
              <img className="w-[50px] md:w-[80px]" src="/assets/github.svg" alt="github" />
            </div>
            <div className="flex flex-col justify-center px-4">
              <h3 className="text-2xl font-bold text-[#3A56E7]">GITHUB</h3>
              <a className="text-lg text-[#9498AD]" href="https://github.com/DrelezTM/WebAbsensi">DrelezTM/WebAbsensi</a>
            </div>
          </div>

          <div className="flex py-4">
            <div className="bg-[#D9D9D9] p-6 rounded-full">
              <img className="w-[50px] md:w-[80px]" src="/assets/email.svg" alt="email" />
            </div>
            <div className="flex flex-col justify-center px-4 overflow-auto">
              <h3 className="text-2xl font-bold text-[#3A56E7]">EMAIL</h3>
              <a className="text-lg text-[#9498AD]" href="mailto:my.absensiekskul@gmail.com">my.absensiekskul@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col py-16">
          <div>
            <h3 className="text-2xl font-bold text-[#3A56E7]">THANKS TO</h3>
          </div>
          <div className="flex flex-col justify-center items-center">
            <a className="text-lg text-[#9498AD]" href="https://storyset.com/web">https://storyset.com/web</a>
            <a className="text-lg text-[#9498AD]" href="https://ionic.io/ionicons">https://ionic.io/ionicons</a>
          </div>
        </div>
      </div>

      <div className="bg-[#3A56E7] p-10 text-center">
        <h3 className="text-xl text-white">WEB ABSENSI © 2023</h3>
      </div>
    </>
  );
}

export default Index;