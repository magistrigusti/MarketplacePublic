import { useIonToast } from '@ionic/react';
import _ from 'lodash';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react'
import { instance } from '../../axios';
import { environment } from '../../environments/environment';


const useFetchChartData = (token:string) => {
    const [data, setData] = useState<any>([]);
    const [present, dismiss] = useIonToast();

    useEffect(() => {
        instance
            .get(
                environment.backendApi +
                    '/receiver/foxTokenHistory?token=' +
                    token
            )
            .then((res) => {
                
                let output = getFormatedStokeData(res.data);
                
                setData([...output])
                
            })
            .catch((err) => {
                console.error(
                    'error when getting fox token history data: ' + err
                );

                present({
                    message:
                        'Error - unable to load chart data. Please refresh and try again',
                    color: 'danger',
                    duration: 8000,
                    buttons: [{ text: 'hide', handler: () => dismiss() }],
                });
            });

      }, [token]);


      const getFormatedStokeData = (stocks:any) => {
        let OutputStokes:any = [];
    
        // * Format data based on our requirements
        stocks.forEach((stock:any) => {
            stock['timestamp'] = parseInt(moment(stock.createdAt).format("X"));
            stock.createdDate = stock.createdAt;
            stock.createdAt = stock.createdAt.split('T')[0];
            stock.floorPrice = parseFloat(stock.floorPrice);
        });
        
        // * Group by token
        let new_stocks = _.groupBy(stocks, 'token');
        
        // * Get All tokens
        let keys = Object.keys(new_stocks);
        
        // * Loop through all tokens and group by created date
        let nn_stocks:any = [];
        keys.forEach(key => {
            nn_stocks.push(_.groupBy(new_stocks[key], 'createdAt'));
        });
        
        // * Loop through all group by created date stocks
        nn_stocks.forEach((stock:any) => {
            // * Get All created dates
            let date_keys = Object.keys(stock);
        
            // * Loop through all created dates
            date_keys.forEach(key => {
                // * Sort array data by timestamp (created date)
                let sortedArray = _.sortBy(stock[key], 'timestamp');
    
                // * Get Five minute difference sorted array

                let fiveMinDiffSortedArray = getFiveMinDiffSortedArray(sortedArray);
                
    
                fiveMinDiffSortedArray.forEach((sortArray:any) => {
                    // * Find Max and Min value of floorPrice from Array
                    let max_value = Math.max(...sortArray.map((o:any) => o.floorPrice));;
                    let min_value = Math.min(...sortArray.map((o:any) => o.floorPrice));
    
                    OutputStokes.push({
                        time:parseInt(moment(sortArray[0].createdDate).format("x")),
                        // "token": sortArray[0].token,
                        open: sortArray[0].floorPrice,
                        close: sortArray[sortArray.length - 1].floorPrice,
                        high: max_value,
                        low: min_value
                    });
                })
            });
        });
    
        
        return OutputStokes;
    }

    const timeDifference = (date1:any,date2:any) => {
        return (date2 - date1) / 60;
    }

    const getFiveMinDiffSortedArray = (sortedArray:any) => {
        let resultArray:any = [];
        let newArray:any = [];
    
        if(sortedArray.length == 1) {
            resultArray.push(sortedArray);
        }else {
            sortedArray.forEach((stock:any, index:number) => {
                if(index == 0) {
                    newArray.push(stock);
                }else {
                    let startDate = moment(newArray[0].timestamp);
                    let endDate = moment(stock.timestamp);
                    let diff = timeDifference(startDate, endDate);
    
                    if(diff < 6) {  
                        newArray.push(stock);
                        if(index == sortedArray.length - 1) {
                            resultArray.push(newArray);
                        }
                    }else {
                        resultArray.push(newArray);
                        newArray = [];
                        newArray.push(stock);
    
                        if(index == sortedArray.length - 1) {
                            resultArray.push(newArray);
                        }
                    }
                }
            });
        }
        return resultArray;
    }
  return data
}

export default useFetchChartData