# -*- coding: utf-8 -*-
"""결과 집계: 출력형식 A/B/C 산출 + CSV 덤프."""
import os, sys, json, csv
import numpy as np

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

BASE = os.path.dirname(os.path.abspath(__file__))
RES = json.load(open(os.path.join(BASE, 'out', 'results.json'), encoding='utf-8'))
UNI = json.load(open(os.path.join(BASE, 'universe.json'), encoding='utf-8'))
ORDER = UNI['NASDAQ100'] + UNI['KOSPI200']


def stats(vals):
    v = [x for x in vals if x is not None]
    if not v:
        return dict(n=0, win=None, mean=None, med=None)
    a = np.array(v, dtype=float)
    return dict(n=len(a), win=float((a > 0).mean() * 100),
                mean=float(a.mean()), med=float(np.median(a)))


def main():
    rows = []          # 형식 A
    counts = []        # 형식 B
    for it in ORDER:
        r = RES[it['market'] + ':' + it['ticker']]
        counts.append(r)
        for s in r['signals']:
            rows.append(dict(market=r['market'], ticker=r['ticker'], name=r['name'], **s))
    rows.sort(key=lambda x: (x['date'], x['market'], x['ticker']))

    # ---- CSV 덤프
    with open(os.path.join(BASE, 'out', 'A_signals.csv'), 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(['시장', '종목명', '티커', '신호일', '종가', 'RSI', '거래량배수',
                    '20일후종가', '20일수익률%', '60일후종가', '60일수익률%',
                    '신호후최저가', '최대낙폭%', '-8%손절터치', '전방봉수'])
        for x in rows:
            w.writerow([x['market'], x['name'], x['ticker'], x['date'],
                        round(x['close'], 2), x['rsi'], x['volx'],
                        '' if x['c20'] is None else round(x['c20'], 2),
                        '' if x['r20'] is None else round(x['r20'], 2),
                        '' if x['c60'] is None else round(x['c60'], 2),
                        '' if x['r60'] is None else round(x['r60'], 2),
                        '' if x['min_low'] is None else round(x['min_low'], 2),
                        '' if x['mdd'] is None else round(x['mdd'], 2),
                        '' if x['stop8'] is None else ('터치' if x['stop8'] else '미터치'),
                        x['fwd_bars']])
    with open(os.path.join(BASE, 'out', 'B_counts.csv'), 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(['시장', '종목명', '티커', '신호개수', '상태', '봉수', '정지봉제거', '비고'])
        for r in counts:
            w.writerow([r['market'], r['name'], r['ticker'],
                        '판정불가' if r['count'] is None else r['count'],
                        r['status'], r['bars'], r.get('halt_rows', 0), r['note']])

    # ---- 형식 C
    out = {}
    for scope in ('ALL', 'NASDAQ100', 'KOSPI200'):
        cs = [r for r in counts if scope == 'ALL' or r['market'] == scope]
        rs = [x for x in rows if scope == 'ALL' or x['market'] == scope]
        judged = [r for r in cs if r['count'] is not None]
        zero = [r for r in judged if r['count'] == 0]
        # 손절: 전방 60봉 완전한 건 + 이미 터치한 건(부분이어도 확정)
        full = [x for x in rs if x['fwd_bars'] >= 60]
        part_touch = [x for x in rs if x['fwd_bars'] < 60 and x['stop8']]
        part_open = [x for x in rs if x['fwd_bars'] < 60 and not x['stop8']]
        n_touch = len([x for x in full if x['stop8']]) + len(part_touch)
        n_res = len(full) + len(part_touch)
        out[scope] = dict(
            universe=len(cs), judged=len(judged), unjudged=len(cs) - len(judged),
            signals=len(rs),
            per_stock=(len(rs) / len(judged)) if judged else None,
            zero=len(zero), zero_pct=(len(zero) / len(judged) * 100) if judged else None,
            r20=stats([x['r20'] for x in rs]), r60=stats([x['r60'] for x in rs]),
            stop_touch=n_touch, stop_resolved=n_res,
            stop_pct=(n_touch / n_res * 100) if n_res else None,
            stop_open=len(part_open),
            mdd=stats([x['mdd'] for x in full]),
        )

    def p(v, f='%.2f'):
        return '조회 불가' if v is None else (f % v)

    for scope in ('ALL', 'NASDAQ100', 'KOSPI200'):
        o = out[scope]
        print('===== [%s] =====' % scope)
        print(' 검색 종목 %d (판정 %d / 판정불가 %d) | 총 신호 %d건 | 종목당 평균 %s건'
              % (o['universe'], o['judged'], o['unjudged'], o['signals'], p(o['per_stock'])))
        print(' 신호 0개 종목: %d개 (%s%%)' % (o['zero'], p(o['zero_pct'], '%.1f')))
        for k, lab in (('r20', '20일 수익률'), ('r60', '60일 수익률')):
            s = o[k]
            print(' %s: n=%d 승률 %s%% 평균 %s%% 중앙값 %s%%'
                  % (lab, s['n'], p(s['win'], '%.1f'), p(s['mean']), p(s['med'])))
        print(' -8%% 손절 터치: %d/%d = %s%% (미확정 %d건)'
              % (o['stop_touch'], o['stop_resolved'], p(o['stop_pct'], '%.1f'), o['stop_open']))
        print(' 최대낙폭(60봉 완전분 n=%d): 평균 %s%% 중앙값 %s%%'
              % (o['mdd']['n'], p(o['mdd']['mean']), p(o['mdd']['med'])))
        print()

    def top(key, rev, n=3):
        v = [x for x in rows if x[key] is not None]
        v.sort(key=lambda x: x[key], reverse=rev)
        return v[:n]

    for lab, key in (('60일', 'r60'), ('20일', 'r20')):
        print('--- 최대 수익 3건 (%s) ---' % lab)
        for x in top(key, True):
            print('  %s %s(%s) %s  %+.2f%%' % (x['market'], x['name'], x['ticker'], x['date'], x[key]))
        print('--- 최대 손실 3건 (%s) ---' % lab)
        for x in top(key, False):
            print('  %s %s(%s) %s  %+.2f%%' % (x['market'], x['name'], x['ticker'], x['date'], x[key]))
        print()

    print('--- 판정불가 종목 ---')
    for r in counts:
        if r['count'] is None:
            print('  %s %s(%s): %s / %s' % (r['market'], r['name'], r['ticker'], r['status'], r['note']))
    halted = [r for r in counts if r.get('halt_rows', 0)]
    print('--- 거래정지 위봉 제거 종목: %d개 ---' % len(halted))
    for r in halted:
        print('  %s(%s) %d행' % (r['name'], r['ticker'], r['halt_rows']))

    json.dump({'summary': out, 'signals': rows,
               'counts': [{k: r[k] for k in ('market', 'ticker', 'name', 'count', 'status', 'note', 'bars')}
                          for r in counts]},
              open(os.path.join(BASE, 'out', 'final.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('\n(A_signals.csv / B_counts.csv / final.json 저장)')


if __name__ == '__main__':
    main()
