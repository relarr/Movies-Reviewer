import './DropOnHover.css';

const DropOnHover = props => {
    return (
        <div className='drop-on-hover'>
            <button className='drop-button'>{props.children}</button>
            <div className='content'>
                <p>{props.content}</p>
            </div>
        </div>
    );
};

export default DropOnHover;