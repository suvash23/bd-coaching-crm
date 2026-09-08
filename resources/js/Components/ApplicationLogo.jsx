export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="BD Coaching CRM Logo"
            className={`object-contain rounded-xl ${props.className || 'h-10 w-auto'}`}
        />
    );
}
