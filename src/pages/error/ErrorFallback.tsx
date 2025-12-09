import SimpleErrorPage from "./SimpleErrorPage"

const ErrorFallback = ({ error }: { error: Error }) => {
    return <SimpleErrorPage message={error.message} />
}

export default ErrorFallback