import { Anchor, Container, Text, Tooltip } from '@mantine/core';
import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dompurify from 'dompurify';
import he from 'he';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import React, { useEffect } from 'react';

import { apiUrl, stripHTML } from '../modules/helpers';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

interface QuoteData {
  quoteAuthor: string;
  quoteExcerpt: string;
}

const allQuotesDataAtom = atomWithStorage('quoteData', {
  lastUpdated: '',
  data: [] as QuoteData[],
});
const quoteDataAtom = atom({} as QuoteData);

export const Quote = () => {
  const [allQuotesData, setAllQuotesData] = useAtom(allQuotesDataAtom);
  const [quoteData, setQuoteData] = useAtom(quoteDataAtom);

  useEffect(() => {
    const loadQuoteData = async () => {
      const designQuoteData: QuoteData[] = await axios
        .get(`${apiUrl()}/quotes`)
        .then((response) => response.data);

      setAllQuotesData({
        lastUpdated: dayjs().tz('America/New_York').toISOString(),
        data: designQuoteData,
      });
    };

    if (allQuotesData?.lastUpdated) {
      const nextUpdateTime = dayjs(allQuotesData.lastUpdated).add(
        120,
        'minute'
      );

      if (dayjs().tz('America/New_York').isAfter(nextUpdateTime)) {
        loadQuoteData();
      }
    } else {
      loadQuoteData();
    }
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
          he.decode(dompurify.sanitize(quote?.quoteAuthor))
        ),
        quoteExcerpt: stripHTML(
          he.decode(dompurify.sanitize(quote?.quoteExcerpt))
        ),
      };
      setQuoteData(quote);
    }
  }, [allQuotesData, setQuoteData]);

  return quoteData ? (
    <Container fluid mt="xl">
      <Tooltip label="Quotes provided by ZenQuotes API" position="bottom">
        <Text lh={1.5} size="1.125rem" ta="center">
          <Anchor
            c="white"
            href="https://zenquotes.io/"
            ta="center"
            target="_blank"
            rel="noopener noreferrer"
          >
            {quoteData.quoteExcerpt}
            <br />
            <em>&mdash; {quoteData.quoteAuthor}</em>
          </Anchor>
        </Text>
      </Tooltip>
    </Container>
  ) : (
    ''
  );
};

export default Quote;
