import {
	Bar,
	HistoryMetadata,
	LibrarySymbolInfo,
	PeriodParams,
} from '../../../charting_library/datafeed-api';

import {
	getErrorMessage,
	RequestParams,
	UdfErrorResponse,
	UdfOkResponse,
	UdfResponse,
} from './helpers';

import { Requester } from './requester';
// tslint:disable: no-any
interface HistoryPartialDataResponse extends UdfOkResponse {
	t: any;
	c: any;
	o?: never;
	h?: never;
	l?: never;
	v?: never;
}

interface HistoryFullDataResponse extends UdfOkResponse {
	t: any;
	c: any;
	o: any;
	h: any;
	l: any;
	v: any;
}
// tslint:enable: no-any
interface HistoryNoDataResponse extends UdfResponse {
	s: 'no_data';
	nextTime?: number;
}

type HistoryResponse = HistoryFullDataResponse | HistoryPartialDataResponse | HistoryNoDataResponse;

export type PeriodParamsWithOptionalCountback = Omit<PeriodParams, 'countBack'> & { countBack?: number };

export interface GetBarsResult {
	bars: Bar[];
	meta: HistoryMetadata;
}

export class HistoryProvider {
	public ChartData = [];
	private _datafeedUrl: string;
	private readonly _requester: Requester;

	public constructor(datafeedUrl: string, requester: Requester) {
		this._datafeedUrl = datafeedUrl;
		this._requester = requester;
	}

	public getBars(symbolInfo: LibrarySymbolInfo, resolution: string, periodParams: PeriodParamsWithOptionalCountback): Promise<GetBarsResult> {
		const requestParams: RequestParams = {
			symbol: symbolInfo.ticker || '',
			resolution: resolution,
			from: periodParams.from,
			to: periodParams.to,
		};
		if (periodParams.countBack !== undefined) {
			requestParams.countback = periodParams.countBack;
		}

		if (symbolInfo.currency_code !== undefined) {
			requestParams.currencyCode = symbolInfo.currency_code;
		}

		if (symbolInfo.unit_id !== undefined) {
			requestParams.unitId = symbolInfo.unit_id;
		}

		return new Promise((resolve: (result: GetBarsResult) => void, reject: (reason: string) => void) => {
			this._requester.sendRequest<HistoryResponse>(this._datafeedUrl, 'history', requestParams)
				.then((response: HistoryResponse | UdfErrorResponse) => {
					if (response.s !== 'ok' && response.s !== 'no_data') {
						reject(response.errmsg);
						return;
					}

					const bars: Bar[] = [];
					const meta: HistoryMetadata = {
						noData: false,
					};

					if (response.s === 'no_data') {
						meta.noData = true;
						meta.nextTime = response.nextTime;
					} else {
						const volumePresent = response.v !== undefined;
						const ohlPresent = response.o !== undefined;
						for (let i = 0; i < response.t.length; ++i) {
							const barValue: Bar = {
								time: response.t[i] * 1000,
								close: parseFloat(response.c[i]),
								open: parseFloat(response.c[i]),
								high: parseFloat(response.c[i]),
								low: parseFloat(response.c[i]),
							};

							if (ohlPresent) {
								barValue.open = parseFloat((response as HistoryFullDataResponse).o[i]);
								barValue.high = parseFloat((response as HistoryFullDataResponse).h[i]);
								barValue.low = parseFloat((response as HistoryFullDataResponse).l[i]);
							}

							if (volumePresent) {
								barValue.volume = parseFloat((response as HistoryFullDataResponse).v[i]);
							}

							bars.push(barValue);
						}
					}

					resolve({
						bars: bars,
						meta: meta,
					});
				})
				.catch((reason?: string | Error) => {
					const reasonString = getErrorMessage(reason);
					// tslint:disable-next-line:no-console
					console.warn(`HistoryProvider: getBars() failed, error=${reasonString}`);
					// reject(reasonString);
				});
		});
	}

