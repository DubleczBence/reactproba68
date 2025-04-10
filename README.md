<div id="top">

<!-- HEADER STÍLUS: KLASSZIKUS -->
<div align="center">

# OPTIFY_LOCALHOST

<em>Emeld magasabb szintre a kérdőíveid – egyszerűen, hatékonyan!</em>

<!-- JELVÉNYEK -->
<img src="https://img.shields.io/github/license/DubleczBence/optify_localhost?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
<img src="https://img.shields.io/github/last-commit/DubleczBence/optify_localhost?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/DubleczBence/optify_localhost?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/DubleczBence/optify_localhost?style=flat&color=0080ff" alt="repo-language-count">

<em>Felépítve az alábbi technológiákkal:</em>

<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/Firebase-DD2C00.svg?style=flat&logo=Firebase&logoColor=white" alt="Firebase">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<br>
<img src="https://img.shields.io/badge/MySQL-4479A1.svg?style=flat&logo=MySQL&logoColor=white" alt="MySQL">
<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/CSS-663399.svg?style=flat&logo=CSS&logoColor=white" alt="CSS">
<img src="https://img.shields.io/badge/datefns-770C56.svg?style=flat&logo=date-fns&logoColor=white" alt="datefns">
<img src="https://img.shields.io/badge/Chart.js-FF6384.svg?style=flat&logo=chartdotjs&logoColor=white" alt="Chart.js">
<img src="https://img.shields.io/badge/Jest-C21325.svg?style=flat&logo=Jest&logoColor=white" alt="Jest">
</div>

<br>

<div align="center">
<img src="https://raw.githubusercontent.com/DubleczBence/optify_localhost/main/src/kepek/optify-dark.png" alt="Optify logó" width="200">
</div>

---

## Tartalomjegyzék

