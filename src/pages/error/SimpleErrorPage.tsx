import React from "react";

export type SimpleErrorPageProps = {
    status?: number;
    title?: string;
    message?: string;
    homeHref?: string;
    onRetry?: () => void;
};

const SimpleErrorPage: React.FC<SimpleErrorPageProps> = ({
    status = 500,
    title,
    message,
    homeHref = "/",
    onRetry,
}) => {
    const resolvedTitle = title ?? (status === 404 ? "Page not found" : "Something went wrong");
    const resolvedMsg =
        message ??
        (status === 404
            ? "The page you’re looking for doesn’t exist or might have been moved."
            : "An unexpected error occurred. Try again, or go back home.");


    return (
        <main className="error-page" aria-live="polite">
            <section className="error-page__card" role="group" aria-label="Error information">
                <h1 className="error-page__title">{resolvedTitle}</h1>
                <p className="error-page__message">{resolvedMsg}</p>
                <div className="error-page__actions">
                    {onRetry && (
                        <button type="button" className="ep-btn" onClick={onRetry}>
                            Try again
                        </button>
                    )}
                    <a className="ep-btn ep-btn--ghost" href={homeHref}>
                        Go home
                    </a>
                </div>
            </section>
            <footer className="error-page__footer">
                If this keeps happening, please contact support.
            </footer>
        </main>
    );
};


export default SimpleErrorPage;