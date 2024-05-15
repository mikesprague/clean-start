import Tippy from '@tippyjs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import dompurify from 'dompurify';
import he from 'he';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import React, { useEffect } from 'react';

import { apiUrl, stripHTML } from '../modules/helpers';

import './Quote.scss';

const allQuotesDataAtom = atomWithStorage('quoteData', null);
const quoteDataAtom = atom(null);

export const Quote = () => {
  const [allQuotesData, setAllQuotesData] = useAtom(allQuotesDataAtom);
  const [quoteData, setQuoteData] = useAtom(quoteDataAtom);

  useEffect(() => {
    const loadQuoteData = async () => {
      const designQuoteData = await axios
        .get(`${apiUrl()}/quotes`)
        .then((response) => response.data);

      setAllQuotesData({
        lastUpdated: dayjs().toString(),
        data: designQuoteData,
      });
    };

    if (allQuotesData?.lastUpdated) {
      const nextUpdateTime = dayjs(allQuotesData.lastUpdated).add(
        120,
        'minute'
      );

      if (dayjs().isAfter(nextUpdateTime)) {
        loadQuoteData();
      }
    } else {
      loadQuoteData();
    }

    return () => {};
  }, [allQuotesData, setAllQuotesData]);

  useEffect(() => {
    if (allQuotesData?.data) {
      const randomNumber = Math.floor(
        Math.random() * (allQuotesData.data.length - 1)
      );
      let quote = allQuotesData.data[randomNumber];

      quote = {
        ...quote,
        quoteAuthor: stripHTML(
          he.decode(dompurify.sanitize(quote.quoteAuthor))
        ),
        quoteExcerpt: stripHTML(
          he.decode(dompurify.sanitize(quote.quoteExcerpt))
        ),
      };
      setQuoteData(quote);
    }

    return () => {};
  }, [allQuotesData, setQuoteData]);

  return quoteData ? (
    <div className="quote-container">
      <Tippy content="Quotes provided by ZenQuotes API" placement="bottom">
        <p className="px-4 visible">
          <a
            href="https://zenquotes.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {quoteData.quoteExcerpt}
            <br />
            <em>&mdash; {quoteData.quoteAuthor}</em>
          </a>
        </p>
      </Tippy>
    </div>
  ) : (
    ''
  );
};

export default Quote;
