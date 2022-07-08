import "./Container.css";

const Container = props => {
    return (
        <div className={props.topMargin ? 'container top-margin' : 'container'}>
            {props.children}
        </div>
    );
};

export default Container;