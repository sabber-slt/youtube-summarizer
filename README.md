```
 Youtube Summarizer Bot 🤖
```

![Home / Landing Page](/screens/Home.png)

This Telegram bot designed to simplify the process of extracting YouTube video URLs shared by users within the Telegram messaging platform. Whether you're a content creator, a video enthusiast, or just looking to share and organize your favorite YouTube videos, our bot is here to streamline the process.
In addition to extracting YouTube URLs, this bot is powered by the OpenAI Language Model, enabling it to provide real-time summaries of the shared video content. This feature allows users to quickly grasp the essence of the video before deciding to watch it.

### How to install ?

- In order to use it, you must first acquire an API key from the OpenAI website. [OpenAI API](https://openai.com/)
- Second acquire telegram token from the BOTFATHER. [Telegram token](https://telegram.me/BotFather)
- To run youtube-dl, you should have Python 3.7 or a higher version installed.

```bash
# Clone the repo.
git clone https://github.com/sabber-slt/youtube-summarizer.git;

# Goto the cloned project folder.
cd youtube-summarizer;
```

- Edit the DotEnv file using an editor of your choice and place your keys there.

```bash
# Without Docker
yarn ;

yarn dev
```

# Global Requisites

- node (>= 16)
- python (>= 3.7)
- typescript (>= 3.0.1)
