import { List, MantineProvider } from '@mantine/core';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeAll, describe, expect, it } from 'vitest';

import {
  handleGitHub,
  handleReddit,
  renderListItems,
} from './content-popup.tsx';
import { initIcons } from './helpers.ts';

beforeAll(() => {
  initIcons();
});

describe('content-popup renderers (characterization)', () => {
  it('handleReddit renders title, permalink and author', () => {
    const html = renderToStaticMarkup(
      <MantineProvider>
        <List>
          {handleReddit([
            { title: 'T', permalink: '/r/x', subreddit: 'x', author: 'a' },
          ])}
        </List>
      </MantineProvider>
    );

    expect(html).toContain('T');
    expect(html).toContain('/r/x');
    expect(html).toContain('a');
  });

  it('renderListItems renders title and link for productHunt', () => {
    const html = renderToStaticMarkup(
      <MantineProvider>
        <List>
          {renderListItems(
            [{ title: 'T', link: 'https://e', pubDate: '2026-01-01' }],
            'productHunt'
          )}
        </List>
      </MantineProvider>
    );

    expect(html).toContain('T');
    expect(html).toContain('https://e');
  });

  it('renderListItems renders title and link for hackerNews', () => {
    const html = renderToStaticMarkup(
      <MantineProvider>
        <List>
          {renderListItems(
            [{ title: 'T', link: 'https://e', pubDate: '2026-01-01' }],
            'hackerNews'
          )}
        </List>
      </MantineProvider>
    );

    expect(html).toContain('T');
    expect(html).toContain('https://e');
  });

  it('renderListItems renders title and author for devTo', () => {
    const html = renderToStaticMarkup(
      <MantineProvider>
        <List>
          {renderListItems(
            [
              {
                title: 'T',
                link: 'https://e',
                author: 'a',
                pubDate: '2026-01-01',
              },
            ],
            'devTo'
          )}
        </List>
      </MantineProvider>
    );

    expect(html).toContain('T');
    expect(html).toContain('a');
  });

  it('handleGitHub renders repo details', () => {
    const html = renderToStaticMarkup(
      <MantineProvider>
        <List>
          {handleGitHub([
            {
              title: 'T',
              description: 'd',
              stars: '10',
              starsLink: 's',
              forks: '2',
              forksLink: 'f',
              starsToday: '3',
              languageName: 'TS',
              languageStyle: 'background-color: #000',
              link: 'https://e',
            },
          ])}
        </List>
      </MantineProvider>
    );

    expect(html).toContain('T');
    expect(html).toContain('d');
    expect(html).toContain('10');
    expect(html).toContain('2');
    expect(html).toContain('3');
  });
});
