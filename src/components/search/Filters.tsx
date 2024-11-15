import { IonCheckbox } from '@ionic/react';
import React from 'react';

const Filters: React.FC<{
    startDate: string;
    endDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    sources: string[];
    selectedSources: any[];
    onReset: Function;
    setSelectedSources: React.Dispatch<React.SetStateAction<any[]>>;
    setSourceChange: React.Dispatch<React.SetStateAction<boolean>>;
    setToggleFilters: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    sources,
    selectedSources,
    onReset,
    setSelectedSources,
    setSourceChange,
    setToggleFilters
}) => {
    return (
        <div className='relative rounded-md bg-[#01021A] p-5'>
            {/* <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setToggleFilters(false);
                }}
                className="absolute text-lg font-bold right-0"
            >
                x
            </button> */}
            <h4 className="text-lg font-semibold mb-6">Filters</h4>

            <div className="mb-6 text-sm">
                <div className="mb-3 flex-col flex">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        className="border bg-transparent rounded-2xl p-1 px-2 mt-1"
                        type="date"
                        id="startDate"
                        value={startDate}
                        max={endDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="endDate">End Date</label>
                    <input
                        className="border bg-transparent rounded-2xl p-1 px-2 mt-1"
                        type="date"
                        id="endDate"
                        min={startDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <h4 className="text-base font-semibold mb-3">Sources</h4>
            <ul className="">
                {sources &&
                    sources.length > 0 &&
                    sources.map((source: any) => (
                        <li
                            key={`${Math.random()}-${source}`}
                            className="flex items-center mb-2"
                        >
                            <IonCheckbox
                                slot="end"
                                color="primary"
                                id={source}
                                className="mr-2"
                                checked={selectedSources.includes(source)}
                                onIonChange={(e) => {
                                    if (e.detail.checked) {
                                        return setSelectedSources([
                                            ...selectedSources,
                                            source,
                                        ]);
                                    } else {
                                        const a = selectedSources.filter(
                                            (i) => i !== source
                                        );
                                        return setSelectedSources(a);
                                    }
                                }}
                            />
                            <label htmlFor={source}>{source}</label>
                        </li>
                    ))}
            </ul>

            <div className="flex mt-6">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setSourceChange((prev)=> !prev);
                        setToggleFilters(false)
                    }}
                    className="py-1 mx-1 px-2 border bg-primary rounded-md"
                >
                    Apply
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setSourceChange((prev)=> !prev);
                        setToggleFilters(false)
                        onReset();
                    }}
                    className="py-1 mx-1 px-2 border bg-primary rounded-md"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Filters;
