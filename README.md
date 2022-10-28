# Clean Start

Open source new tab extension

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=268856900)

## About

- Layout/design based on what I liked from the Momentum browser extension
- Date and time with greeting
- Current temp/conditions (from [OpenWeatherMap](https://openweathermap.org/api))
  - uses location data from network the incoming request is made on (location is sometimes unavailable or inaccurate)
- Random quote (from [Quotes on Design API](https://quotesondesign.com/api/))
- Random background image (from [Unsplash API](https://unsplash.com/developers/))
- Top posts from some useful sites
  - [GitHub Trending Repositories](https://www.github.com/trending/)
  - [DEV Community Recent Posts](https://dev.to/)
  - [Hacker News Top Posts](https://news.ycombinator.com/)
  - [Product Hunt Top Posts](https://producthunt.com/)
  - [Reddit Popular Posts](https://www.reddit.com/r/popular)

## Demo

Demo available as a progressive web app (PWA):

- [https://cleanstart.page](https://cleanstart.page)

<!-- ## Screenshots

![Clean Start Screenshot One](./screenshot-1.png "Clean Start Screenshot One")
![Clean Start Screenshot Two](./screenshot-2.png "Clean Start Screenshot Two")
![Clean Start Screenshot Three](./screenshot-3.png "Clean Start Screenshot Three")
![Clean Start Screenshot Four](./screenshot-4.png "Clean Start Screenshot Four")
![Clean Start Screenshot Five](./screenshot-5.png "Clean Start Screenshot Five")
![Clean Start Screenshot Six](./screenshot-6.png "Clean Start Screenshot Six") -->

## Install

- Chrome Store: [https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol](https://chrome.google.com/webstore/detail/mmnlbcjgkfloemcbbjhklbblhbcjhmol)

## Build

- Install dependencies `npm install`
- Build extension `npm run build:extension`
  - This will create a `build` folder with the extension files and a `clean-start-extension.zip` file (used for submission to Chrome Store)

### Local Development

- Run/develop locally `npm start`

### API Keys

NOTE: You will need API keys from OpenWeatherMap and Unsplash to build and run the serverless functions used as API endpoints for this extension. You can
get API keys for both services for FREE (links below)

OpenWeatherMap

- Developer page <https://openweathermap.org/api>
- Sign up for FREE <https://home.openweathermap.org/users/sign_up>

Unsplash

- Developer page <https://unsplash.com/developers>
- Sign up for FREE <https://unsplash.com/oauth/applications>

Once you have the API keys, make sure to set environment variables for each using the following names:

- `UNSPLASH_ACCESS_KEY`
- `UNSPLASH_SECRET_KEY`
- `OPEN_WEATHERMAP_API_KEY`

For local development, create a file in the root directory of this project named `.dev.vars` with the same format as a typical `.env` file:

```bash
UNSPLASH_ACCESS_KEY="xxxxxx"
UNSPLASH_SECRET_KEY="xxxxxx"
OPEN_WEATHERMAP_API_KEY="xxxxxx"
```

NOTE: for GH Codespaces development, you will need to set the env vars as Actions Secrets in the settings for your forked repo

## Uses

- PWA Hosting and Serverless Functions for API - [CloudFlare Pages](https://pages.cloudflare.com/)
- Builds - [Vite](https://vitejs.dev/)
- JavaScript Library - [React](https://reactjs.org/)
- Icons - [FontAwesome](https://fontawesome.com/)
- Font [Roboto Slab via Google Fonts](https://fonts.google.com/specimen/Roboto+Slab?query=roboto+slab)
- Tooltips and content popups - [tippy.js](https://github.com/atomiks/tippyjs)
- Date/time lib - [dayjs](https://github.com/iamkun/dayjs)
- CSS framework - [Tailwind CSS](https://tailwindcss.com/)
- HTTP lib/client - [axios](https://github.com/axios/axios/)

## License

MIT License

Copyright (c) 2022 Michael Sprague

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
