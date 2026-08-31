# -*- coding: utf-8 -*-
"""6조건 동시충족 일봉 스크리너 + 전방수익률 계산 엔진.

시세 출처
  - NASDAQ100 : yfinance 1.5.2 (Yahoo Finance), auto_adjust=False -> 'Close'(액면분할 반영/배당 미반영), 'Volume'(분할 반영)
  - KOSPI200  : pykrx 1.2.8 (KRX 정보데이터시스템), get_market_ohlcv(adjusted=True) -> 종가/저가/거래량

계산 규약(모호구간 확정)
  - 볼린저: SMA20 +- k*STD20, STD는 모표준편차(ddof=0)
  - RSI(14): Wilder 평활(alpha=1/14, recursive)
  - MACD: EMA12-EMA26, signal=EMA9, 모두 adjust=False
  - 거래량 20일 평균: 당일 포함 20봉 이동평균(HTS 기본). 당일제외(t-20..t-1) 변형도 병기 계산
  - '최근 N봉 이내' : t-(N-1) ~ t (당일 포함)
  - 전방지표: 거래일 기준 t+20 / t+60, 최저가는 t+1..t+60 구간 Low 최소
"""
import os, sys, io, json, time, math
import numpy as np
import pandas as pd

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, 'data')
OUT = os.path.join(BASE, 'out')
os.makedirs(DATA, exist_ok=True)
os.makedirs(OUT, exist_ok=True)

FETCH_START = '2019-01-01'      # 200일선 워밍업 확보용
FETCH_END = '2026-09-01'
SIGNAL_FROM = pd.Timestamp('2020-01-01')
SIGNAL_TO = pd.Timestamp('2026-08-31')


# ----------------------------------------------------------------- 시세 수집
def fetch_us(ticker):
    import yfinance as yf
    df = yf.download(ticker, start=FETCH_START, end=FETCH_END,
                     auto_adjust=False, progress=False, threads=False)
    if df is None or len(df) == 0:
        return None
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    df = df.rename(columns={'Close': 'close', 'Low': 'low', 'High': 'high',
                            'Open': 'open', 'Volume': 'volume'})
    df = df[['open', 'high', 'low', 'close', 'volume']].copy()
    df.index = pd.to_datetime(df.index)
    try:
        df.index = df.index.tz_localize(None)
    except Exception:
        pass
    df.index = df.index.normalize()
    df = df.dropna(subset=['close'])
    return df


def fetch_kr(ticker):
    from pykrx import stock
    df = stock.get_market_ohlcv(FETCH_START.replace('-', ''),
                                FETCH_END.replace('-', ''), ticker)
    if df is None or len(df) == 0:
        return None
    df = df.rename(columns={'시가': 'open', '고가': 'high', '저가': 'low',
                            '종가': 'close', '거래량': 'volume'})
    df = df[['open', 'high', 'low', 'close', 'volume']].copy()
    df.index = pd.to_datetime(df.index).normalize()
    df = df[df['close'] > 0]
    return df


def clean(df):
    """거래정지 위봉 제거.

    pykrx는 거래정지 구간을 open=high=low=0, volume=0, close=직전종가 인
    가짜 행으로 채워서 돌려준다(예: SK텔레콤 2021-10-26~11-26 인적분할 정지).
    이 행이 남으면 저가 0 -> MDD -100% 같은 허위 수치가 나온다.
    -> OHLC 중 하나라도 0 이하인 행은 '봉 없음'으로 보고 제거한다.
    """
    n0 = len(df)
    ok = (df[['open', 'high', 'low', 'close']] > 0).all(axis=1) & df['close'].notna()
    df = df[ok]
    return df, n0 - len(df)


def load(ticker, market, refresh=False):
    """디스크 캐시 우선. 반환 (df|None, note, dropped)"""
    p = os.path.join(DATA, market + '_' + ticker.replace('/', '-') + '.csv')
    src = None
    df = None
    if os.path.exists(p) and not refresh:
        try:
            df = pd.read_csv(p, index_col=0, parse_dates=True)
            src = 'cache'
        except Exception:
            df = None
    if df is None:
        try:
            df = fetch_us(ticker) if market == 'NASDAQ100' else fetch_kr(ticker)
        except Exception as e:
            return None, 'FETCH_ERROR: ' + type(e).__name__ + ': ' + str(e)[:120], 0
        if df is None or len(df) == 0:
            return None, 'EMPTY', 0
        df.to_csv(p, encoding='utf-8')
        src = 'net'
    df, dropped = clean(df)
    if len(df) == 0:
        return None, 'EMPTY_AFTER_CLEAN', dropped
    return df, src, dropped


