import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

function SearchBar({ Data, Keys, Options, Columns, Placeholder, SelectRow }) {
    const { SearchBar } = Search;

    return (
        <ToolkitProvider
            keyField="id"
            data={Data}
        >
            {
                props => (
                    <div>
                        <div className='row'>

                        {Keys && (
                            <div className='col-4' >
                                <span style={{ fontSize: `2.3rem`}}
                                >Total {Data.length} employee</span>
                            </div>

                        )
                        }
                        <div className='d-flex justify-content-evenly ' 
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center"
                            }}>
                            <div
                                style={{
                                    position: "absolute",
                                    left: "46px",
                                    top: "-1%",
                                    transform: `translateY(${-10}%)`,
                                }}
                            >
                                <img className="mt-3 ml-2" src="/SearchIcon.svg" alt='search-icon' />
                            </div>
                            <SearchBar className=" ml-5 mt-1 " style={{ width: 400, paddingLeft: "42px" }} placeholder={Placeholder} {...props.searchProps} />
                            <hr />
                        </div>

                        </div>
                        <BootstrapTable
                            keyField='id'
                            data={props.searchProps.searchText ?
                                Data.filter(d =>
                                    d.date?.toLowerCase().includes(props.searchProps.searchText.toLowerCase()) ||
                                    d.name?.toLowerCase().includes(props.searchProps.searchText.toLowerCase()) ||
                                    d.workDate?.toLowerCase().includes(props.searchProps.searchText.toLowerCase())
                                ) : Data}
                            columns={Columns}
                            striped
                            hover
                            condensed
                            pagination={paginationFactory(Options)}
                            selectRow={SelectRow}

                            noDataIndication={() => <div>No data available</div>}

                        ></BootstrapTable>
                    </div>
                )
            }
        </ToolkitProvider>);
}

export default SearchBar;