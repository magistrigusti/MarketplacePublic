import { AxiosError } from "axios";

const isAxiosError = (error: unknown): error is AxiosError => {
    return (
        error instanceof Error &&
        error.hasOwnProperty('isAxiosError') &&
        (error as AxiosError).isAxiosError
    );
};
export default isAxiosError;