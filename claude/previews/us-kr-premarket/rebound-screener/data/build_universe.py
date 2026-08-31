# -*- coding: utf-8 -*-
"""검색 대상 유니버스 구성종목 리스트 수집 (2026-08-31 현재 기준)
  - NASDAQ-100 : en.wikipedia.org/wiki/List_of_NASDAQ-100_companies
  - KOSPI 200  : finance.naver.com/sise/entryJongmok.naver (20 pages x 10)
※ 과거 시점별 편입이력이 아니라 '현재' 구성이다 -> 생존편향 있음(박사 승인).
"""
import json, time, sys, io
import requests
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch_ndx():
    url = 'https://en.wikipedia.org/wiki/List_of_NASDAQ-100_companies'
    r = requests.get(url, headers=H, timeout=30); r.raise_for_status()
    tb = BeautifulSoup(r.text, 'html.parser').find('table', {'class': 'wikitable'})
    out = []
    for tr in tb.find_all('tr')[1:]:
        td = [x.get_text(strip=True) for x in tr.find_all(['td', 'th'])]
        if len(td) >= 2 and td[0]:
            out.append({'ticker': td[0].replace('\u200b', ''), 'name': td[1], 'market': 'NASDAQ100'})
    return out, url

def fetch_kospi200():
    base = 'https://finance.naver.com/sise/entryJongmok.naver?&page={}'
    out, seen = [], set()
    for p in range(1, 22):
        r = requests.get(base.format(p), headers=H, timeout=30); r.raise_for_status()
        r.encoding = 'euc-kr'
        soup = BeautifulSoup(r.text, 'html.parser')
        rows = 0
        for a in soup.select('a[href*="code="]'):
            code = a['href'].split('code=')[-1][:6]
            nm = a.get_text(strip=True)
            if len(code) == 6 and code.isalnum() and code not in seen and nm:
                seen.add(code); rows += 1
                out.append({'ticker': code, 'name': nm, 'market': 'KOSPI200'})
        if rows == 0:
            break
        time.sleep(0.25)
    return out, base.format('1..21')

if __name__ == '__main__':
    ndx, ndx_src = fetch_ndx()
    kos, kos_src = fetch_kospi200()
    data = {'asof': '2026-08-31',
            'sources': {'NASDAQ100': ndx_src, 'KOSPI200': kos_src},
            'NASDAQ100': ndx, 'KOSPI200': kos}
    with open('screen/universe.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('NASDAQ100:', len(ndx), '| KOSPI200:', len(kos))
    print('ndx head:', [x['ticker'] for x in ndx[:8]])
    print('kos head:', [(x['ticker'], x['name']) for x in kos[:5]])