- [Áttekintés](#áttekintés)
-  [Funkciók](#funkciók)
- [Első lépések](#első-lépések)
    - [Előfeltételek](#előfeltételek)
    - [Telepítés](#telepítés)
    - [Használat](#használat)
    - [Tesztelés](#tesztelés)


---

## Áttekintés

Az <strong>optify_localhost</strong> egy kérdőívkészítő alkalmazás cégek és egyéni felhasználók számára. Lehetővé teszi kérdőívek gyors és egyszerű létrehozását, a célközönség szűrését, valamint a válaszok részletes elemzését a statisztika oldalon.

**Miért válaszd az optify_localhost-ot?**

A főbb jellemzők:

- 🎛️ **Helyi adatbázis telepítés:** Gyors beállítás minimális konfigurációval.
- 🚀 **React alapú felépítés:** Jól strukturált architektúra a hatékony fejlesztéshez.
- 📊 **Valós idejű adatkezelés:** Dinamikus vizualizációk és reszponzív elemek.
- 🔐 **Felhasználókezelés:** Biztonságos regisztráció és bejelentkezés.
- 🎨 **Testreszabható felület:** Felhasználóbarát, modern dizájn.
- 🔗 **Stabil API-kapcsolat:** Megbízható kommunikáció a frontend és backend között.

🔗 **Élő demó:** [optify-survey.vercel.app](https://optify-survey.vercel.app)  
🔗 **Frontend kód (React):** [GitHub - optify_localhost](https://github.com/DubleczBence/optify_localhost)  
🔗 **Backend indítása:** [`cd backend && node app.js`](https://github.com/DubleczBence/optify_localhost/tree/main/backend)  
🔗 **Webes változat külön repo-ban:** [GitHub - optify](https://github.com/DubleczBence/optify)  
📄 <strong>Dokumentáció (PDF):</strong> <a href="https://github.com/DubleczBence/optify_localhost/blob/main/optify_dokumentacio.pdf" target="_blank">Letöltés innen</a>

---

## Funkciók

|      | Komponens        | Leírás                                |
| :--- | :--------------- | :------------------------------------- |
| ⚙️  | **Architektúra**   | <ul><li>Mikroszolgáltatásos architektúra</li><li>Frontend (React), Backend (Node.js)</li><li>RESTful API</li></ul> |
| 🔩 | **Kódszabvány**     | <ul><li>ESLint a linteléshez</li><li>Prettier a formázáshoz</li><li>Konzisztens kódstílus</li></ul> |
| 🔌 | **Integrációk**     | <ul><li>MySQL az adatbáziskezeléshez</li><li>Chart.js és MUI az adatmegjelenítéshez</li></ul> |
| 🧩 | **Modularitás**     | <ul><li>Frontend és backend elkülönítve</li><li>Újrahasználható React komponensek</li><li>Moduláris route-ok és controllerek</li></ul> |
| 🧪 | **Tesztelés**       | <ul><li>Jest az egységtesztekhez</li><li>Supertest az integrációs tesztekhez</li><li>Selenium WebDriver az E2E tesztekhez</li></ul> |
| ⚡️  | **Teljesítmény**   | <ul><li>React.memo a teljesítményoptimalizáláshoz</li><li>Hatékony SQL lekérdezések</li><li>Lazy loading</li></ul> |
| 🛡️ | **Biztonság**      | <ul><li>JWT alapú azonosítás</li><li>express-validator a bemeneti adatok ellenőrzésére</li><li>Környezeti változók a titkos adatokhoz</li></ul> |
| 📦 | **Függőségek**     | <ul><li>React, React Router, MUI</li><li>Express, MySQL, bcrypt</li><li>Jest, Testing Library</li></ul> |
| 🚀 | **Skálázhatóság**   | <ul><li>Docker konténerizáció</li><li>Mikroszolgáltatások független skálázása</li><li>Load balancing lehetőség</li></ul> |

---

<!-- TELEPÍTÉS -->

<h2>Első lépések</h2>

<h3>Előfeltételek</h3>
<p>A projekt futtatásához az alábbiak szükségesek:</p>
<ul>
  <li><strong>Programozási nyelv:</strong> JavaScript</li>
  <li><strong>Csomagkezelő:</strong> Npm</li>
  <li><strong>Konténer runtime:</strong> Docker (opcionális)</li>
</ul>

<h3>Telepítés</h3>
<ol>
  <li><strong>Repo klónozása:</strong>
    <pre><code>❯ git clone https://github.com/DubleczBence/optify_localhost</code></pre>
  </li>
  <li><strong>Lépj be a mappába:</strong>
    <pre><code>❯ cd optify_localhost</code></pre>
  </li>
  <li><strong>Telepítsd a függőségeket:</strong>
    <pre><code>❯ npm install</code></pre>
  </li>
  <li>
      <p><strong> Az adatbázis beállítása:</strong> A projekt használatához szükséges egy működő MySQL adatbázis, amelyet a <code>XAMPP</code> segítségével indíthatsz el. A csomag tartalmaz egy <code>survey_app_local.sql</code> fájlt, amely az adatbázis sémáját tartalmazza. Ezt a következőképpen tudod importálni:</p>
    <ul>
      <li>Indítsd el a <strong>MySQL modult</strong> a XAMPP kezelőfelületen.</li>
      <li>Nyisd meg a <strong>phpMyAdmin</strong>-t a böngészőben (általában <code>http://localhost/phpmyadmin</code>).</li>
      <li>Hozz létre egy új adatbázist például <code>survey_app_local</code> néven.</li>
      <li>Importáld a <code>survey_app_local.sql</code> fájlt a létrehozott adatbázisba.</li>
    </ul>
    <p>Az alkalmazás automatikusan ehhez az adatbázishoz csatlakozik a <code>backend/config/db.js</code> fájlban definiált kapcsolati beállításokon keresztül.</p>
  </li>
  <li><strong>Indítsd el a szervert:</strong>
    <pre><code>❯ cd backend</code></pre>
    <pre><code>❯ node app.js</code></pre>
  </li>
</ol>

<h3>Használat</h3>
<ol>
  <li>Nyisd meg a frontendet: <a href="http://localhost:3000">http://localhost:3000</a></li>
  <li>Kérdőív készítése, kitöltése, beküldése</li>
  <li><strong>Admin oldalra való belépés:</strong>
     ⚙️ Email: <strong>admin@admin.com</strong>
     ⚙️ Jelszó: <strong>admin</strong></li>
  <li>Eredmények ellenőrzése a Statisztika oldalon</li>
</ol>

<h3>Tesztelés</h3>
<p>A következő parancsal tudod futtatni a teszteket:</p>
<ul>
  <li><strong>Frontend és Backend:</strong>
    <pre><code>❯ npm test</code></pre>
  </li>
</ul>

<hr>

<!-- KÉPERNYŐKÉPEK -->

<h2>Képernyőképek</h2>

<img src="https://raw.githubusercontent.com/DubleczBence/optify_localhost/main/screenshots/company-survey-after-login.png" alt="Céges felület" width="600"><br><br>
<img src="https://raw.githubusercontent.com/DubleczBence/optify_localhost/main/screenshots/company-survey-create-survey-page.png" alt="Kérdőív létrehozása" width="600">

<hr>

<!-- KÖZREMŰKÖDŐK -->

<h2>Készítette:</h2>
<ul>
  <li> <strong>Jakab Áron</strong>, <strong>Dublecz Bence</strong> </li>
</ul>

<hr>

<div align="left"><a href="#top">⬆ Return</a></div>
