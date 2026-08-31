# -*- coding: utf-8 -*-
"""20종목 단위 배치 실행. 결과를 screen/out/results.json 에 누적 저장."""
import os, sys, io, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import engine

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

BASE = os.path.dirname(os.path.abspath(__file__))
UNI = json.load(open(os.path.join(BASE, 'universe.json'), encoding='utf-8'))
RES_PATH = os.path.join(BASE, 'out', 'results.json')

ALL = UNI['NASDAQ100'] + UNI['KOSPI200']
BATCH = 20


def load_results():
    if os.path.exists(RES_PATH):
        return json.load(open(RES_PATH, encoding='utf-8'))
    return {}


def save_results(res):
    tmp = RES_PATH + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False)
    os.replace(tmp, RES_PATH)


def main():
    b = int(sys.argv[1])                       # 1-based batch number
    lo, hi = (b - 1) * BATCH, min(b * BATCH, len(ALL))
    items = ALL[lo:hi]
    res = load_results()
    t0 = time.time()
    for it in items:
        key = it['market'] + ':' + it['ticker']
        if key in res:
            continue
        r = engine.run_ticker(it['ticker'], it['name'], it['market'])
        res[key] = r
        save_results(res)                      # 종목 1개마다 저장(중단 안전)
        if it['market'] == 'KOSPI200':
            time.sleep(0.15)
    save_results(res)

    # ---- 배치 보고 ----
    print('BATCH %d  [%d-%d / %d]  %.1fs' % (b, lo + 1, hi, len(ALL), time.time() - t0))
    tot = 0
    for it in items:
        r = res[it['market'] + ':' + it['ticker']]
        c = r['count']
        tot += (c or 0)
        flag = '' if r['status'] == 'OK' else '  <<< ' + r['status'] + ' (' + str(r['note'])[:60] + ')'
        print('  %-8s %-28s %-10s %s%s' % (
            r['ticker'], r['name'][:28], r['market'],
            ('%d개' % c) if c is not None else '판정불가', flag))
        for s in r['signals']:
            def f(v, p='%.2f'):
                return '미도래' if v is None else (p % v)
            print('        · %s  종가 %s  RSI %s  거래량 %sx  |  20일 %s%%  60일 %s%%  MDD %s%%  손절 %s' % (
                s['date'], f(s['close']), s['rsi'], s['volx'],
                f(s['r20'], '%+.2f'), f(s['r60'], '%+.2f'), f(s['mdd'], '%+.2f'),
                ('터치' if s['stop8'] else ('미터치' if s['stop8'] is not None else '미도래'))))
    print('  -> 배치 신호 합계: %d건 / 누적 처리 %d종목' % (tot, len(res)))


if __name__ == '__main__':
    main()