	getData() {
		return [
			{
				time: 1647667186000,
				open: 111.87,
				close: 111.87,
				high: 111.87,
				low: 111.87
			},
			{
				time: 1647704147000,
				open: 230.87,
				close: 230.87,
				high: 230.87,
				low: 230.87
			},
			{
				time: 1647704550000,
				open: 50.87,
				close: 50.87,
				high: 50.87,
				low: 50.87
			},
			{
				time: 1647714262000,
				open: 984.87,
				close: 984.87,
				high: 984.87,
				low: 984.87
			},
			{
				time: 1647716282000,
				open: 151.86,
				close: 958.86,
				high: 958.86,
				low: 151.86
			},
			{
				time: 1647716677000,
				open: 654.86,
				close: 654.86,
				high: 654.86,
				low: 654.86
			},
			{
				time: 1647723917000,
				open: 477.84,
				close: 477.84,
				high: 477.84,
				low: 477.84
			},
			{
				time: 1647725225000,
				open: 441.82,
				close: 441.82,
				high: 441.82,
				low: 441.82
			},
			{
				time: 1647725666000,
				open: 81.81,
				close: 100.81,
				high: 100.81,
				low: 81.81
			},
			{
				time: 1648292419000,
				open: 20.29,
				close: 20.29,
				high: 20.29,
				low: 20.29
			},
			{
				time: 1648293280000,
				open: 28.29,
				close: 28.29,
				high: 28.29,
				low: 28.29
			},
			{
				time: 1650031331000,
				open: 86.9,
				close: 81.9,
				high: 86.9,
				low: 81.9
			},
			{
				time: 1650650843000,
				open: 95.93,
				close: 95.93,
				high: 95.93,
				low: 95.93
			},
			{
				time: 1650651228000,
				open: 985.93,
				close: 985.93,
				high: 985.93,
				low: 985.93
			},
			{
				time: 1650933668000,
				open: 98.33,
				close: 79.33,
				high: 98.33,
				low: 79.33
			},
			{
				time: 1650975614000,
				open: 19.38,
				close: 19.38,
				high: 19.38,
				low: 19.38
			},
			{
				time: 1651266928000,
				open: 514.39,
				close: 514.39,
				high: 514.39,
				low: 514.39
			},
			{
				time: 1651343268000,
				open: 519.5,
				close: 519.5,
				high: 519.5,
				low: 519.5
			}
		];
		// return [{
		// 	time: 1483401600000,
		// 	close: 116.15,
		// 	open: 115.8,
		// 	high: 116.33,
		// 	low: 114.76,
		// 	volume: 28781865
		// },
		// {
		// 	time: 1483488000000,
		// 	close: 116.02,
		// 	open: 115.85,
		// 	high: 116.51,
		// 	low: 115.75,
		// 	volume: 21118116
		// },
		// {
		// 	time: 1483574400000,
		// 	close: 116.61,
		// 	open: 115.92,
		// 	high: 116.8642,
		// 	low: 115.81,
		// 	volume: 22193587
		// },
		// {
		// 	time: 1483660800000,
		// 	close: 117.91,
		// 	open: 116.78,
		// 	high: 118.16,
		// 	low: 116.47,
		// 	volume: 31751900
		// },
		// {
		// 	time: 1483920000000,
		// 	close: 118.99,
		// 	open: 117.95,
		// 	high: 119.43,
		// 	low: 117.94,
		// 	volume: 33561948
		// },
		// {
		// 	time: 1484006400000,
		// 	close: 119.11,
		// 	open: 118.77,
		// 	high: 119.38,
		// 	low: 118.3,
		// 	volume: 24462051
		// },
		// {
		// 	time: 1484092800000,
		// 	close: 119.75,
		// 	open: 118.74,
		// 	high: 119.93,
		// 	low: 118.6,
		// 	volume: 27588593
		// },
		// {
		// 	time: 1484179200000,
		// 	close: 119.25,
		// 	open: 118.895,
		// 	high: 119.3,
		// 	low: 118.21,
		// 	volume: 27086220
		// },
		// {
		// 	time: 1484265600000,
		// 	close: 119.04,
		// 	open: 119.11,
		// 	high: 119.62,
		// 	low: 118.81,
		// 	volume: 26111948
		// },
		// {
		// 	time: 1484611200000,
		// 	close: 120,
		// 	open: 118.34,
		// 	high: 120.24,
		// 	low: 118.22,
		// 	volume: 34439843
		// },
		// {
		// 	time: 1484697600000,
		// 	close: 119.99,
		// 	open: 120,
		// 	high: 120.5,
		// 	low: 119.71,
		// 	volume: 23712961
		// },
		// {
		// 	time: 1484784000000,
		// 	close: 119.78,
		// 	open: 119.4,
		// 	high: 120.09,
		// 	low: 119.37,
		// 	volume: 25597291
		// },
		// {
		// 	time: 1484870400000,
		// 	close: 120,
		// 	open: 120.45,
		// 	high: 120.45,
		// 	low: 119.7346,
		// 	volume: 32597892
		// },
		// {
		// 	time: 1485129600000,
		// 	close: 120.08,
		// 	open: 120,
		// 	high: 120.81,
		// 	low: 119.77,
		// 	volume: 22050218
		// },
		// {
		// 	time: 1485216000000,
		// 	close: 119.97,
		// 	open: 119.55,
		// 	high: 120.1,
		// 	low: 119.5,
		// 	volume: 23211038
		// },
		// {
		// 	time: 1485302400000,
		// 	close: 121.88,
		// 	open: 120.42,
		// 	high: 122.1,
		// 	low: 120.28,
		// 	volume: 32586673
		// },
		// {
		// 	time: 1485388800000,
		// 	close: 121.94,
		// 	open: 121.67,
		// 	high: 122.44,
		// 	low: 121.6,
		// 	volume: 26337576
		// },
		// {
		// 	time: 1485475200000,
		// 	close: 121.95,
		// 	open: 122.14,
		// 	high: 122.35,
		// 	low: 121.6,
		// 	volume: 20562944
		// },
		// {
		// 	time: 1485734400000,
		// 	close: 121.63,
		// 	open: 120.93,
		// 	high: 121.63,
		// 	low: 120.66,
		// 	volume: 30377503
		// },
		// {
		// 	time: 1485820800000,
		// 	close: 121.35,
		// 	open: 121.15,
		// 	high: 121.39,
		// 	low: 120.62,
		// 	volume: 49200993
		// },
		// {
		// 	time: 1485907200000,
		// 	close: 128.75,
		// 	open: 127.03,
		// 	high: 130.49,
		// 	low: 127.01,
		// 	volume: 111985040
		// },
		// {
		// 	time: 1485993600000,
		// 	close: 128.53,
		// 	open: 127.975,
		// 	high: 129.39,
		// 	low: 127.78,
		// 	volume: 33710411
		// },
		// {
		// 	time: 1486080000000,
		// 	close: 129.08,
		// 	open: 128.31,
		// 	high: 129.19,
		// 	low: 128.16,
		// 	volume: 24507301
		// },
		// {
		// 	time: 1486339200000,
		// 	close: 130.29,
		// 	open: 129.13,
		// 	high: 130.5,
		// 	low: 128.9,
		// 	volume: 26845924
		// },
		// {
		// 	time: 1486425600000,
		// 	close: 131.53,
		// 	open: 130.54,
		// 	high: 132.09,
		// 	low: 130.45,
		// 	volume: 38183841
		// },
		// {
		// 	time: 1486512000000,
		// 	close: 132.04,
		// 	open: 131.35,
		// 	high: 132.22,
		// 	low: 131.22,
		// 	volume: 23004072
		// },
		// {
		// 	time: 1486598400000,
		// 	close: 132.42,
		// 	open: 131.65,
		// 	high: 132.445,
		// 	low: 131.12,
		// 	volume: 28349859
		// },
		// {
		// 	time: 1486684800000,
		// 	close: 132.12,
		// 	open: 132.46,
		// 	high: 132.94,
		// 	low: 132.05,
		// 	volume: 20065458
		// },
		// {
		// 	time: 1486944000000,
		// 	close: 133.29,
		// 	open: 133.08,
		// 	high: 133.82,
		// 	low: 132.75,
		// 	volume: 23035421
		// },
		// {
		// 	time: 1487030400000,
		// 	close: 135.02,
		// 	open: 133.47,
		// 	high: 135.09,
		// 	low: 133.25,
		// 	volume: 33226223
		// },
		// {
		// 	time: 1487116800000,
		// 	close: 135.51,
		// 	open: 135.52,
		// 	high: 136.27,
		// 	low: 134.62,
		// 	volume: 35623100
		// },
		// {
		// 	time: 1487203200000,
		// 	close: 135.345,
		// 	open: 135.67,
		// 	high: 135.9,
		// 	low: 134.8398,
		// 	volume: 22584555
		// },
		// {
		// 	time: 1487289600000,
		// 	close: 135.72,
		// 	open: 135.1,
		// 	high: 135.83,
		// 	low: 135.1,
		// 	volume: 22198197
		// },
		// {
		// 	time: 1487635200000,
		// 	close: 136.7,
		// 	open: 136.23,
		// 	high: 136.75,
		// 	low: 135.98,
		// 	volume: 24507156
		// },
		// {
		// 	time: 1487721600000,
		// 	close: 137.11,
		// 	open: 136.43,
		// 	high: 137.12,
		// 	low: 136.11,
		// 	volume: 20836932
		// },
		// {
		// 	time: 1487808000000,
		// 	close: 136.53,
		// 	open: 137.38,
		// 	high: 137.48,
		// 	low: 136.3,
		// 	volume: 20788186
		// },
		// {
		// 	time: 1487894400000,
		// 	close: 136.66,
		// 	open: 135.91,
		// 	high: 136.66,
		// 	low: 135.28,
		// 	volume: 21776585
		// },
		// {
		// 	time: 1488153600000,
		// 	close: 136.93,
		// 	open: 137.14,
		// 	high: 137.435,
		// 	low: 136.28,
		// 	volume: 20257426
		// },
		// {
		// 	time: 1488240000000,
		// 	close: 136.99,
		// 	open: 137.08,
		// 	high: 137.435,
		// 	low: 136.7,
		// 	volume: 23482860
		// },
		// {
		// 	time: 1488326400000,
		// 	close: 139.79,
		// 	open: 137.89,
		// 	high: 140.15,
		// 	low: 137.595,
		// 	volume: 36414585
		// },
		// {
		// 	time: 1488412800000,
		// 	close: 138.96,
		// 	open: 140,
		// 	high: 140.2786,
		// 	low: 138.76,
		// 	volume: 26210984
		// },
		// {
		// 	time: 1488499200000,
		// 	close: 139.78,
		// 	open: 138.78,
		// 	high: 139.83,
		// 	low: 138.59,
		// 	volume: 21571121
		// },
		// {
		// 	time: 1488758400000,
		// 	close: 139.34,
		// 	open: 139.365,
		// 	high: 139.77,
		// 	low: 138.5959,
		// 	volume: 21750044
		// },
		// {
		// 	time: 1488844800000,
		// 	close: 139.52,
		// 	open: 139.06,
		// 	high: 139.98,
		// 	low: 138.79,
		// 	volume: 17446297
		// },
		// {
		// 	time: 1488931200000,
		// 	close: 139,
		// 	open: 138.95,
		// 	high: 139.8,
		// 	low: 138.82,
		// 	volume: 18707236
		// },
		// {
		// 	time: 1489017600000,
		// 	close: 138.68,
		// 	open: 138.74,
		// 	high: 138.79,
		// 	low: 137.05,
		// 	volume: 22155904
		// },
		// {
		// 	time: 1489104000000,
		// 	close: 139.14,
		// 	open: 139.25,
		// 	high: 139.3571,
		// 	low: 138.64,
		// 	volume: 19612801
		// },
		// {
		// 	time: 1489363200000,
		// 	close: 139.2,
		// 	open: 138.85,
		// 	high: 139.43,
		// 	low: 138.82,
		// 	volume: 17421717
		// },
		// {
		// 	time: 1489449600000,
		// 	close: 138.99,
		// 	open: 139.3,
		// 	high: 139.65,
		// 	low: 138.84,
		// 	volume: 15309065
		// },
		// {
		// 	time: 1489536000000,
		// 	close: 140.46,
		// 	open: 139.41,
		// 	high: 140.7501,
		// 	low: 139.025,
		// 	volume: 25691774
		// },
		// {
		// 	time: 1489622400000,
		// 	close: 140.69,
		// 	open: 140.72,
		// 	high: 141.02,
		// 	low: 140.26,
		// 	volume: 19231998
		// },
		// {
		// 	time: 1489708800000,
		// 	close: 139.99,
		// 	open: 141,
		// 	high: 141,
		// 	low: 139.89,
		// 	volume: 43884952
		// },
		// {
		// 	time: 1489968000000,
		// 	close: 141.46,
		// 	open: 140.4,
		// 	high: 141.5,
		// 	low: 140.23,
		// 	volume: 21542038
		// },
		// {
		// 	time: 1490054400000,
		// 	close: 139.84,
		// 	open: 142.11,
		// 	high: 142.8,
		// 	low: 139.73,
		// 	volume: 39529912
		// },
		// {
		// 	time: 1490140800000,
		// 	close: 141.42,
		// 	open: 139.845,
		// 	high: 141.6,
		// 	low: 139.76,
		// 	volume: 25860165
		// },
		// {
		// 	time: 1490227200000,
		// 	close: 140.92,
		// 	open: 141.26,
		// 	high: 141.5844,
		// 	low: 140.61,
		// 	volume: 20346301
		// },
		// {
		// 	time: 1490313600000,
		// 	close: 140.64,
		// 	open: 141.5,
		// 	high: 141.74,
		// 	low: 140.35,
		// 	volume: 22395563
		// },
		// {
		// 	time: 1490572800000,
		// 	close: 140.88,
		// 	open: 139.39,
		// 	high: 141.22,
		// 	low: 138.62,
		// 	volume: 23575094
		// },
		// {
		// 	time: 1490659200000,
		// 	close: 143.8,
		// 	open: 140.91,
		// 	high: 144.04,
		// 	low: 140.62,
		// 	volume: 33374805
		// },
		// {
		// 	time: 1490745600000,
		// 	close: 144.12,
		// 	open: 143.68,
		// 	high: 144.49,
		// 	low: 143.19,
		// 	volume: 29189955
		// },
		// {
		// 	time: 1490832000000,
		// 	close: 143.93,
		// 	open: 144.19,
		// 	high: 144.5,
		// 	low: 143.5,
		// 	volume: 21207252
		// },
		// {
		// 	time: 1490918400000,
		// 	close: 143.66,
		// 	open: 143.72,
		// 	high: 144.27,
		// 	low: 143.01,
		// 	volume: 19661651
		// },
		// {
		// 	time: 1491177600000,
		// 	close: 143.7,
		// 	open: 143.71,
		// 	high: 144.12,
		// 	low: 143.05,
		// 	volume: 19985714
		// },
		// {
		// 	time: 1491264000000,
		// 	close: 144.77,
		// 	open: 143.25,
		// 	high: 144.89,
		// 	low: 143.17,
		// 	volume: 19891354
		// },
		// {
		// 	time: 1491350400000,
		// 	close: 144.02,
		// 	open: 144.22,
		// 	high: 145.46,
		// 	low: 143.81,
		// 	volume: 27717854
		// },
		// {
		// 	time: 1491436800000,
		// 	close: 143.66,
		// 	open: 144.29,
		// 	high: 144.52,
		// 	low: 143.45,
		// 	volume: 21149034
		// },
		// {
		// 	time: 1491523200000,
		// 	close: 143.34,
		// 	open: 143.73,
		// 	high: 144.18,
		// 	low: 143.27,
		// 	volume: 16658543
		// },
		// {
		// 	time: 1491782400000,
		// 	close: 143.17,
		// 	open: 143.6,
		// 	high: 143.8792,
		// 	low: 142.9,
		// 	volume: 18933397
		// },
		// {
		// 	time: 1491868800000,
		// 	close: 141.63,
		// 	open: 142.94,
		// 	high: 143.35,
		// 	low: 140.06,
		// 	volume: 30379376
		// },
		// {
		// 	time: 1491955200000,
		// 	close: 141.8,
		// 	open: 141.6,
		// 	high: 142.15,
		// 	low: 141.01,
		// 	volume: 20350000
		// },
		// {
		// 	time: 1492041600000,
		// 	close: 141.05,
		// 	open: 141.91,
		// 	high: 142.38,
		// 	low: 141.05,
		// 	volume: 17822880
		// },
		// {
		// 	time: 1492387200000,
		// 	close: 141.83,
		// 	open: 141.48,
		// 	high: 141.88,
		// 	low: 140.87,
		// 	volume: 16582094
		// },
		// {
		// 	time: 1492473600000,
		// 	close: 141.2,
		// 	open: 141.41,
		// 	high: 142.04,
		// 	low: 141.11,
		// 	volume: 14697544
		// },
		// {
		// 	time: 1492560000000,
		// 	close: 140.68,
		// 	open: 141.88,
		// 	high: 142,
		// 	low: 140.45,
		// 	volume: 17328375
		// },
		// {
		// 	time: 1492646400000,
		// 	close: 142.44,
		// 	open: 141.22,
		// 	high: 142.92,
		// 	low: 141.16,
		// 	volume: 23319562
		// },
		// {
		// 	time: 1492732800000,
		// 	close: 142.27,
		// 	open: 142.44,
		// 	high: 142.68,
		// 	low: 141.85,
		// 	volume: 17320928
		// },
		// {
		// 	time: 1492992000000,
		// 	close: 143.64,
		// 	open: 143.5,
		// 	high: 143.95,
		// 	low: 143.18,
		// 	volume: 17116599
		// },
		// {
		// 	time: 1493078400000,
		// 	close: 144.54,
		// 	open: 143.91,
		// 	high: 144.9,
		// 	low: 143.87,
		// 	volume: 18216472
		// },
		// {
		// 	time: 1493164800000,
		// 	close: 143.6508,
		// 	open: 144.47,
		// 	high: 144.6,
		// 	low: 143.3762,
		// 	volume: 19614287
		// },
		// {
		// 	time: 1493251200000,
		// 	close: 143.79,
		// 	open: 143.9225,
		// 	high: 144.16,
		// 	low: 143.31,
		// 	volume: 13948980
		// },
		// {
		// 	time: 1493337600000,
		// 	close: 143.65,
		// 	open: 144.09,
		// 	high: 144.3,
		// 	low: 143.27,
		// 	volume: 20247187
		// },
		// {
		// 	time: 1493596800000,
		// 	close: 146.6,
		// 	open: 145.1,
		// 	high: 147.2,
		// 	low: 144.96,
		// 	volume: 32818760
		// },
		// {
		// 	time: 1493683200000,
		// 	close: 147.51,
		// 	open: 147.54,
		// 	high: 148.09,
		// 	low: 146.84,
		// 	volume: 39752670
		// },
		// {
		// 	time: 1493769600000,
		// 	close: 147.06,
		// 	open: 145.59,
		// 	high: 147.49,
		// 	low: 144.27,
		// 	volume: 45142806
		// },
		// {
		// 	time: 1493856000000,
		// 	close: 146.53,
		// 	open: 146.52,
		// 	high: 147.14,
		// 	low: 145.81,
		// 	volume: 23275690
		// },
		// {
		// 	time: 1493942400000,
		// 	close: 148.96,
		// 	open: 146.76,
		// 	high: 148.98,
		// 	low: 146.76,
		// 	volume: 26787359
		// },
		// {
		// 	time: 1494201600000,
		// 	close: 153,
		// 	open: 149.03,
		// 	high: 153.7,
		// 	low: 149.03,
		// 	volume: 48339210
		// },
		// {
		// 	time: 1494288000000,
		// 	close: 153.96,
		// 	open: 153.87,
		// 	high: 154.88,
		// 	low: 153.45,
		// 	volume: 35942435
		// },
		// {
		// 	time: 1494374400000,
		// 	close: 153.26,
		// 	open: 153.63,
		// 	high: 153.94,
		// 	low: 152.11,
		// 	volume: 25670456
		// },
		// {
		// 	time: 1494460800000,
		// 	close: 153.95,
		// 	open: 152.45,
		// 	high: 154.07,
		// 	low: 152.31,
		// 	volume: 25596687
		// },
		// {
		// 	time: 1494547200000,
		// 	close: 156.1,
		// 	open: 154.7,
		// 	high: 156.42,
		// 	low: 154.67,
		// 	volume: 32221756
		// },
		// {
		// 	time: 1494806400000,
		// 	close: 155.7,
		// 	open: 156.01,
		// 	high: 156.65,
		// 	low: 155.05,
		// 	volume: 25700983
		// },
		// {
		// 	time: 1494892800000,
		// 	close: 155.47,
		// 	open: 155.94,
		// 	high: 156.06,
		// 	low: 154.72,
		// 	volume: 19904679
		// },
		// {
		// 	time: 1494979200000,
		// 	close: 150.25,
		// 	open: 153.6,
		// 	high: 154.57,
		// 	low: 149.71,
		// 	volume: 49482818
		// },
		// {
		// 	time: 1495065600000,
		// 	close: 152.54,
		// 	open: 151.27,
		// 	high: 153.34,
		// 	low: 151.13,
		// 	volume: 33159664
		// },
		// {
		// 	time: 1495152000000,
		// 	close: 152.96,
		// 	open: 153.38,
		// 	high: 153.98,
		// 	low: 152.63,
		// 	volume: 26733798
		// },
		// {
		// 	time: 1495411200000,
		// 	close: 153.99,
		// 	open: 154,
		// 	high: 154.58,
		// 	low: 152.91,
		// 	volume: 22340069
		// },
		// {
		// 	time: 1495497600000,
		// 	close: 153.8,
		// 	open: 154.9,
		// 	high: 154.9,
		// 	low: 153.31,
		// 	volume: 19430358
		// },
		// {
		// 	time: 1495584000000,
		// 	close: 153.34,
		// 	open: 153.84,
		// 	high: 154.17,
		// 	low: 152.67,
		// 	volume: 19118319
		// },
		// {
		// 	time: 1495670400000,
		// 	close: 153.87,
		// 	open: 153.73,
		// 	high: 154.35,
		// 	low: 153.03,
		// 	volume: 19044463
		// },
		// {
		// 	time: 1495756800000,
		// 	close: 153.61,
		// 	open: 154,
		// 	high: 154.24,
		// 	low: 153.31,
		// 	volume: 21632202
		// },
		// {
		// 	time: 1496102400000,
		// 	close: 153.67,
		// 	open: 153.42,
		// 	high: 154.43,
		// 	low: 153.33,
		// 	volume: 20034934
		// },
		// {
		// 	time: 1496188800000,
		// 	close: 152.76,
		// 	open: 153.97,
		// 	high: 154.17,
		// 	low: 152.38,
		// 	volume: 23162873
		// },
		// {
		// 	time: 1496275200000,
		// 	close: 153.18,
		// 	open: 153.17,
		// 	high: 153.33,
		// 	low: 152.22,
		// 	volume: 16180143
		// },
		// {
		// 	time: 1496361600000,
		// 	close: 155.45,
		// 	open: 153.58,
		// 	high: 155.45,
		// 	low: 152.89,
		// 	volume: 27285861
		// },
		// {
		// 	time: 1496620800000,
		// 	close: 153.93,
		// 	open: 154.34,
		// 	high: 154.45,
		// 	low: 153.46,
		// 	volume: 24803858
		// },
		// {
		// 	time: 1496707200000,
		// 	close: 154.45,
		// 	open: 153.9,
		// 	high: 155.81,
		// 	low: 153.78,
		// 	volume: 26249630
		// },
		// {
		// 	time: 1496793600000,
		// 	close: 155.37,
		// 	open: 155.02,
		// 	high: 155.98,
		// 	low: 154.48,
		// 	volume: 20678772
		// },
		// {
		// 	time: 1496880000000,
		// 	close: 154.99,
		// 	open: 155.25,
		// 	high: 155.54,
		// 	low: 154.4,
		// 	volume: 20771367
		// },
		// {
		// 	time: 1496966400000,
		// 	close: 148.98,
		// 	open: 155.19,
		// 	high: 155.19,
		// 	low: 146.02,
		// 	volume: 64176149
		// },
		// {
		// 	time: 1497225600000,
		// 	close: 145.32,
		// 	open: 145.74,
		// 	high: 146.09,
		// 	low: 142.51,
		// 	volume: 71563614
		// },
		// {
		// 	time: 1497312000000,
		// 	close: 146.59,
		// 	open: 147.16,
		// 	high: 147.45,
		// 	low: 145.15,
		// 	volume: 33749154
		// },
		// {
		// 	time: 1497398400000,
		// 	close: 145.16,
		// 	open: 147.5,
		// 	high: 147.5,
		// 	low: 143.84,
		// 	volume: 31224203
		// },
		// {
		// 	time: 1497484800000,
		// 	close: 144.29,
		// 	open: 143.32,
		// 	high: 144.4798,
		// 	low: 142.21,
		// 	volume: 31348832
		// },
		// {
		// 	time: 1497571200000,
		// 	close: 142.27,
		// 	open: 143.78,
		// 	high: 144.5,
		// 	low: 142.2,
		// 	volume: 49180748
		// },
		// {
		// 	time: 1497830400000,
		// 	close: 146.34,
		// 	open: 143.66,
		// 	high: 146.74,
		// 	low: 143.66,
		// 	volume: 31449132
		// },
		// {
		// 	time: 1497916800000,
		// 	close: 145.01,
		// 	open: 146.87,
		// 	high: 146.87,
		// 	low: 144.94,
		// 	volume: 24572170
		// },
		// {
		// 	time: 1498003200000,
		// 	close: 145.87,
		// 	open: 145.52,
		// 	high: 146.0693,
		// 	low: 144.61,
		// 	volume: 21064679
		// },
		// {
		// 	time: 1498089600000,
		// 	close: 145.63,
		// 	open: 145.77,
		// 	high: 146.7,
		// 	low: 145.1199,
		// 	volume: 18673365
		// },
		// {
		// 	time: 1498176000000,
		// 	close: 146.35,
		// 	open: 145.13,
		// 	high: 147.16,
		// 	low: 145.11,
		// 	volume: 25997976
		// },
		// {
		// 	time: 1498435200000,
		// 	close: 145.82,
		// 	open: 147.17,
		// 	high: 148.28,
		// 	low: 145.38,
		// 	volume: 25524661
		// },
		// {
		// 	time: 1498521600000,
		// 	close: 143.74,
		// 	open: 145.01,
		// 	high: 146.16,
		// 	low: 143.62,
		// 	volume: 24423643
		// },
		// {
		// 	time: 1498608000000,
		// 	close: 145.83,
		// 	open: 144.49,
		// 	high: 146.11,
		// 	low: 143.1601,
		// 	volume: 21915939
		// },
		// {
		// 	time: 1498694400000,
		// 	close: 143.68,
		// 	open: 144.71,
		// 	high: 145.13,
		// 	low: 142.28,
		// 	volume: 31116980
		// },
		// {
		// 	time: 1498780800000,
		// 	close: 144.02,
		// 	open: 144.45,
		// 	high: 144.96,
		// 	low: 143.78,
		// 	volume: 22328979
		// },
		// {
		// 	time: 1499040000000,
		// 	close: 143.5,
		// 	open: 144.88,
		// 	high: 145.3001,
		// 	low: 143.1,
		// 	volume: 14276812
		// },
		// {
		// 	time: 1499212800000,
		// 	close: 144.09,
		// 	open: 143.69,
		// 	high: 144.79,
		// 	low: 142.7237,
		// 	volume: 20758795
		// },
		// {
		// 	time: 1499299200000,
		// 	close: 142.73,
		// 	open: 143.02,
		// 	high: 143.5,
		// 	low: 142.41,
		// 	volume: 23374374
		// },
		// {
		// 	time: 1499385600000,
		// 	close: 144.18,
		// 	open: 142.9,
		// 	high: 144.75,
		// 	low: 142.9,
		// 	volume: 18505351
		// },
		// {
		// 	time: 1499644800000,
		// 	close: 145.06,
		// 	open: 144.11,
		// 	high: 145.95,
		// 	low: 143.37,
		// 	volume: 21030466
		// },
		// {
		// 	time: 1499731200000,
		// 	close: 145.53,
		// 	open: 144.73,
		// 	high: 145.85,
		// 	low: 144.38,
		// 	volume: 18311156
		// },
		// {
		// 	time: 1499817600000,
		// 	close: 145.74,
		// 	open: 145.87,
		// 	high: 146.18,
		// 	low: 144.82,
		// 	volume: 23617964
		// },
		// {
		// 	time: 1499904000000,
		// 	close: 147.77,
		// 	open: 145.5,
		// 	high: 148.49,
		// 	low: 145.44,
		// 	volume: 24922788
		// },
		// {
		// 	time: 1499990400000,
		// 	close: 149.04,
		// 	open: 147.97,
		// 	high: 149.33,
		// 	low: 147.33,
		// 	volume: 19961788
		// },
		// {
		// 	time: 1500249600000,
		// 	close: 149.56,
		// 	open: 148.82,
		// 	high: 150.9,
		// 	low: 148.57,
		// 	volume: 23243713
		// },
		// {
		// 	time: 1500336000000,
		// 	close: 150.08,
		// 	open: 149.2,
		// 	high: 150.13,
		// 	low: 148.67,
		// 	volume: 17713795
		// },
		// {
		// 	time: 1500422400000,
		// 	close: 151.02,
		// 	open: 150.48,
		// 	high: 151.42,
		// 	low: 149.95,
		// 	volume: 20615419
		// },
		// {
		// 	time: 1500508800000,
		// 	close: 150.34,
		// 	open: 151.5,
		// 	high: 151.74,
		// 	low: 150.19,
		// 	volume: 17053326
		// },
		// {
		// 	time: 1500595200000,
		// 	close: 150.27,
		// 	open: 149.99,
		// 	high: 150.44,
		// 	low: 148.88,
		// 	volume: 24671002
		// },
		// {
		// 	time: 1500854400000,
		// 	close: 152.09,
		// 	open: 150.58,
		// 	high: 152.44,
		// 	low: 149.9,
		// 	volume: 21122730
		// },
		// {
		// 	time: 1500940800000,
		// 	close: 152.74,
		// 	open: 151.8,
		// 	high: 153.84,
		// 	low: 151.8,
		// 	volume: 18612649
		// }
		// ];
	}
}
