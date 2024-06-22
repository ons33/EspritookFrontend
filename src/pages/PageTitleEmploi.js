import React,{Component} from 'react';

class PageTitleEmploi extends Component {
    render() {
        const {title,dateDebut ,dateFin,annee,status} = this.props;
        return (
            <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">{title} -{annee}
                    {/*<form action="#" className="pt-0 pb-0 ms-auto">*/}
                    {/*    /!*<div className="search-form-2 ms-2">*!/*/}
                    {/*    /!*    <i className="ti-search font-xss"></i>*!/*/}
                    {/*    /!*    <input type="text" className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Search here." />*!/*/}
                    {/*    /!*</div>*!/*/}
                    {/*</form>*/}
                    {/*<a href="/" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i className="feather-filter font-xss text-grey-500"></i></a>*/}
                </h2>
                <p className="review-link font-xssss fw-500 text-grey-500 lh-3"> {dateDebut } - {dateFin}</p>
                <h4 className="text-danger font-xssss fw-700 ls-2">{status}</h4>
            </div>
        );
    }
}

export default PageTitleEmploi;


