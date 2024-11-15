import { css } from '@emotion/react';
import { IonIcon } from '@ionic/react';
import MaterialTable, {
    MaterialTableProps,
} from '@material-table/core';
import { createTheme, Grid, MenuItem, MuiThemeProvider, Select } from '@material-ui/core';
import { eye } from 'ionicons/icons';
import { RefAttributes, useEffect, useMemo, useState } from 'react';
import usePersistentState from '../hooks/usePersistentState';
import { colorsByName } from '../theme/Theme';
import Help from './Help';
import './select-timezone.scss';

const blue = '#0000FF';
const red = '#FF0000';
const green = '#00FF00';


const customStyles = {
	// menu: (provided:any, state:any) => ({
	//   ...provided,
	//   width: state.selectProps.width,
	//   borderBottom: '1px dotted pink',
	//   color: state.selectProps.menuColor,
	//   padding: 20,
	// }),

	valueContainer: (provided:any, state:any) => ({
		...provided,
	}),
	menu: (provided:any, state:any) => ({
		...provided,
		color:'#fff',
		width: state.selectProps.width,
		borderBottom: '1px dotted pink',
		backgroundColor:'#0052ff',
		padding: 20,


	}),
	option:(provided:any, state:any) => ({
		...provided,
		"&:hover": {
			backgroundColor:  "#01021a"
		  }
	})

  }




