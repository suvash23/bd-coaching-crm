export default function ApplicationLogo({ className = 'h-10 w-auto rounded-xl', ...props }) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="BD Coaching CRM Logo"
            className={`object-contain ${className}`}
        />
    );
}
