const axios = require("axios");
const fs = require("fs");
const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: false, // Convert '\n' in paragraphs into <br>
});

const TIMEZONE_OFFSET = 7;
const QUOTES_API = "https://zenquotes.io/api/quotes";

(async () => {
  const { today, hour } = getCurrentTime();
  const greetings = generateGreetings(hour);
  const { quote, author } = await getQuotes(hour);

  const text = `### ${greetings}
    ## Hello, my name is Adhi Ardiansyah 👋

    - 💻 I'm interested in software development.
    - ✉️ Contact me on adhiardiansyah23@gmail.com!

    ### Quote of the day:
    *"${quote}"* <br>
    — ${author}
    
    ### Connect with me:
    
    [<img align="left" alt="adhiardiansyah" width="22px" src="https://raw.githubusercontent.com/iconic/open-iconic/master/svg/globe.svg" />][website]
    [<img align="left" alt="Adhi Ardiansyah | LinkedIn" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg" />][linkedin]
    [<img align="left" alt="Adhi Ardiansyah | Instagram" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg" />][instagram]
    [<img align="left" alt="Adhi Ardiansyah | YouTube" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/youtube.svg" />][youtube]
    [<img align="left" alt="Adhi Ardiansyah | Twitter" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg" />][twitter]
    
    <br />
    
    ### Languages and Technologies:
    
    ![HTML](https://img.shields.io/badge/html5%20-%23E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/css3%20-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white) ![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)
    
    ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
    
    ![CodeIgnier](https://img.shields.io/badge/-CodeIgniter-black?style=for-the-badge&logo=codeigniter) ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
    
    ![Bootstrap](https://img.shields.io/badge/bootstrap%20-%23563D7C.svg?&style=for-the-badge&logo=bootstrap&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
    
    ![MySQL](https://img.shields.io/badge/mysql-00758f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![DynamoDB](https://img.shields.io/badge/dynamodb-%233498DB.svg?style=for-the-badge&logo=amazon-dynamodb&logoColor=white) ![Elascticsearch](https://img.shields.io/badge/elasticsearch-%23005571.svg?style=for-the-badge&logo=elasticsearch&logoColor=white)

    ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2291E6?style=for-the-badge&logo=docker&logoColor=white) ![Google Pub/Sub](https://img.shields.io/badge/google%20pub/sub%20-%23007ACC.svg?style=for-the-badge&logo=googlepubsub&logoColor=white)
    
    ---
    
    <p align="center"><img align="center" src="https://github-readme-stats.vercel.app/api/top-langs?username=adhiardiansyah&show_icons=true&locale=en&layout=compact" alt="adhiardiansyah" /></p>
    
    <p align="center">&nbsp;<img align="center" src="https://github-readme-stats.vercel.app/api?username=adhiardiansyah&show_icons=true&locale=en" alt="adhiardiansyah" /></p>
    
    <p align="center"><img align="center" src="https://github-readme-streak-stats.herokuapp.com/?user=adhiardiansyah&" alt="adhiardiansyah" /></p>
    
    [website]: https://adhiardiansyah.github.io
    [twitter]: https://twitter.com/adhiardiansyah_
    [youtube]: https://www.youtube.com/@adhiardiansyah
    [instagram]: https://instagram.com/adhi_ardiansyah
    [linkedin]: https://linkedin.com/in/adhiardiansyah
  `;

  const content = md.renderInline(text);
  generateFile(content);

  /* Timestamp */
  console.log(`⏳ Running at ${today} UTC +0${TIMEZONE_OFFSET}:00`);
})();

function getCurrentTime() {
  const today = new Date();
  today.setHours(today.getHours() + TIMEZONE_OFFSET);
  const hour = today.getHours();
  const minute = today.getMinutes();
  // check if the hour >= 24
  if (hour >= 24) {
    return Math.abs(24 - hour);
  }
  return {
    today,
    hour,
    minute
  };
}

function isWeekend(date = getCurrentTime().today) {
  return date.getDay() === 6 || date.getDay() === 0;
}

function generateGreetings(time) {
  const goodMorning = "Good morning ☀️";
  const goodAfternoon = "Good afternoon 👋";
  const goodEvening = "Good evening ☕";
  const goodNight = "Good night 😴";
  const happyWeekend = "Happy weekend 🏝️";

  if (isWeekend()) {
    return happyWeekend;
  }
  if (time >= 4 && time < 11) {
    return goodMorning;
  }
  if (time >= 11 && time < 16) {
    return goodAfternoon;
  }
  if (time >= 16 && time < 23) {
    return goodEvening;
  }
  return goodNight;
}

async function getQuotes(time) {
  if (isWeekend()) {
    return {
      quote:
        "Weekends are sacred for me. They're the perfect time to relax and spend time with family and friends.",
      author: "Marcus Samuelsson",
    };
  }
  if (time >= 4 && time < 8) {
    return {
      quote: "Every morning is a new arrival.",
      author: "Rumi",
    };
  }
  if (time >= 8 && time < 11) {
    return {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    };
  }
  if (time >= 11 && time < 13) {
    return {
      quote: "The key to productivity is balance. Don't skip your lunch break!",
      author: "Unknown",
    };
  }
  if (time >= 13 && time < 18) {
    return await axios.get(QUOTES_API).then((response) => {
      if (response.data.length === 0) {
        return {
          quote: "There is no result without struggle, there is no struggle without sacrifice.",
          author: "Adhi",
        };
      }
      const { q, a } = response.data[0];
      return {
        quote: q,
        author: a,
      };
    });
  }
  if (time >= 18 && time < 20) {
    return {
      quote:
        "After a day of hard work, reward yourself with moments of peace and joy. You deserve it.",
      author: "Unknown",
    };
  }
  if (time >= 20 && time < 23) {
    return {
      quote: "Resting today prepares you for a better tomorrow.",
      author: "Unknown",
    };
  }
  return {
    quote: "Sleep well, always say thanks for yourself.",
    author: "Adhi",
  };
}

function generateFile(contents) {
  const targetFile = "README.md";
  fs.writeFile(targetFile, contents, function (err) {
    if (err) return console.log(`⛔ [FAILED]: ${err}`);
    console.log("✅ [SUCCESS]: README.md has been generated.");
  });
}
