// import * as React from 'react';
// import './index.css';
// import {
// 	widget,
// 	ChartingLibraryWidgetOptions,
// 	LanguageCode,
// 	IChartingLibraryWidget,
// 	ResolutionString,
// } from '../../charting_library';

// import {
// 	UDFCompatibleDatafeed
// } from '../../datafeeds/udf/src/udf-compatible-datafeed';

// export interface ChartContainerProps {
// 	symbol: ChartingLibraryWidgetOptions['symbol'];
// 	interval: ChartingLibraryWidgetOptions['interval'];

// 	// BEWARE: no trailing slash is expected in feed URL
// 	datafeedUrl: string;
// 	libraryPath: ChartingLibraryWidgetOptions['library_path'];
// 	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
// 	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
// 	clientId: ChartingLibraryWidgetOptions['client_id'];
// 	userId: ChartingLibraryWidgetOptions['user_id'];
// 	fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
// 	autosize: ChartingLibraryWidgetOptions['autosize'];
// 	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
// 	container: ChartingLibraryWidgetOptions['container'];
// }


// function getLanguageFromURL(): LanguageCode | null {
// 	const regex = new RegExp('[\\?&]lang=([^&#]*)');
// 	const results = regex.exec(location.search);
// 	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
// }

// export class TVChartContainer extends React.PureComponent<Partial<ChartContainerProps>> {
	
// 	public static defaultProps: Omit<ChartContainerProps, 'container'> = {
// 		symbol: '',
// 		interval: '10' as ResolutionString,
// 		datafeedUrl: 'https://demo_feed.tradingview.com',
// 		libraryPath: '/charting_library/',
// 		chartsStorageUrl: 'https://saveload.tradingview.com',
// 		chartsStorageApiVersion: '1.1',
// 		clientId: 'tradingview.com',
// 		userId: 'public_user_id',
// 		fullscreen: false,
// 		autosize: true,
// 		studiesOverrides: {},
// 	};

// 	private tvWidget: IChartingLibraryWidget | null = null;
// 	private ref: React.RefObject<HTMLDivElement> = React.createRef();

// 	public componentDidMount(): void {
// 		if (!this.ref.current) {
// 			return;
// 		}
// 		const widgetOptions: ChartingLibraryWidgetOptions = {
// 			// symbol: this.props.symbol as string,
// 			symbol: this.props.symbol as string,
// 			// datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
// 			datafeed: new UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
// 			interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
// 			container: this.ref.current,
// 			library_path: this.props.libraryPath as string,
// 			locale: getLanguageFromURL() || 'en',
// 			disabled_features: ['use_localstorage_for_settings', 'header_symbol_search', 'header_compare'], // symbol_info
// 			enabled_features: [],
// 			charts_storage_url: this.props.chartsStorageUrl,
// 			charts_storage_api_version: this.props.chartsStorageApiVersion,
// 			client_id: this.props.clientId,
// 			user_id: this.props.userId,
// 			fullscreen: this.props.fullscreen,
// 			autosize: this.props.autosize,
// 			studies_overrides: this.props.studiesOverrides,
// 		};

// 		const tvWidget = new widget(widgetOptions);
// 		this.tvWidget = tvWidget;

// 		tvWidget.onChartReady(() => {
// 			tvWidget.headerReady().then(() => {
// 				// const button = tvWidget.createButton();
// 				// button.setAttribute('title', 'Click to show a notification popup');
// 				// button.classList.add('apply-common-tooltip');
// 				// button.addEventListener('click', () => tvWidget.showNoticeDialog({
// 				// 		title: 'Notification',
// 				// 		body: 'TradingView Charting Library API works correctly',
// 				// 		callback: () => {
// 				// 			
// 				// 		},
// 				// 	}));
// 				// button.innerHTML = 'Check API';
// 			});
// 		});
// 	}

// 	public componentWillUnmount(): void {
// 		if (this.tvWidget !== null) {
// 			this.tvWidget.remove();
// 			this.tvWidget = null;
// 		}
// 	}

// 	public render(): JSX.Element {
// 		return (
// 			<div
// 				ref={ this.ref }
// 				className={ 'TVChartContainer' }
// 			/>
// 		);
// 	}
// }



import * as React from 'react';
import './index.scss';
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  IChartingLibraryWidget,
  ResolutionString,
} from '../../charting_library';

import { UDFCompatibleDatafeed } from '../../datafeeds/udf/src/udf-compatible-datafeed';
import useFetchChartData from './useFetchChartData';

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  container: ChartingLibraryWidgetOptions['container'];
}

const TVChartContainer: React.FC<Partial<ChartContainerProps>> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  let chartData = useFetchChartData(props.symbol || '')


  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol as string,
      datafeed: new UDFCompatibleDatafeed('https://demo_feed.tradingview.com',chartData),
      interval: props.interval as ChartingLibraryWidgetOptions['interval'],
      container: ref.current,
      library_path: props.libraryPath as string,
      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_symbol_search',
        'header_compare',
      ], // symbol_info
      enabled_features: [],
      charts_storage_url: props.chartsStorageUrl,
      charts_storage_api_version: props.chartsStorageApiVersion,
      client_id: props.clientId,
      user_id: props.userId,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      studies_overrides: props.studiesOverrides,
    };
    let tvWidget: IChartingLibraryWidget | null = new widget(widgetOptions);
    

    return () => {
      if (tvWidget !== null) {
        tvWidget.remove();
        tvWidget = null;
      }
    };
  }, [chartData]);

  return (
      <div ref={ref} className={'TVChartContainer'} />
  );
};

TVChartContainer.defaultProps = {
  symbol: '',
  interval: '10' as ResolutionString,
  datafeedUrl: 'https://demo_feed.tradingview.com',
  libraryPath: '/charting_library/',
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.1',
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
  studiesOverrides: {},
};

export default React.memo(TVChartContainer)