function Table<RowData extends object>(
    props: MaterialTableProps<RowData> & {
        columns: MaterialTableProps<RowData>['columns'];
    } & { description?: string; url?: string}
) {
    const { options } = props;

    const [mode] = usePersistentState('mode', 'dark');

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    const [rowsPerPage, setRowsPerPage] = usePersistentState<number>(
        `rowsPerPage${props.title}`,
        10
    );

    const [hiddenColumns, setHiddenColumns] = usePersistentState<string>(
        `hiddenColumns${props.title}`,
        ''
    );

    const isDarkMode = mode === 'dark';
    const textColor = isDarkMode ? colorsByName['primary'].contrast : '#161616';
    const theme = createTheme({
        palette: {
            background: {
                paper: isDarkMode ? '#01021A' : '#f5f5f5', // background color of table
            },
            text: {
                primary: textColor, // color of all normal text in the table
                secondary: isDarkMode ? '#d4d3d5' : '#434343', // the hover color of the column headers and the color of the text which shows which page the user is on
                // the hover color of the column headers and the color of the text which shows which page the user is on
            },
            action: {
                active: textColor, // color of action buttons such as next page, previous page, first oage, last page, cancel search
                disabled: isDarkMode ? '#afaeb4' : '#595959', // color of disabled action buttons
                selected: isDarkMode ? '#1a1b30' : '#dfdfdf', // selected list item in dropdown
                hover: isDarkMode ? '#26273b' : '#d4d4d4', // hover color of list items in dropdown
                hoverOpacity: 0.1,
            },
        },
    });
    const title = (
        <div className="space-x-2 flex">
            <span
                className="text-xl font-medium text-ellipsis"
                role="link"
                onClick={() => {
                    props.url && window.open(props.url, '_blank');
                }}
            >
                {props.title}
            </span>
            {props.description && <Help description={props.description} />}
        </div>
    );

	// input type select for timezone select
// 	let dropdown = $('#timezone-dropdown');

// dropdown.empty();

// dropdown.append('<option selected="true" disabled>Choose State/Province</option>');
// dropdown.prop('selectedIndex', 0);
    return (
        <MuiThemeProvider theme={theme}>
            <div
                css={css`
						td.MuiTableCell-footer {
							border-bottom: none;
						}

						.MuiPaper-root {
							box-shadow: none !important;
						}
						.dark tbody tr[level="0"]:nth-of-type(even) {
							background-color: rgba(var(--ion-color-primary-rgb), 0.5);
						}
						.dark tbody tr[level="0"]:nth-of-type(odd) {
							background-color: rgba(var(--ion-color-primary-rgb), 0.3);
						}

						table {
							box-shadow: none;
						}
						tbody {
							color: var(--ion-color-primary-contrast);
						}

						tbody tr[level="0"]:nth-of-type(even) {
							background-color: #022f92;
						}
						tbody tr[level="0"]:nth-of-type(odd) {
							background-color: #013fc7;
						}

						tr, td {
							border-bottom : none !important;
						}

						th {
						  font-weight: bold;
						  //height: 200px;
						}
						thead th:first-child, thead th:first-child div, thead th:first-child div span{
                          color: #9945FF
						}

						table {
							--tr-border-radius : 10px;
							--tr-padding-horizontal : 20px;
							--tr-padding-vertical : 10px;
						}

						table:not(first-of-type){
							margin-top: 10px;
						}
						table th{
						    padding: 8px !important;
						}

						tbody tr td:first-of-type {
							padding-left: var(--tr-padding-horizontal);
						}

						tbody tr td:last-child {
							padding-right: var(--tr-padding-horizontal);
						}

						tbody tr td {
							padding: var(-tr-padding-vertical) 0;
						}

						tbody tr:first-of-type td:first-of-type {
							border-radius: var(--tr-border-radius) 0 0 0;
						}
						tbody tr:first-of-type td:last-child {
							border-radius: 0 var(--tr-border-radius) 0 0;
						}
						tbody tr:last-child td:first-of-type {
							border-radius: 0 0 0 var(--tr-border-radius);
						}
						tbody tr:last-child td:last-child {
							border-radius: 0 0 var(--tr-border-radius) 0;
						}

						.MuiToolbar-root {
							justify-content: isMobile ?  space-between : "" ;
							width: 100%;
							flex-wrap: isMobile ? wrap !important : "";
							align-item: isMobile ? center : "";
							display:flex;
							justify-content: isMobile ? center : "";
                        }

			`}
            >
                <div className="sm:hidden">{title}</div>

                <MaterialTable
                    {...props}
                    columns={props.columns.map((column) => ({
                        ...column,
                        cellStyle: {
                            // whiteSpace: 'break-spaces',
                            whiteSpace: 'nowrap',
                            borderBottom: 'none',
                        },
                        hidden: column.title
                            ? hiddenColumns
                                  .split(',')
                                  .includes(column.title as string)
                            : false,
                    }))}

                    title={<div className="hidden sm:block">{title}</div>}
                    options={{
                        headerStyle: {
                            fontSize: '16px',
                            whiteSpace: 'break-spaces',
                            // whiteSpace: 'nowrap',
                            borderBottom: 'none',
                            paddingBottom: 25,
                            ...options?.headerStyle,
                        },
                        pageSize: rowsPerPage, // default rows per page
                        emptyRowsWhenPaging: false, // To avoid of having empty rows
                        pageSizeOptions: [10, 20, 50, 100], // rows selection options
                        paging: props.data.length > 10,
                        ...options,
                    }}
                    icons={{
                        ViewColumn: (() => (
                            <IonIcon className="text-3xl" icon={eye} />
                        )) as any,
                    }}
                    onRowsPerPageChange={(pageSize) => {
                        setRowsPerPage(pageSize);
                    }}
                    onChangeColumnHidden={(column, hidden) => {
                        if (hidden) {
                            setHiddenColumns((hiddenColumns) =>
                                hiddenColumns
                                    ? hiddenColumns + ',' + column.title
                                    : hiddenColumns + column.title
                            );
                        } else {
                            setHiddenColumns((hiddenColumns) =>
                                hiddenColumns
                                    .split(',')
                                    .filter(
                                        (hiddenColumn) =>
                                            hiddenColumn !== column.title
                                    )
                                    .join(',')
                            );
                        }
                    }}
                />
            </div>
        </MuiThemeProvider>
    );
}

export default Table;
