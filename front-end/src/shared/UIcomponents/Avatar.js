import "./Avatar.css";

const Avatar = props => {
    return (
        <div className='avatar' style={props.style}>
            <div className='avatar-image'>
                <img
                    src={props.image}
                    alt={props.alt}
                    style={{ width: props.width, height: props.height }} />
            </div>
            <div className='avatar-info'>
                <label htmlFor={props.label}>{props.label}</label>
                <p>{props.extra} reviews</p>
            </div>            
        </div>
    );
};

export default Avatar;