# ------------------------------------------------------------------- 지표
def indicators(df):
    c = df['close'].astype(float)
    v = df['volume'].astype(float)
    o = pd.DataFrame(index=df.index)
    o['close'] = c
    o['low'] = df['low'].astype(float)
    o['volume'] = v
    o['sma200'] = c.rolling(200).mean()
    o['sma120'] = c.rolling(120).mean()
    sma20 = c.rolling(20).mean()
    std20 = c.rolling(20).std(ddof=0)
    o['bb_low2'] = sma20 - 2 * std20
    o['bb_low1'] = sma20 - 1 * std20
    # RSI(14) Wilder
    d = c.diff()
    gain = d.clip(lower=0)
    loss = (-d).clip(lower=0)
    ag = gain.ewm(alpha=1.0 / 14, adjust=False).mean()
    al = loss.ewm(alpha=1.0 / 14, adjust=False).mean()
    rs = ag / al.replace(0, np.nan)
    rsi = 100 - 100 / (1 + rs)
    rsi = rsi.where(al != 0, 100.0)
    rsi.iloc[0] = np.nan
    o['rsi'] = rsi
    # MACD(12,26,9)
    macd = c.ewm(span=12, adjust=False).mean() - c.ewm(span=26, adjust=False).mean()
    sig = macd.ewm(span=9, adjust=False).mean()
    o['macd'] = macd
    o['signal'] = sig
    o['vol_ma20_incl'] = v.rolling(20).mean()            # 당일 포함(기본)
    o['vol_ma20_excl'] = v.shift(1).rolling(20).mean()   # 당일 제외(민감도용)
    return o


def screen(df):
    x = indicators(df)
    c = x['close']
    c1a = c > x['sma200']
    c1b = x['sma200'] > x['sma200'].shift(20)
    c1c = c > x['sma120']
    below2 = (c < x['bb_low2']).astype(float)
    c2 = below2.rolling(10).max() > 0                        # t-9..t 중 1일이라도
    c3 = c > x['bb_low1']
    c4a = (x['rsi'] >= 45) & (x['rsi'] <= 60)
    c4b = x['rsi'] > x['rsi'].shift(1)
    gx = ((x['macd'] > x['signal']) &
          (x['macd'].shift(1) <= x['signal'].shift(1))).astype(float)
    c5 = gx.rolling(5).max() > 0                             # t-4..t
    c6 = x['volume'] > x['vol_ma20_incl'] * 1.5
    c6e = x['volume'] > x['vol_ma20_excl'] * 1.5

    valid = (x[['sma200', 'sma120', 'bb_low2', 'bb_low1', 'rsi', 'macd',
                'vol_ma20_incl']].notna().all(axis=1)
             & x['sma200'].shift(20).notna())
    base = c1a & c1b & c1c & c2 & c3 & c4a & c4b & c5 & valid
    sig = (base & c6).fillna(False)
    sig_e = (base & c6e).fillna(False)
    inrange = pd.Series((x.index >= SIGNAL_FROM) & (x.index <= SIGNAL_TO), index=x.index)
    return x, (sig & inrange), (sig_e & inrange)


def forward(x, idx_pos):
    """신호 발생 t(정수위치) 기준 전방지표. 미도래는 None."""
    c = x['close'].values
    lo = x['low'].values
    n = len(c)
    c0 = float(c[idx_pos])
    r = {'close': c0}
    for h in (20, 60):
        j = idx_pos + h
        if j < n:
            r['c%d' % h] = float(c[j])
            r['r%d' % h] = (float(c[j]) / c0 - 1) * 100
        else:
            r['c%d' % h] = None
            r['r%d' % h] = None
    end = min(idx_pos + 60, n - 1)
    if end > idx_pos:
        seg = lo[idx_pos + 1:end + 1]
        mn = float(np.nanmin(seg))
        r['min_low'] = mn
        r['mdd'] = (mn / c0 - 1) * 100
        r['stop8'] = bool(mn <= c0 * 0.92)
        r['fwd_bars'] = int(end - idx_pos)
    else:
        r['min_low'] = None
        r['mdd'] = None
        r['stop8'] = None
        r['fwd_bars'] = 0
    return r


def run_ticker(ticker, name, market, refresh=False):
    df, note, dropped = load(ticker, market, refresh)
    if df is None:
        return {'ticker': ticker, 'name': name, 'market': market,
                'status': '조회 불가', 'note': note, 'bars': 0, 'halt_rows': dropped,
                'count': None, 'count_excl': None, 'signals': []}
    if len(df) < 221:
        return {'ticker': ticker, 'name': name, 'market': market,
                'status': '데이터 부족', 'note': '%d봉(220봉 워밍업 미달)' % len(df),
                'bars': len(df), 'halt_rows': dropped,
                'count': None, 'count_excl': None, 'signals': []}
    x, sig, sig_e = screen(df)
    pos = {}
    for i, d in enumerate(x.index):
        pos[d] = i
    rows = []
    for d in x.index[sig.values]:
        f = forward(x, pos[d])
        f['date'] = d.strftime('%Y-%m-%d')
        f['rsi'] = round(float(x['rsi'].loc[d]), 2)
        f['volx'] = round(float(x['volume'].loc[d] / x['vol_ma20_incl'].loc[d]), 2)
        rows.append(f)
    return {'ticker': ticker, 'name': name, 'market': market, 'status': 'OK',
            'note': note, 'bars': len(df), 'halt_rows': dropped,
            'first': x.index[0].strftime('%Y-%m-%d'),
            'last': x.index[-1].strftime('%Y-%m-%d'),
            'count': int(sig.sum()), 'count_excl': int(sig_e.sum()),
            'signals': rows}
