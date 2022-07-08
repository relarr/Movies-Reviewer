import "./Button.css";

const Button = props => {
    let style = 'button';
    if (props.disabled) style = 'button disabled';
    if (props.alternate) style = 'button alternate';

    return (
        <button 
            className={style}
            style={props.fullWidth && {width:'100%'}}
            type={props.type}
            disabled={props.disabled}
            onClick={props.onClick}>{props.children}</button>
    );
};

export default Button;