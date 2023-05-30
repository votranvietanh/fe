


function DetailInfor(props) {
    const styles = {
        border: '2px solid #1a1a1a',
        width: '50',
        backgroundColor: 'rgb(231 174 168)'

    };
    const formatDate = (dateString) => {
        if (dateString !== null) {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        } else {
            return '';
        }
    }
    // console.log(props.date)
    return (
        <div className='container'>
            <div className='row mb-2'>
                <div className='col-6 d-flex justify-content-start'>
                    <h1 style={{fontSize:"2rem !important"}}>INFORMATIONS</h1>
                </div>
                <div className='col-6 d-flex justify-content-end'>

                </div>
            </div>
            <div className="container">
                <div className="row mt-5">

                    <p className="col-5 mr-4 w-100 p-1" style={styles}>
                        <b>
                            Start Date:
                        </b>{formatDate(props.date)}
                    </p>



                    <p className="col-4 mr-4 w-100 p-1" style={styles}>
                        <b>
                            Address:
                        </b> {props.address}
                    </p>



                </div>
                <div className="row">
                    <p className="col-5 mr-4 w-100 p-1" style={styles}>
                        <b>
                            Sallary per hour: $
                        </b>{props.mph}
                    </p>


                    <p className="col-4 mr-4 w-100 p-1" style={styles}>
                        <b>

                            Team:

                        </b>{props.team}
                    </p>


                </div>
            </div>

        </div >

    );
}

export default DetailInfor;